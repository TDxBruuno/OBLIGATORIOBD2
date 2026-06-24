-- ============================================================================
-- DATOS DE PRUEBA — Sistema de Ticketing Mundial 2026
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- USUARIOS BASE
-- ============================================================================
-- 1 Admin, 2 Funcionarios, 3 Usuarios generales
INSERT INTO usuarios (mail, doc_pais, doc_tipo, doc_numero, dir_pais, dir_localidad, dir_calle, dir_numero, dir_codigo_postal, tipo_usuario) VALUES
('admin.usa@mundial2026.com',    'USA',     'PASSPORT', 'US-001-2026', 'USA',     'New York',      'Fifth Avenue',    '350',  '10001', 'ADMIN'),
('funcionario1@mundial2026.com', 'Uruguay', 'CI',       '12345678',    'Uruguay', 'Montevideo',    'Av. Italia',      '1234', '11200', 'FUNCIONARIO'),
('funcionario2@mundial2026.com', 'Uruguay', 'CI',       '87654321',    'Uruguay', 'Montevideo',    'Av. Brasil',      '500',  '11300', 'FUNCIONARIO'),
('juan.perez@mail.com',          'Uruguay', 'CI',       '45678901',    'Uruguay', 'Montevideo',    'Calle Colonia',   '800',  '11100', 'GENERAL'),
('maria.garcia@mail.com',        'Uruguay', 'CI',       '56789012',    'Uruguay', 'Montevideo',    'Calle Rivera',    '300',  '11400', 'GENERAL'),
('carlos.lopez@mail.com',        'Argentina','DNI',     'AR-9876543',  'Argentina','Buenos Aires', 'Av. Corrientes',  '1200', 'C1043', 'GENERAL');

-- Teléfonos
INSERT INTO telefono_usuario (id_usuario, telefono) VALUES
(1, '+1-212-555-0101'),
(2, '+598-99-111-222'),
(3, '+598-99-333-444'),
(4, '+598-94-111-333'),
(5, '+598-91-222-444'),
(5, '+598-99-555-666'),
(6, '+54-11-4444-5555');

-- Subtipos
INSERT INTO adm_pais_sede (id_usuario, fecha_asignacion) VALUES
(1, '2025-06-01');

INSERT INTO funcionario_validacion (id_usuario, num_legajo) VALUES
(2, 'LEG-001'),
(3, 'LEG-002');

INSERT INTO usuario_general (id_usuario, fecha_registro, estado) VALUES
(4, '2026-01-15', 'ACTIVO'),
(5, '2026-01-20', 'ACTIVO'),
(6, '2026-02-01', 'ACTIVO');

-- ============================================================================
-- EQUIPOS
-- ============================================================================
INSERT INTO equipo (nombre) VALUES
('Uruguay'),
('Argentina'),
('Brasil'),
('Portugal'),
('Francia'),
('España');

-- ============================================================================
-- ESTADIOS Y SECTORES
-- ============================================================================
INSERT INTO estadio (nombre) VALUES
('MetLife Stadium'),
('AT&T Stadium'),
('SoFi Stadium');

-- MetLife (id=1): 4 sectores
INSERT INTO sector (nombre, cap_max, id_estadio) VALUES
('A', 5000, 1),
('B', 8000, 1),
('C', 8000, 1),
('D', 3000, 1);

-- AT&T (id=2): 4 sectores
INSERT INTO sector (nombre, cap_max, id_estadio) VALUES
('A', 4000, 2),
('B', 6000, 2),
('C', 6000, 2),
('D', 2000, 2);

-- SoFi (id=3): 2 sectores (para el tercer evento)
INSERT INTO sector (nombre, cap_max, id_estadio) VALUES
('A', 7000, 3),
('B', 9000, 3);

-- ============================================================================
-- DISPOSITIVOS Y CONTROL
-- ============================================================================
INSERT INTO dispositivo (descripcion) VALUES
('Scanner QR — Puerta Norte MetLife'),
('Scanner QR — Puerta Este AT&T');

INSERT INTO control_dispositivo (id_funcionario, id_dispositivo) VALUES
(2, 1),
(3, 3);

-- ============================================================================
-- EVENTOS (creados por el admin id=1)
-- ============================================================================
-- Evento 1: Uruguay vs Argentina en MetLife, 21/6/2026 20:00
INSERT INTO evento (fecha, hora, id_estadio, id_adm_pais_sede, equipo_local_id, equipo_visitante_id)
VALUES ('2026-06-21', '20:00:00', 1, 1, 1, 2);

-- Evento 2: Brasil vs Portugal en AT&T, 22/6/2026 18:00
INSERT INTO evento (fecha, hora, id_estadio, id_adm_pais_sede, equipo_local_id, equipo_visitante_id)
VALUES ('2026-06-22', '18:00:00', 2, 1, 3, 4);

-- Evento 3: Francia vs España en SoFi, 23/6/2026 21:00
INSERT INTO evento (fecha, hora, id_estadio, id_adm_pais_sede, equipo_local_id, equipo_visitante_id)
VALUES ('2026-06-23', '21:00:00', 3, 1, 5, 6);

-- ============================================================================
-- EVENTO_SECTOR (sectores habilitados por evento con precio)
-- ============================================================================
-- Evento 1 — MetLife: sectores A, B, C habilitados
-- sector A (id=1), B (id=2), C (id=3)
INSERT INTO evento_sector (id_evento, id_sector, precio, capacidad) VALUES
(1, 1, 350.00, 500),
(1, 2, 200.00, 800),
(1, 3, 200.00, 800);

