package com.ucu.bdii.ticketing.api;

import com.ucu.bdii.ticketing.domain.EstadoUsuarioGeneral;
import com.ucu.bdii.ticketing.domain.TipoUsuario;
import com.ucu.bdii.ticketing.service.TicketingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TicketingController {

    private final TicketingService service;

    public TicketingController(TicketingService service) {
        this.service = service;
    }

    // =========================================================================
    // USUARIOS
    // =========================================================================

    @PostMapping("/usuarios/general")
    @ResponseStatus(HttpStatus.CREATED)
    public IdResponse registrarUsuarioGeneral(@Valid @RequestBody UsuarioGeneralRequest req) {
        long id = service.registrarUsuarioGeneral(new TicketingService.UsuarioGeneralData(
                req.base().toDomain(TipoUsuario.GENERAL),
                req.fechaRegistro(),
                req.estado().name()));
        return new IdResponse(id);
    }

    @PostMapping("/usuarios/funcionarios")
    @ResponseStatus(HttpStatus.CREATED)
    public IdResponse registrarFuncionario(@Valid @RequestBody FuncionarioRequest req) {
        long id = service.registrarFuncionario(new TicketingService.FuncionarioData(
                req.base().toDomain(TipoUsuario.FUNCIONARIO),
                req.legajo()));
        return new IdResponse(id);
    }

    @PostMapping("/usuarios/admins")
    @ResponseStatus(HttpStatus.CREATED)
    public IdResponse registrarAdmin(@Valid @RequestBody AdminRequest req) {
        long id = service.registrarAdministrador(new TicketingService.AdminPaisSedeData(
                req.base().toDomain(TipoUsuario.ADMIN),
                req.fechaAsignacion()));
        return new IdResponse(id);
    }

    @GetMapping("/usuarios/{idUsuario}/telefonos")
    public Map<String, Object> listarTelefonos(@PathVariable long idUsuario) {
        return Map.of("telefonos", service.listarTelefonosUsuario(idUsuario));
    }

    @GetMapping("/usuarios")
    public Map<String, Object> buscarUsuarioPorMail(@RequestParam String mail) {
        return service.buscarUsuarioPorMail(mail);
    }

    @GetMapping("/usuarios/{idUsuario}/compras")
    public List<Map<String, Object>> comprasDeUsuario(@PathVariable long idUsuario) {
        return service.listarComprasDeUsuario(idUsuario);
    }

    @GetMapping("/usuarios/{idUsuario}/transferencias")
    public List<Map<String, Object>> transferenciasDeUsuario(@PathVariable long idUsuario) {
        return service.listarTransferenciasDeUsuario(idUsuario);
    }

    @GetMapping("/usuarios/{idUsuario}/entradas")
    public List<Map<String, Object>> entradasDeUsuario(@PathVariable long idUsuario) {
        return service.listarEntradasDeUsuario(idUsuario);
    }

    // =========================================================================
    // INFRAESTRUCTURA
    // =========================================================================

    @PostMapping("/estadios")
    @ResponseStatus(HttpStatus.CREATED)
    public IdResponse crearEstadio(@Valid @RequestBody EstadioRequest req) {
        return new IdResponse(service.registrarEstadio(req.nombre()));
    }

    @PostMapping("/equipos")
    @ResponseStatus(HttpStatus.CREATED)
    public IdResponse crearEquipo(@Valid @RequestBody EquipoRequest req) {
        return new IdResponse(service.registrarEquipo(req.nombre(), req.pais()));
    }

    @PostMapping("/estadios/{idEstadio}/sectores")
    @ResponseStatus(HttpStatus.CREATED)
    public IdResponse crearSector(@PathVariable long idEstadio, @Valid @RequestBody SectorRequest req) {
        return new IdResponse(service.registrarSector(req.nombre(), req.capMax(), idEstadio));
    }

    // =========================================================================
    // EVENTOS
    // =========================================================================

    @PostMapping("/eventos")
    @ResponseStatus(HttpStatus.CREATED)
    public IdResponse crearEvento(@Valid @RequestBody EventoRequest req) {
        long id = service.registrarEvento(new TicketingService.EventoRequest(
                req.fecha(), req.hora(), req.idEstadio(),
                req.idAdmPaisSede(), req.equipoLocalId(), req.equipoVisitanteId()));
        return new IdResponse(id);
    }

    @PostMapping("/eventos/{idEvento}/sectores")
    @ResponseStatus(HttpStatus.CREATED)
    public IdResponse habilitarSector(@PathVariable long idEvento, @Valid @RequestBody EventoSectorRequest req) {
        long id = service.habilitarSectorEnEvento(new TicketingService.EventoSectorRequest(
                idEvento, req.idSector(), req.precio(), req.capacidad()));
        return new IdResponse(id);
    }

    @GetMapping("/eventos/sectores-disponibles")
    public List<Map<String, Object>> sectoresDisponiblesParaCompra() {
        return service.listarSectoresDisponiblesParaCompra();
    }

    // =========================================================================
    // DISPOSITIVOS
    // =========================================================================

    @PostMapping("/dispositivos")
    @ResponseStatus(HttpStatus.CREATED)
    public IdResponse crearDispositivo(@Valid @RequestBody DispositivoRequest req) {
        return new IdResponse(service.registrarDispositivo(req.descripcion()));
    }

    @PostMapping("/controles-dispositivo")
    @ResponseStatus(HttpStatus.CREATED)
    public IdResponse crearControl(@Valid @RequestBody ControlDispositivoRequest req) {
        return new IdResponse(service.registrarControlDispositivo(
                new TicketingService.ControlDispositivoRequest(req.idFuncionario(), req.idDispositivo())));
    }

    // =========================================================================
    // COMPRAS
    // =========================================================================

    @PostMapping("/compras")
    @ResponseStatus(HttpStatus.CREATED)
    public IdResponse crearCompra(@Valid @RequestBody CompraRequest req) {
        List<TicketingService.CompraLinea> lineas = req.lineas().stream()
                .map(l -> new TicketingService.CompraLinea(l.idEventoSector(), l.cantidad()))
                .toList();
        long id = service.crearCompra(new TicketingService.CompraRequest(
                req.idUsuarioGeneral(), req.fecha(), lineas));
        return new IdResponse(id);
    }

    // =========================================================================
    // TRANSFERENCIAS
    // =========================================================================

    @PostMapping("/transferencias")
    @ResponseStatus(HttpStatus.CREATED)
    public IdResponse transferirEntrada(@Valid @RequestBody TransferenciaRequest req) {
        long id = service.transferirEntrada(new TicketingService.TransferenciaRequest(
                req.idEntrada(), req.idUsuarioTransfiere(), req.idUsuarioRecibe()));
        return new IdResponse(id);
    }

    @PutMapping("/transferencias/{id}/aceptar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void aceptarTransferencia(@PathVariable long id) {
        service.aceptarTransferencia(id);
    }

    @PutMapping("/transferencias/{id}/rechazar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void rechazarTransferencia(@PathVariable long id) {
        service.rechazarTransferencia(id);
    }

    // =========================================================================
    // ENTRADAS / QR
    // =========================================================================

    @PostMapping("/entradas/validar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void validarEntrada(@Valid @RequestBody ValidacionRequest req) {
        service.validarEntrada(new TicketingService.ValidacionRequest(
                req.idEntrada(), req.idControl(), req.codigoToken(), req.momento()));
    }

    @PostMapping("/entradas/{idEntrada}/token")
    public Map<String, String> renovarToken(@PathVariable long idEntrada, @Valid @RequestBody TokenRequest req) {
        String token = service.renovarToken(idEntrada, req.momento());
        return Map.of("codigoToken", token);
    }

    // =========================================================================
    // ESTADÍSTICAS / RANKINGS
    // =========================================================================

    @GetMapping("/estadisticas/eventos-mas-entradas")
    public List<Map<String, Object>> eventosMasEntradas() {
        return service.rankingEventosMasEntradas();
    }

    @GetMapping("/estadisticas/mayores-compradores")
    public List<Map<String, Object>> mayoresCompradores() {
        return service.rankingMayoresCompradores();
    }

    // =========================================================================
    // HEALTH CHECK — verificar que el backend levantó y llega a la base
    // =========================================================================

    @GetMapping("/health")
    public Map<String, Object> health() {
        return service.health();
    }

    // =========================================================================
    // REQUEST / RESPONSE RECORDS
    // =========================================================================

    public record IdResponse(long id) {}

    public record BaseUsuarioRequest(
            @Email @NotBlank String mail,
            @NotBlank String docPais,
            @NotBlank String docTipo,
            @NotBlank String docNumero,
            @NotBlank String dirPais,
            @NotBlank String dirLocalidad,
            @NotBlank String dirCalle,
            @NotBlank String dirNumero,
            @NotBlank String dirCodigoPostal,
            @NotEmpty List<@NotBlank String> telefonos) {

        TicketingService.BaseUsuario toDomain(TipoUsuario tipo) {
            return new TicketingService.BaseUsuario(
                    mail, docPais, docTipo, docNumero,
                    new TicketingService.Direccion(dirPais, dirLocalidad, dirCalle, dirNumero, dirCodigoPostal),
                    tipo.name(), telefonos);
        }
    }

    public record UsuarioGeneralRequest(
            @Valid BaseUsuarioRequest base,
            @NotNull LocalDate fechaRegistro,
            @NotNull EstadoUsuarioGeneral estado) {}

    public record FuncionarioRequest(
            @Valid BaseUsuarioRequest base,
            @NotBlank String legajo) {}

    public record AdminRequest(
            @Valid BaseUsuarioRequest base,
            @NotNull LocalDate fechaAsignacion) {}

    public record EstadioRequest(@NotBlank String nombre) {}

    public record EquipoRequest(@NotBlank String nombre, @NotBlank String pais) {}

    public record SectorRequest(@NotBlank String nombre, @Positive int capMax) {}

    public record EventoRequest(
            @NotNull LocalDate fecha,
            @NotNull LocalTime hora,
            @Positive long idEstadio,
            @Positive long idAdmPaisSede,
            @Positive long equipoLocalId,
            @Positive long equipoVisitanteId) {}

    public record EventoSectorRequest(
            @Positive long idSector,
            @NotNull @DecimalMin("0.0") BigDecimal precio,
            @Positive int capacidad) {}

    public record DispositivoRequest(@NotBlank String descripcion) {}

    public record ControlDispositivoRequest(
            @Positive long idFuncionario,
            @Positive long idDispositivo) {}

    public record CompraLineaRequest(@Positive long idEventoSector, @Positive int cantidad) {}

    public record CompraRequest(
            @Positive long idUsuarioGeneral,
            @NotNull LocalDate fecha,
            @NotEmpty @Size(max = 5) List<@Valid CompraLineaRequest> lineas) {}

    public record TransferenciaRequest(
            @Positive long idEntrada,
            @Positive long idUsuarioTransfiere,
            @Positive long idUsuarioRecibe) {}

    public record ValidacionRequest(
            @Positive long idEntrada,
            @Positive long idControl,
            @NotBlank String codigoToken,
            @NotNull Instant momento) {}

    public record TokenRequest(@NotNull Instant momento) {}
}