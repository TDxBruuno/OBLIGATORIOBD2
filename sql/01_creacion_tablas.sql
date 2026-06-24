-- ============================================================================
-- MER OBLIGATORIO 2026 - Sistema de Ticketing Mundial 2026
-- Script de creación de tablas
-- ============================================================================
-- Notas de diseño:
-- 1) USUARIOS es una especialización TOTAL-EXCLUSIVA (T,e) en:
--      USUARIO_GENERAL / FUNCIONARIO_VALIDACION / ADM_PAIS_SEDE
--    Se modela con tablas especializadas (cada subtipo referencia a usuarios por PK/FK).
-- 2) CONTROLA es una AGREGACIÓN entre FUNCIONARIO_VALIDACION y DISPOSITIVO.
--    Se modela como entidad propia (control_dispositivo) ya que es el objeto
--    que participa en la relación VALIDA con ENTRADA.
-- 3) VALIDA: control_dispositivo (0,N) -- entrada (0,1): una entrada se valida
--    como máximo una vez; un funcionario con su dispositivo valida muchas entradas.
-- 4) JUEGA aparece dos veces (Local / Visitante) entre EVENTO y EQUIPO: se
--    modelan como dos FK distintas en EVENTO (equipo_local_id, equipo_visitante_id).
-- 5) TRANSFIERE/RECIBE es una relación recursiva TERNARIA: usuario que transfiere,
--    usuario que recibe, y la entrada concreta que se transfiere.
-- 6) Se agregan restricciones de integridad referencial y de dominio (CHECK) para
--    garantizar la coherencia de los datos.
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS transferencia_entrada;
DROP TABLE IF EXISTS entrada;
DROP TABLE IF EXISTS control_dispositivo;
DROP TABLE IF EXISTS dispositivo;
DROP TABLE IF EXISTS compra;
DROP TABLE IF EXISTS tarifa_comision;
DROP TABLE IF EXISTS evento_sector;
DROP TABLE IF EXISTS evento;
DROP TABLE IF EXISTS sector;
DROP TABLE IF EXISTS estadio;
DROP TABLE IF EXISTS equipo;
DROP TABLE IF EXISTS adm_pais_sede;
DROP TABLE IF EXISTS funcionario_validacion;
DROP TABLE IF EXISTS usuario_general;
DROP TABLE IF EXISTS telefono_usuario;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- ENTIDAD: USUARIOS (entidad base de la especialización)
-- ============================================================================
CREATE TABLE usuarios (
    id_usuario        BIGINT NOT NULL AUTO_INCREMENT,
    mail              VARCHAR(150) NOT NULL,
    doc_pais          VARCHAR(60)  NOT NULL,
    doc_tipo          VARCHAR(20)  NOT NULL,
    doc_numero        VARCHAR(30)  NOT NULL,
    dir_pais          VARCHAR(60)  NOT NULL,
    dir_localidad     VARCHAR(80)  NOT NULL,
    dir_calle         VARCHAR(120) NOT NULL,
    dir_numero        VARCHAR(15)  NOT NULL,
    dir_codigo_postal VARCHAR(15)  NOT NULL,
    tipo_usuario      VARCHAR(20)  NOT NULL,

    PRIMARY KEY (id_usuario),
    UNIQUE KEY uq_usuarios_mail (mail),
    UNIQUE KEY uq_usuarios_documento (doc_pais, doc_tipo, doc_numero),
    CONSTRAINT ck_usuarios_tipo CHECK (tipo_usuario IN ('GENERAL', 'FUNCIONARIO', 'ADMIN'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- TELÉFONOS DE USUARIO (multivaluado)
-- ============================================================================
CREATE TABLE telefono_usuario (
    id_telefono BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario  BIGINT NOT NULL,
    telefono    VARCHAR(30) NOT NULL,

    PRIMARY KEY (id_telefono),
    KEY idx_telefono_usuario (id_usuario),
    CONSTRAINT fk_telefono_usuario_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- SUBTIPO: USUARIO_GENERAL
-- ============================================================================
CREATE TABLE usuario_general (
    id_usuario      BIGINT NOT NULL,
    fecha_registro  DATE NOT NULL,
    estado          VARCHAR(20) NOT NULL,

    PRIMARY KEY (id_usuario),
    CONSTRAINT fk_usuario_general_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT ck_usuario_general_estado CHECK (estado IN ('ACTIVO', 'INACTIVO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- SUBTIPO: FUNCIONARIO_VALIDACION
-- ============================================================================
CREATE TABLE funcionario_validacion (
    id_usuario  BIGINT NOT NULL,
    num_legajo  VARCHAR(30) NOT NULL,

    PRIMARY KEY (id_usuario),
    UNIQUE KEY uq_funcionario_legajo (num_legajo),
    CONSTRAINT fk_funcionario_validacion_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- SUBTIPO: ADM_PAIS_SEDE
-- ============================================================================
CREATE TABLE adm_pais_sede (
    id_usuario        BIGINT NOT NULL,
    fecha_asignacion  DATE NOT NULL,

    PRIMARY KEY (id_usuario),
    CONSTRAINT fk_adm_pais_sede_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- ENTIDAD: EQUIPO
-- ============================================================================
CREATE TABLE equipo (
    id_equipo BIGINT NOT NULL AUTO_INCREMENT,
    nombre    VARCHAR(100) NOT NULL,
    pais      VARCHAR(60),

    PRIMARY KEY (id_equipo),
    UNIQUE KEY uq_equipo_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- ENTIDAD: ESTADIO
-- ============================================================================
CREATE TABLE estadio (
    id_estadio BIGINT NOT NULL AUTO_INCREMENT,
    nombre     VARCHAR(150) NOT NULL,

    PRIMARY KEY (id_estadio),
    UNIQUE KEY uq_estadio_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- ENTIDAD: SECTOR
-- ============================================================================
CREATE TABLE sector (
    id_sector  BIGINT NOT NULL AUTO_INCREMENT,
    nombre     VARCHAR(20) NOT NULL,
    cap_max    INT NOT NULL,
    id_estadio BIGINT NOT NULL,

    PRIMARY KEY (id_sector),
    KEY idx_sector_estadio (id_estadio),
    CONSTRAINT fk_sector_estadio
        FOREIGN KEY (id_estadio) REFERENCES estadio(id_estadio),
    CONSTRAINT ck_sector_cap_max CHECK (cap_max > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- ENTIDAD: EVENTO
-- ============================================================================
CREATE TABLE evento (
    id_evento           BIGINT NOT NULL AUTO_INCREMENT,
    fecha               DATE NOT NULL,
    hora                TIME NOT NULL,
    id_estadio          BIGINT NOT NULL,
    id_adm_pais_sede    BIGINT NOT NULL,
    equipo_local_id     BIGINT NOT NULL,
    equipo_visitante_id BIGINT NOT NULL,

    PRIMARY KEY (id_evento),
    KEY idx_evento_estadio (id_estadio),
    KEY idx_evento_admin (id_adm_pais_sede),
    CONSTRAINT fk_evento_estadio
        FOREIGN KEY (id_estadio) REFERENCES estadio(id_estadio),
    CONSTRAINT fk_evento_admin
        FOREIGN KEY (id_adm_pais_sede) REFERENCES adm_pais_sede(id_usuario),
    CONSTRAINT fk_evento_equipo_local
        FOREIGN KEY (equipo_local_id) REFERENCES equipo(id_equipo),
    CONSTRAINT fk_evento_equipo_visitante
        FOREIGN KEY (equipo_visitante_id) REFERENCES equipo(id_equipo),
    CONSTRAINT ck_evento_equipos_distintos CHECK (equipo_local_id <> equipo_visitante_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- ENTIDAD: EVENTO_SECTOR (sectores habilitados por evento)
-- ============================================================================
CREATE TABLE evento_sector (
    id_evento_sector BIGINT NOT NULL AUTO_INCREMENT,
    id_evento        BIGINT NOT NULL,
    id_sector        BIGINT NOT NULL,
    precio           DECIMAL(10,2) NOT NULL,
    capacidad        INT NOT NULL,

    PRIMARY KEY (id_evento_sector),
    UNIQUE KEY uq_evento_sector (id_evento, id_sector),
    KEY idx_evento_sector_evento (id_evento),
    KEY idx_evento_sector_sector (id_sector),
    CONSTRAINT fk_evento_sector_evento
        FOREIGN KEY (id_evento) REFERENCES evento(id_evento),
    CONSTRAINT fk_evento_sector_sector
        FOREIGN KEY (id_sector) REFERENCES sector(id_sector),
    CONSTRAINT ck_evento_sector_precio CHECK (precio >= 0),
    CONSTRAINT ck_evento_sector_capacidad CHECK (capacidad > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- TARIFA DE COMISIONES (histórico de tasas)
-- ============================================================================
CREATE TABLE tarifa_comision (
    id_tarifa_comision BIGINT NOT NULL AUTO_INCREMENT,
    fecha_desde        DATE NOT NULL,
    fecha_hasta        DATE NULL,
    porcentaje         DECIMAL(5,2) NOT NULL,

    PRIMARY KEY (id_tarifa_comision),
    CONSTRAINT ck_tarifa_comision_porcentaje CHECK (porcentaje >= 0 AND porcentaje <= 100),
    CONSTRAINT ck_tarifa_comision_fechas CHECK (fecha_hasta IS NULL OR fecha_hasta >= fecha_desde)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tarifa inicial del 5%
INSERT INTO tarifa_comision (fecha_desde, fecha_hasta, porcentaje)
VALUES ('2026-01-01', NULL, 5.00);

-- ============================================================================
-- ENTIDAD: COMPRA
-- ============================================================================
CREATE TABLE compra (
    id_compra          BIGINT NOT NULL AUTO_INCREMENT,
    fecha              DATE NOT NULL,
    estado             VARCHAR(20) NOT NULL,
    monto_total        DECIMAL(10,2) NOT NULL,
    id_tarifa_comision BIGINT NOT NULL DEFAULT 1,
    id_usuario         BIGINT NOT NULL,

    PRIMARY KEY (id_compra),
    KEY idx_compra_usuario (id_usuario),
    CONSTRAINT fk_compra_tarifa_comision
        FOREIGN KEY (id_tarifa_comision) REFERENCES tarifa_comision(id_tarifa_comision),
    CONSTRAINT fk_compra_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario_general(id_usuario),
    CONSTRAINT ck_compra_estado CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'PAGADA', 'CANCELADA')),
    CONSTRAINT ck_compra_monto_total CHECK (monto_total >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- ENTIDAD: DISPOSITIVO
-- ============================================================================
CREATE TABLE dispositivo (
    id_dispositivo BIGINT NOT NULL AUTO_INCREMENT,
    descripcion    VARCHAR(150),

    PRIMARY KEY (id_dispositivo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- AGREGACIÓN: CONTROL_DISPOSITIVO (Funcionario + Dispositivo)
-- ============================================================================
CREATE TABLE control_dispositivo (
    id_control     BIGINT NOT NULL AUTO_INCREMENT,
    id_funcionario BIGINT NOT NULL,
    id_dispositivo BIGINT NOT NULL,

    PRIMARY KEY (id_control),
    UNIQUE KEY uq_control_funcionario (id_funcionario),
    UNIQUE KEY uq_control_dispositivo (id_dispositivo),
    CONSTRAINT fk_control_funcionario
        FOREIGN KEY (id_funcionario) REFERENCES funcionario_validacion(id_usuario),
    CONSTRAINT fk_control_dispositivo
        FOREIGN KEY (id_dispositivo) REFERENCES dispositivo(id_dispositivo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- ENTIDAD: ENTRADA
-- ============================================================================
CREATE TABLE entrada (
    id_entrada        BIGINT NOT NULL AUTO_INCREMENT,
    codigo_token      VARCHAR(100) NOT NULL,
    id_usuario_actual BIGINT NOT NULL,
    id_compra         BIGINT NOT NULL,
    id_evento_sector  BIGINT NOT NULL,
    id_control        BIGINT NULL,
    fecha_validacion  DATETIME NULL,

    PRIMARY KEY (id_entrada),
    UNIQUE KEY uq_entrada_codigo_token (codigo_token),
    KEY idx_entrada_compra (id_compra),
    KEY idx_entrada_evento_sector (id_evento_sector),
    KEY idx_entrada_control (id_control),
    CONSTRAINT fk_entrada_usuario_actual
        FOREIGN KEY (id_usuario_actual) REFERENCES usuario_general(id_usuario),
    CONSTRAINT fk_entrada_compra
        FOREIGN KEY (id_compra) REFERENCES compra(id_compra),
    CONSTRAINT fk_entrada_evento_sector
        FOREIGN KEY (id_evento_sector) REFERENCES evento_sector(id_evento_sector),
    CONSTRAINT fk_entrada_control
        FOREIGN KEY (id_control) REFERENCES control_dispositivo(id_control),
    CONSTRAINT ck_entrada_validacion_coherente
        CHECK (
            (id_control IS NULL AND fecha_validacion IS NULL)
            OR (id_control IS NOT NULL AND fecha_validacion IS NOT NULL)
        )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- RELACIÓN RECURSIVA TERNARIA: TRANSFERENCIA_ENTRADA
-- ============================================================================
CREATE TABLE transferencia_entrada (
    id_transferencia      BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario_transfiere BIGINT NOT NULL,
    id_usuario_recibe     BIGINT NOT NULL,
    id_entrada            BIGINT NOT NULL,
    fecha_transferencia   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado                VARCHAR(20) NOT NULL,

    PRIMARY KEY (id_transferencia),
    KEY idx_transferencia_entrada (id_entrada),
    KEY idx_transferencia_transmite (id_usuario_transfiere),
    KEY idx_transferencia_recibe (id_usuario_recibe),
    CONSTRAINT fk_transferencia_transfiere
        FOREIGN KEY (id_usuario_transfiere) REFERENCES usuario_general(id_usuario),
    CONSTRAINT fk_transferencia_recibe
        FOREIGN KEY (id_usuario_recibe) REFERENCES usuario_general(id_usuario),
    CONSTRAINT fk_transferencia_entrada
        FOREIGN KEY (id_entrada) REFERENCES entrada(id_entrada),
    CONSTRAINT ck_transferencia_usuarios_distintos CHECK (id_usuario_transfiere <> id_usuario_recibe),
    CONSTRAINT ck_transferencia_estado CHECK (estado IN ('PENDIENTE', 'ACEPTADA', 'RECHAZADA'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================