-- Evento 2 — AT&T: sectores A, B habilitados
-- sector A (id=5), B (id=6)
INSERT INTO evento_sector (id_evento, id_sector, precio, capacidad) VALUES
(2, 5, 280.00, 400),
(2, 6, 160.00, 600);

-- Evento 3 — SoFi: sectores A, B habilitados
-- sector A (id=9), B (id=10)
INSERT INTO evento_sector (id_evento, id_sector, precio, capacidad) VALUES
(3, 9, 300.00, 700),
(3, 10, 180.00, 900);

-- ============================================================================
-- ASIGNACIÓN FUNCIONARIOS A SECTORES DE EVENTO
-- Funcionario 2 (LEG-001) cubre sectores A y B del evento 1
-- Funcionario 3 (LEG-002) cubre sector A del evento 2
-- ============================================================================
-- evento_sector ids: 1=ev1-secA, 2=ev1-secB, 3=ev1-secC, 4=ev2-secA, 5=ev2-secB
INSERT INTO funcionario_evento_sector (id_funcionario, id_evento_sector) VALUES
(2, 1),
(2, 2),
(3, 4);

-- ============================================================================
-- COMPRAS
-- ============================================================================
-- Compra 1: Juan Pérez compra 3 entradas al evento 1 (2 sector B + 1 sector A)
INSERT INTO compra (fecha, estado, monto_total, id_tarifa_comision, id_usuario)
VALUES ('2026-03-10', 'PAGADA', 787.50, 1, 4);
-- monto: (200*2 + 350*1) * 1.05 = 750 * 1.05 = 787.50

-- Compra 2: María García compra 2 entradas al evento 1 (sector C)
INSERT INTO compra (fecha, estado, monto_total, id_tarifa_comision, id_usuario)
VALUES ('2026-03-11', 'PAGADA', 420.00, 1, 5);
-- monto: (200*2) * 1.05 = 420.00

-- Compra 3: Carlos López compra 2 entradas al evento 2 (sector A)
INSERT INTO compra (fecha, estado, monto_total, id_tarifa_comision, id_usuario)
VALUES ('2026-03-12', 'CONFIRMADA', 588.00, 1, 6);
-- monto: (280*2) * 1.05 = 588.00

-- ============================================================================
-- ENTRADAS
-- Tokens ficticios
-- ============================================================================
-- Compra 1 — Juan: 2 entradas sector B (id_evento_sector=2), 1 entrada sector A (id_evento_sector=1)
INSERT INTO entrada (codigo_token, id_usuario_actual, id_compra, id_evento_sector, id_control, fecha_validacion) VALUES
('tok-ev1-secB-e01', 4, 1, 2, NULL, NULL),
('tok-ev1-secB-e02', 4, 1, 2, NULL, NULL),
('tok-ev1-secA-e03', 4, 1, 1, NULL, NULL);

-- Compra 2 — María: 2 entradas sector C (id_evento_sector=3)
INSERT INTO entrada (codigo_token, id_usuario_actual, id_compra, id_evento_sector, id_control, fecha_validacion) VALUES
('tok-ev1-secC-e04', 5, 2, 3, NULL, NULL),
('tok-ev1-secC-e05', 5, 2, 3, NULL, NULL);

-- Compra 3 — Carlos: 2 entradas sector A evento 2 (id_evento_sector=4)
INSERT INTO entrada (codigo_token, id_usuario_actual, id_compra, id_evento_sector, id_control, fecha_validacion) VALUES
('tok-ev2-secA-e06', 6, 3, 4, NULL, NULL),
('tok-ev2-secA-e07', 6, 3, 4, NULL, NULL);

-- ============================================================================
-- TRANSFERENCIA DE EJEMPLO
-- Juan transfiere su entrada del sector A (id=3) a María, que la acepta
-- ============================================================================
INSERT INTO transferencia_entrada (id_usuario_transfiere, id_usuario_recibe, id_entrada, fecha_transferencia, estado)
VALUES (4, 5, 3, '2026-03-15 10:00:00', 'ACEPTADA');

-- Al aceptarse, la entrada id=3 pasa a ser de María (id_usuario=5)
UPDATE entrada SET id_usuario_actual = 5 WHERE id_entrada = 3;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================
SELECT 'usuarios'               AS tabla, COUNT(*) AS filas FROM usuarios
UNION ALL SELECT 'usuario_general',            COUNT(*) FROM usuario_general
UNION ALL SELECT 'funcionario_validacion',     COUNT(*) FROM funcionario_validacion
UNION ALL SELECT 'adm_pais_sede',              COUNT(*) FROM adm_pais_sede
UNION ALL SELECT 'equipo',                     COUNT(*) FROM equipo
UNION ALL SELECT 'estadio',                    COUNT(*) FROM estadio
UNION ALL SELECT 'sector',                     COUNT(*) FROM sector
UNION ALL SELECT 'dispositivo',                COUNT(*) FROM dispositivo
UNION ALL SELECT 'control_dispositivo',        COUNT(*) FROM control_dispositivo
UNION ALL SELECT 'evento',                     COUNT(*) FROM evento
UNION ALL SELECT 'evento_sector',              COUNT(*) FROM evento_sector
UNION ALL SELECT 'funcionario_evento_sector',  COUNT(*) FROM funcionario_evento_sector
UNION ALL SELECT 'tarifa_comision',            COUNT(*) FROM tarifa_comision
UNION ALL SELECT 'compra',                     COUNT(*) FROM compra
UNION ALL SELECT 'entrada',                    COUNT(*) FROM entrada
UNION ALL SELECT 'transferencia_entrada',      COUNT(*) FROM transferencia_entrada;
