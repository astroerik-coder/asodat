-- Script para crear las tablas de ASODAT
-- Ejecutar este script para inicializar la base de datos

-- Tabla de socios
CREATE TABLE IF NOT EXISTS `socios` (
  `apellidos_nombres` varchar(255) DEFAULT NULL,
  `campus` varchar(50) DEFAULT NULL,
  `genero` char(1) DEFAULT NULL,
  `regimen` varchar(50) DEFAULT NULL,
  `celular` varchar(15) DEFAULT NULL,
  `cedula` varchar(15) NOT NULL,
  `rol` varchar(20) DEFAULT NULL,
  `cargo` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `fecha_afiliacion` date DEFAULT NULL,
  `documento_pdf` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `correo` varchar(30) DEFAULT NULL,
  `tipo_usuario` enum('nuevo','adherente','fundador') DEFAULT 'nuevo',
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla de inicio de sesión
CREATE TABLE IF NOT EXISTS `iniciosesion` (
  `cedula` varchar(15) NOT NULL,
  `contrasena` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla de aportes
CREATE TABLE IF NOT EXISTS `aportes` (
  `apellidos_y_nombres` varchar(255) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `nuevos_ingresos` decimal(10,2) DEFAULT 0.00,
  `dic_aa` decimal(10,2) DEFAULT 0.00,
  `enero` decimal(10,2) DEFAULT 0.00,
  `febrero` decimal(10,2) DEFAULT 0.00,
  `marzo` decimal(10,2) DEFAULT 0.00,
  `abril` decimal(10,2) DEFAULT 0.00,
  `mayo` decimal(10,2) DEFAULT 0.00,
  `junio` decimal(10,2) DEFAULT 0.00,
  `julio` decimal(10,2) DEFAULT 0.00,
  `agosto` decimal(10,2) DEFAULT 0.00,
  `septiembre` decimal(10,2) DEFAULT 0.00,
  `octubre` decimal(10,2) DEFAULT 0.00,
  `noviembre` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla de comprobantes de pago
CREATE TABLE IF NOT EXISTS `comprobantes_pago` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cedula` varchar(10) NOT NULL,
  `fecha_pago` datetime NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `ingreso` decimal(10,2) DEFAULT 0.00,
  `meses_vencidos` text DEFAULT NULL,
  `meses_adelantados` text DEFAULT NULL,
  `numero_comprobante` int(11) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_comprobante` (`numero_comprobante`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla de cupos de socios
CREATE TABLE IF NOT EXISTS `cupossocios` (
  `cedula` varchar(20) NOT NULL,
  `nombrecompleto` varchar(100) NOT NULL,
  `cupo` decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla de noticias
CREATE TABLE IF NOT EXISTS `noticias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) DEFAULT NULL,
  `contenido` text DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar datos de prueba
INSERT INTO `socios` (`apellidos_nombres`, `campus`, `genero`, `regimen`, `celular`, `cedula`, `cargo`, `direccion`, `fecha_afiliacion`, `correo`, `tipo_usuario`) VALUES
('García López, María Elena', 'Guayaquil', 'F', 'Tiempo Completo', '0987654321', '0987654321', 'Docente Titular', 'Av. Principal 123, Guayaquil', '2020-03-15', 'maria.garcia@universidad.edu.ec', 'fundador'),
('Rodríguez Pérez, Carlos Alberto', 'Quito', 'M', 'Medio Tiempo', '0912345678', '1234567890', 'Docente Auxiliar', 'Calle Secundaria 456, Quito', '2021-08-20', 'carlos.rodriguez@universidad.edu.ec', 'adherente');

INSERT INTO `iniciosesion` (`cedula`, `contrasena`) VALUES
('1234567890', 'admin123'),
('0987654321', 'socio123');

INSERT INTO `aportes` (`apellidos_y_nombres`, `cedula`, `nuevos_ingresos`, `enero`, `febrero`, `marzo`, `mayo`) VALUES
('García López, María Elena', '0987654321', 50.00, 25.00, 25.00, 25.00, 25.00);
