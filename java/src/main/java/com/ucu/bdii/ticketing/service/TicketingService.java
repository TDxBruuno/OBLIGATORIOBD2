package com.ucu.bdii.ticketing.service;

import com.ucu.bdii.ticketing.exception.BusinessRuleException;
import com.ucu.bdii.ticketing.exception.ResourceNotFoundException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class TicketingService {

    private static final int MAX_ENTRADAS_POR_COMPRA = 5;
    private static final int MAX_TRANSFERENCIAS = 3;
    private static final String DEFAULT_TOKEN_SECRET = "ticketing-demo-secret";

    private final JdbcTemplate jdbc;

    public TicketingService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // =========================================================================
    // RECORDS (DTOs internos del service)
    // =========================================================================

    public record Direccion(String pais, String localidad, String calle, String numero, String codigoPostal) {}

    public record BaseUsuario(String mail, String docPais, String docTipo, String docNumero,
                              Direccion direccion, String tipoUsuario, List<String> telefonos) {}

    public record UsuarioGeneralData(BaseUsuario base, LocalDate fechaRegistro, String estado) {}

    public record FuncionarioData(BaseUsuario base, String legajo) {}

    public record AdminPaisSedeData(BaseUsuario base, LocalDate fechaAsignacion) {}

    public record CompraLinea(long idEventoSector, int cantidad) {}

    public record CompraRequest(long idUsuarioGeneral, LocalDate fecha, List<CompraLinea> lineas) {}

    public record TransferenciaRequest(long idEntrada, long idUsuarioTransfiere, long idUsuarioRecibe) {}

    public record ValidacionRequest(long idEntrada, long idControl, String codigoToken, Instant momento) {}

    public record EventoRequest(LocalDate fecha, LocalTime hora, long idEstadio,
                                long idAdmPaisSede, long equipoLocalId, long equipoVisitanteId) {}

    public record EventoSectorRequest(long idEvento, long idSector, BigDecimal precio, int capacidad) {}

    public record ControlDispositivoRequest(long idFuncionario, long idDispositivo) {}

    // =========================================================================
    // USUARIOS
    // =========================================================================

    @Transactional
    public long registrarUsuarioGeneral(UsuarioGeneralData request) {
        assertTipo(request.base().tipoUsuario(), "GENERAL");
        long idUsuario = insertarUsuarioBase(request.base());

        jdbc.update("INSERT INTO usuario_general (id_usuario, fecha_registro, estado) VALUES (?, ?, ?)",
                idUsuario,
                Date.valueOf(request.fechaRegistro()),
                request.estado());

        return idUsuario;
    }

    @Transactional
    public long registrarFuncionario(FuncionarioData request) {
        assertTipo(request.base().tipoUsuario(), "FUNCIONARIO");
        long idUsuario = insertarUsuarioBase(request.base());

        jdbc.update("INSERT INTO funcionario_validacion (id_usuario, num_legajo) VALUES (?, ?)",
                idUsuario,
                request.legajo());

        return idUsuario;
    }

    @Transactional
    public long registrarAdministrador(AdminPaisSedeData request) {
        assertTipo(request.base().tipoUsuario(), "ADMIN");
        long idUsuario = insertarUsuarioBase(request.base());

        jdbc.update("INSERT INTO adm_pais_sede (id_usuario, fecha_asignacion) VALUES (?, ?)",
                idUsuario,
                Date.valueOf(request.fechaAsignacion()));

        return idUsuario;
    }

    public List<String> listarTelefonosUsuario(long idUsuario) {
        return jdbc.queryForList(
                "SELECT telefono FROM telefono_usuario WHERE id_usuario = ? ORDER BY id_telefono",
                String.class, idUsuario);
    }

    public Map<String, Object> buscarUsuarioPorMail(String mail) {
        return jdbc.queryForList(
                        "SELECT id_usuario, mail, tipo_usuario " +
                                "FROM usuarios " +
                                "WHERE mail = ?",
                        mail
                ).stream()
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException("No existe un usuario con ese mail"));
    }
    // =========================================================================
    // INFRAESTRUCTURA: ESTADIO, EQUIPO, SECTOR
    // =========================================================================

    @Transactional
    public long registrarEstadio(String nombre) {
        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO estadio (nombre) VALUES (?)", Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, nombre);
            return ps;
        }, kh);
        return Objects.requireNonNull(kh.getKey()).longValue();
    }

    @Transactional
    public long registrarEquipo(String nombre, String pais) {
        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO equipo (nombre, pais) VALUES (?, ?)", Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, nombre);
            ps.setString(2, pais);
            return ps;
        }, kh);
        return Objects.requireNonNull(kh.getKey()).longValue();
    }

    @Transactional
    public long registrarSector(String nombre, int capMax, long idEstadio) {
        if (capMax <= 0) throw new BusinessRuleException("La capacidad máxima del sector debe ser mayor a 0");
        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO sector (nombre, cap_max, id_estadio) VALUES (?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, nombre);
            ps.setInt(2, capMax);
            ps.setLong(3, idEstadio);
            return ps;
        }, kh);
        return Objects.requireNonNull(kh.getKey()).longValue();
    }

    // =========================================================================
    // EVENTOS
    // =========================================================================

    @Transactional
    public long registrarEvento(EventoRequest request) {
        // Verificar que el admin existe y es del tipo correcto
        String tipoAdmin = jdbc.queryForList(
                        "SELECT tipo_usuario FROM usuarios WHERE id_usuario = ?",
                        String.class, request.idAdmPaisSede())
                .stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("El administrador no existe"));
        assertTipo(tipoAdmin, "ADMIN");

        // Verificar que local != visitante
        if (request.equipoLocalId() == request.equipoVisitanteId()) {
            throw new BusinessRuleException("El equipo local y visitante no pueden ser el mismo");
        }

        // Verificar no solapamiento (ventana de 2hs)
        Integer solapamiento = jdbc.queryForObject(
                "SELECT COUNT(*) FROM evento " +
                        "WHERE id_estadio = ? AND fecha = ? " +
                        "AND hora < ADDTIME(?, '02:00:00') " +
                        "AND ADDTIME(hora, '02:00:00') > ?",
                Integer.class,
                request.idEstadio(),
                Date.valueOf(request.fecha()),
                Time.valueOf(request.hora()),
                Time.valueOf(request.hora()));

        if (solapamiento != null && solapamiento > 0) {
            throw new BusinessRuleException("El evento se superpone con otro evento en el mismo estadio");
        }

        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO evento (fecha, hora, id_estadio, id_adm_pais_sede, equipo_local_id, equipo_visitante_id) " +
                            "VALUES (?, ?, ?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
            ps.setDate(1, Date.valueOf(request.fecha()));
            ps.setTime(2, Time.valueOf(request.hora()));
            ps.setLong(3, request.idEstadio());
            ps.setLong(4, request.idAdmPaisSede());
            ps.setLong(5, request.equipoLocalId());
            ps.setLong(6, request.equipoVisitanteId());
            return ps;
        }, kh);
        return Objects.requireNonNull(kh.getKey()).longValue();
    }

    @Transactional
    public long habilitarSectorEnEvento(EventoSectorRequest request) {
        // Verificar que el sector pertenece al mismo estadio que el evento
        Long idEstadioEvento = jdbc.queryForList(
                        "SELECT id_estadio FROM evento WHERE id_evento = ?",
                        Long.class, request.idEvento())
                .stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("El evento no existe"));

        Long idEstadioSector = jdbc.queryForList(
                        "SELECT id_estadio FROM sector WHERE id_sector = ?",
                        Long.class, request.idSector())
                .stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("El sector no existe"));

        if (!idEstadioEvento.equals(idEstadioSector)) {
            throw new BusinessRuleException("El sector debe pertenecer al mismo estadio que el evento");
        }

        // Verificar capacidad vs cap_max del sector
        Integer capMax = jdbc.queryForObject(
                "SELECT cap_max FROM sector WHERE id_sector = ?",
                Integer.class, request.idSector());
        if (capMax == null || request.capacidad() > capMax) {
            throw new BusinessRuleException("La capacidad excede el máximo permitido del sector (" + capMax + ")");
        }

        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO evento_sector (id_evento, id_sector, precio, capacidad) VALUES (?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, request.idEvento());
            ps.setLong(2, request.idSector());
            ps.setBigDecimal(3, request.precio());
            ps.setInt(4, request.capacidad());
            return ps;
        }, kh);
        return Objects.requireNonNull(kh.getKey()).longValue();
    }

    // =========================================================================
    // DISPOSITIVOS
    // =========================================================================

    @Transactional
    public long registrarDispositivo(String descripcion) {
        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO dispositivo (descripcion) VALUES (?)", Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, descripcion);
            return ps;
        }, kh);
        return Objects.requireNonNull(kh.getKey()).longValue();
    }

    @Transactional
    public long registrarControlDispositivo(ControlDispositivoRequest request) {
        String tipoFuncionario = jdbc.queryForList(
                        "SELECT tipo_usuario FROM usuarios WHERE id_usuario = ?",
                        String.class, request.idFuncionario())
                .stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("El funcionario no existe"));
        assertTipo(tipoFuncionario, "FUNCIONARIO");

        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO control_dispositivo (id_funcionario, id_dispositivo) VALUES (?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, request.idFuncionario());
            ps.setLong(2, request.idDispositivo());
            return ps;
        }, kh);
        return Objects.requireNonNull(kh.getKey()).longValue();
    }

    // =========================================================================
    // COMPRAS
    // =========================================================================

    @Transactional
    public long crearCompra(CompraRequest request) {
        // Verificar que el usuario es GENERAL
        String tipo = jdbc.queryForList(
                        "SELECT tipo_usuario FROM usuarios WHERE id_usuario = ?",
                        String.class, request.idUsuarioGeneral())
                .stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("El usuario no existe"));
        assertTipo(tipo, "GENERAL");

        if (request.lineas() == null || request.lineas().isEmpty()) {
            throw new BusinessRuleException("La compra debe tener al menos una entrada");
        }

        // Contar total de entradas y calcular subtotal
        int totalEntradas = 0;
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CompraLinea linea : request.lineas()) {
            if (linea.cantidad() <= 0) {
                throw new BusinessRuleException("Cada línea debe tener al menos una entrada");
            }
            totalEntradas += linea.cantidad();

            BigDecimal precio = jdbc.queryForList(
                            "SELECT precio FROM evento_sector WHERE id_evento_sector = ?",
                            BigDecimal.class, linea.idEventoSector())
                    .stream().findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("El evento_sector no existe"));

            subtotal = subtotal.add(precio.multiply(BigDecimal.valueOf(linea.cantidad())));
        }

        if (totalEntradas > MAX_ENTRADAS_POR_COMPRA) {
            throw new BusinessRuleException("Una compra no puede tener más de " + MAX_ENTRADAS_POR_COMPRA + " entradas");
        }

        // Buscar tarifa vigente
        List<Map<String, Object>> tarifas = jdbc.queryForList(
                "SELECT id_tarifa_comision, porcentaje FROM tarifa_comision " +
                        "WHERE fecha_desde <= ? AND (fecha_hasta IS NULL OR fecha_hasta >= ?) " +
                        "ORDER BY fecha_desde DESC, id_tarifa_comision DESC LIMIT 1",
                Date.valueOf(request.fecha()), Date.valueOf(request.fecha()));

        if (tarifas.isEmpty()) {
            throw new BusinessRuleException("No hay tarifa de comisión vigente para la fecha indicada");
        }

        long idTarifa = ((Number) tarifas.get(0).get("id_tarifa_comision")).longValue();
        BigDecimal porcentaje = (BigDecimal) tarifas.get(0).get("porcentaje");
        BigDecimal comision = subtotal.multiply(porcentaje).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(comision);

        // Insertar compra
        KeyHolder khCompra = new GeneratedKeyHolder();
        jdbc.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO compra (fecha, estado, monto_total, id_tarifa_comision, id_usuario) VALUES (?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setDate(1, Date.valueOf(request.fecha()));
            ps.setString(2, "PENDIENTE");
            ps.setBigDecimal(3, total);
            ps.setLong(4, idTarifa);
            ps.setLong(5, request.idUsuarioGeneral());
            return ps;
        }, khCompra);
        long idCompra = Objects.requireNonNull(khCompra.getKey()).longValue();

        // Insertar entradas
        for (CompraLinea linea : request.lineas()) {
            for (int i = 0; i < linea.cantidad(); i++) {
                final long idEntradaRef;
                KeyHolder khEntrada = new GeneratedKeyHolder();
                final long idEvSec = linea.idEventoSector();
                jdbc.update(conn -> {
                    PreparedStatement ps = conn.prepareStatement(
                            "INSERT INTO entrada (codigo_token, id_usuario_actual, id_compra, id_evento_sector, id_control, fecha_validacion) " +
                                    "VALUES (?, ?, ?, ?, NULL, NULL)",
                            Statement.RETURN_GENERATED_KEYS);
                    ps.setString(1, "tmp-" + System.nanoTime());
                    ps.setLong(2, request.idUsuarioGeneral());
                    ps.setLong(3, idCompra);
                    ps.setLong(4, idEvSec);
                    return ps;
                }, khEntrada);

                long idEntrada = Objects.requireNonNull(khEntrada.getKey()).longValue();
                // Generar token real con el id ya conocido
                String token = generarToken(idEntrada, Instant.now());
                jdbc.update("UPDATE entrada SET codigo_token = ? WHERE id_entrada = ?", token, idEntrada);
            }
        }

        return idCompra;
    }

    // =========================================================================
    // TRANSFERENCIAS
    // =========================================================================

    @Transactional
    public long transferirEntrada(TransferenciaRequest request) {
        Map<String, Object> entrada = jdbc.queryForList(
                        "SELECT id_usuario_actual, fecha_validacion FROM entrada WHERE id_entrada = ?",
                        request.idEntrada())
                .stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("La entrada no existe"));

        long propietario = ((Number) entrada.get("id_usuario_actual")).longValue();
        if (propietario != request.idUsuarioTransfiere()) {
            throw new BusinessRuleException("Solo el propietario actual puede transferir la entrada");
        }

        if (entrada.get("fecha_validacion") != null) {
            throw new BusinessRuleException("La entrada ya fue validada y no puede transferirse");
        }

        Integer cantTransferencias = jdbc.queryForObject(
                "SELECT COUNT(*) FROM transferencia_entrada WHERE id_entrada = ?",
                Integer.class, request.idEntrada());
        if (cantTransferencias != null && cantTransferencias >= MAX_TRANSFERENCIAS) {
            throw new BusinessRuleException("La entrada alcanzó el máximo de " + MAX_TRANSFERENCIAS + " transferencias");
        }

        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO transferencia_entrada (id_usuario_transfiere, id_usuario_recibe, id_entrada, estado) VALUES (?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, request.idUsuarioTransfiere());
            ps.setLong(2, request.idUsuarioRecibe());
            ps.setLong(3, request.idEntrada());
            ps.setString(4, "PENDIENTE");
            return ps;
        }, kh);
        return Objects.requireNonNull(kh.getKey()).longValue();
    }

    @Transactional
    public void aceptarTransferencia(long idTransferencia) {
        Map<String, Object> transf = leerTransferencia(idTransferencia);

        if (!"PENDIENTE".equals(transf.get("estado"))) {
            throw new BusinessRuleException("La transferencia no está en estado PENDIENTE");
        }

        jdbc.update("UPDATE transferencia_entrada SET estado = 'ACEPTADA' WHERE id_transferencia = ?",
                idTransferencia);

        long idEntrada = ((Number) transf.get("id_entrada")).longValue();
        long idRecibe = ((Number) transf.get("id_usuario_recibe")).longValue();
        jdbc.update("UPDATE entrada SET id_usuario_actual = ? WHERE id_entrada = ?", idRecibe, idEntrada);
    }

    @Transactional
    public void rechazarTransferencia(long idTransferencia) {
        Map<String, Object> transf = leerTransferencia(idTransferencia);

        if (!"PENDIENTE".equals(transf.get("estado"))) {
            throw new BusinessRuleException("La transferencia no está en estado PENDIENTE");
        }

        jdbc.update("UPDATE transferencia_entrada SET estado = 'RECHAZADA' WHERE id_transferencia = ?",
                idTransferencia);
    }

    // =========================================================================
    // VALIDACIÓN DE ENTRADAS (QR)
    // =========================================================================

    @Transactional
    public void validarEntrada(ValidacionRequest request) {
        Map<String, Object> entrada = jdbc.queryForList(
                        "SELECT codigo_token, fecha_validacion FROM entrada WHERE id_entrada = ?",
                        request.idEntrada())
                .stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("La entrada no existe"));

        if (entrada.get("fecha_validacion") != null) {
            throw new BusinessRuleException("La entrada ya fue validada");
        }

        if (!request.codigoToken().equals(entrada.get("codigo_token"))) {
            throw new BusinessRuleException("El token QR no es válido o expiró");
        }

        Integer existeControl = jdbc.queryForObject(
                "SELECT COUNT(*) FROM control_dispositivo WHERE id_control = ?",
                Integer.class, request.idControl());
        if (existeControl == null || existeControl == 0) {
            throw new BusinessRuleException("El dispositivo de control no existe");
        }

        jdbc.update("UPDATE entrada SET id_control = ?, fecha_validacion = ? WHERE id_entrada = ?",
                request.idControl(),
                Timestamp.from(request.momento()),
                request.idEntrada());
    }

    @Transactional
    public String renovarToken(long idEntrada, Instant momento) {
        Map<String, Object> entrada = jdbc.queryForList(
                        "SELECT fecha_validacion FROM entrada WHERE id_entrada = ?",
                        idEntrada)
                .stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("La entrada no existe"));

        if (entrada.get("fecha_validacion") != null) {
            throw new BusinessRuleException("La entrada ya fue validada, no se puede renovar el token");
        }

        String nuevoToken = generarToken(idEntrada, momento);
        jdbc.update("UPDATE entrada SET codigo_token = ? WHERE id_entrada = ?", nuevoToken, idEntrada);
        return nuevoToken;
    }

    // =========================================================================
    // CONSULTAS (letra: compras, transferencias, entradas, rankings)
    // =========================================================================

    public List<Map<String, Object>> listarComprasDeUsuario(long idUsuario) {
        return jdbc.queryForList(
                "SELECT c.id_compra, c.fecha, c.estado, c.monto_total, " +
                        "       tc.porcentaje AS comision, " +
                        "       COUNT(e.id_entrada) AS cantidad_entradas " +
                        "FROM compra c " +
                        "JOIN tarifa_comision tc ON tc.id_tarifa_comision = c.id_tarifa_comision " +
                        "LEFT JOIN entrada e ON e.id_compra = c.id_compra " +
                        "WHERE c.id_usuario = ? " +
                        "GROUP BY c.id_compra, c.fecha, c.estado, c.monto_total, tc.porcentaje " +
                        "ORDER BY c.fecha DESC",
                idUsuario);
    }

    public List<Map<String, Object>> listarTransferenciasDeUsuario(long idUsuario) {
        return jdbc.queryForList(
                "SELECT te.id_transferencia, te.id_entrada, te.fecha_transferencia, te.estado, " +
                        "       te.id_usuario_transfiere, te.id_usuario_recibe, " +
                        "       CASE WHEN te.id_usuario_transfiere = ? THEN 'ENVIADA' ELSE 'RECIBIDA' END AS direccion " +
                        "FROM transferencia_entrada te " +
                        "WHERE te.id_usuario_transfiere = ? OR te.id_usuario_recibe = ? " +
                        "ORDER BY te.fecha_transferencia DESC",
                idUsuario, idUsuario, idUsuario);
    }

    public List<Map<String, Object>> listarEntradasDeUsuario(long idUsuario) {
        return jdbc.queryForList(
                "SELECT e.id_entrada, e.codigo_token, e.fecha_validacion, " +
                        "       ev.fecha AS fecha_evento, ev.hora AS hora_evento, " +
                        "       est.nombre AS estadio, " +
                        "       s.nombre AS sector, " +
                        "       es.precio, " +
                        "       eq_l.nombre AS equipo_local, " +
                        "       eq_v.nombre AS equipo_visitante, " +
                        "       CASE WHEN e.fecha_validacion IS NULL THEN 'ACTIVA' ELSE 'CONSUMIDA' END AS estado_entrada " +
                        "FROM entrada e " +
                        "JOIN evento_sector es ON es.id_evento_sector = e.id_evento_sector " +
                        "JOIN evento ev ON ev.id_evento = es.id_evento " +
                        "JOIN estadio est ON est.id_estadio = ev.id_estadio " +
                        "JOIN sector s ON s.id_sector = es.id_sector " +
                        "JOIN equipo eq_l ON eq_l.id_equipo = ev.equipo_local_id " +
                        "JOIN equipo eq_v ON eq_v.id_equipo = ev.equipo_visitante_id " +
                        "WHERE e.id_usuario_actual = ? " +
                        "ORDER BY ev.fecha, ev.hora",
                idUsuario);
    }

    public List<Map<String, Object>> rankingEventosMasEntradas() {
        return jdbc.queryForList(
                "SELECT ev.id_evento, " +
                        "       eq_l.nombre AS equipo_local, " +
                        "       eq_v.nombre AS equipo_visitante, " +
                        "       ev.fecha, ev.hora, " +
                        "       est.nombre AS estadio, " +
                        "       COUNT(e.id_entrada) AS total_entradas_vendidas " +
                        "FROM evento ev " +
                        "JOIN equipo eq_l ON eq_l.id_equipo = ev.equipo_local_id " +
                        "JOIN equipo eq_v ON eq_v.id_equipo = ev.equipo_visitante_id " +
                        "JOIN estadio est ON est.id_estadio = ev.id_estadio " +
                        "JOIN evento_sector es ON es.id_evento = ev.id_evento " +
                        "LEFT JOIN entrada e ON e.id_evento_sector = es.id_evento_sector " +
                        "GROUP BY ev.id_evento, eq_l.nombre, eq_v.nombre, ev.fecha, ev.hora, est.nombre " +
                        "ORDER BY total_entradas_vendidas DESC");
    }

    public List<Map<String, Object>> rankingMayoresCompradores() {
        return jdbc.queryForList(
                "SELECT u.id_usuario, u.mail, " +
                        "       COUNT(DISTINCT c.id_compra) AS total_compras, " +
                        "       COUNT(e.id_entrada) AS total_entradas, " +
                        "       COALESCE(SUM(c.monto_total), 0) AS total_gastado " +
                        "FROM usuarios u " +
                        "JOIN usuario_general ug ON ug.id_usuario = u.id_usuario " +
                        "LEFT JOIN compra c ON c.id_usuario = u.id_usuario " +
                        "LEFT JOIN entrada e ON e.id_compra = c.id_compra " +
                        "GROUP BY u.id_usuario, u.mail " +
                        "ORDER BY total_entradas DESC, total_gastado DESC");
    }

    // =========================================================================
    // HEALTH CHECK
    // =========================================================================

    public Map<String, Object> health() {
        Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("status", "UP");
        result.put("timestamp", Instant.now().toString());
        try {
            Map<String, Object> counts = new java.util.LinkedHashMap<>();
            counts.put("usuarios",  jdbc.queryForObject("SELECT COUNT(*) FROM usuarios",  Integer.class));
            counts.put("eventos",   jdbc.queryForObject("SELECT COUNT(*) FROM evento",     Integer.class));
            counts.put("entradas",  jdbc.queryForObject("SELECT COUNT(*) FROM entrada",    Integer.class));
            counts.put("compras",   jdbc.queryForObject("SELECT COUNT(*) FROM compra",     Integer.class));
            result.put("db", "OK");
            result.put("counts", counts);
        } catch (Exception e) {
            result.put("db", "ERROR: " + e.getMessage());
        }
        return result;
    }

    // =========================================================================
    // HELPERS PRIVADOS
    // =========================================================================

    private long insertarUsuarioBase(BaseUsuario base) {
        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO usuarios (mail, doc_pais, doc_tipo, doc_numero, " +
                            "dir_pais, dir_localidad, dir_calle, dir_numero, dir_codigo_postal, tipo_usuario) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, base.mail());
            ps.setString(2, base.docPais());
            ps.setString(3, base.docTipo());
            ps.setString(4, base.docNumero());
            ps.setString(5, base.direccion().pais());
            ps.setString(6, base.direccion().localidad());
            ps.setString(7, base.direccion().calle());
            ps.setString(8, base.direccion().numero());
            ps.setString(9, base.direccion().codigoPostal());
            ps.setString(10, base.tipoUsuario());
            return ps;
        }, kh);

        long idUsuario = Objects.requireNonNull(kh.getKey()).longValue();

        if (base.telefonos() != null) {
            for (String telefono : base.telefonos()) {
                jdbc.update("INSERT INTO telefono_usuario (id_usuario, telefono) VALUES (?, ?)",
                        idUsuario, telefono);
            }
        }

        return idUsuario;
    }

    private Map<String, Object> leerTransferencia(long idTransferencia) {
        return jdbc.queryForList(
                        "SELECT id_entrada, id_usuario_recibe, estado FROM transferencia_entrada WHERE id_transferencia = ?",
                        idTransferencia)
                .stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("La transferencia no existe"));
    }

    private void assertTipo(String tipoActual, String tipoEsperado) {
        if (!tipoEsperado.equals(tipoActual)) {
            throw new BusinessRuleException("Se esperaba un usuario de tipo " + tipoEsperado + " pero es " + tipoActual);
        }
    }

    private String generarToken(long idEntrada, Instant momento) {
        String secret = System.getenv("TICKETING_TOKEN_SECRET");
        if (secret == null || secret.isBlank()) secret = DEFAULT_TOKEN_SECRET;

        long timeSlot = momento.atZone(ZoneOffset.UTC).toEpochSecond() / 30L;
        String raw = idEntrada + ":" + timeSlot + ":" + secret;

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 no disponible", e);
        }
    }
}