
-- --------------------------------------------------------

--
-- Table structure for table `aportes`
--

CREATE TABLE `aportes` (
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
  `noviembre` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `aportes_socios`
--

CREATE TABLE `aportes_socios` (
  `apellidos_y_nombres` varchar(255) DEFAULT NULL,
  `cedula` varchar(20) NOT NULL,
  `nuevos_ingresos` decimal(10,2) DEFAULT NULL,
  `dic_24` decimal(10,2) DEFAULT NULL,
  `ene_25` decimal(10,2) DEFAULT NULL,
  `feb_25` decimal(10,2) DEFAULT NULL,
  `mar_25` decimal(10,2) DEFAULT NULL,
  `abr_25` decimal(10,2) DEFAULT NULL,
  `may_25` decimal(10,2) DEFAULT NULL,
  `jun_25` decimal(10,2) DEFAULT NULL,
  `jul_25` decimal(10,2) DEFAULT NULL,
  `ago_25` decimal(10,2) DEFAULT NULL,
  `sept_25` decimal(10,2) DEFAULT NULL,
  `oct_25` decimal(10,2) DEFAULT NULL,
  `nov_25` decimal(10,2) DEFAULT NULL,
  `dic_25` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `comprobantes_pago`
--

CREATE TABLE `comprobantes_pago` (
  `id` int(11) NOT NULL,
  `cedula` varchar(10) NOT NULL,
  `fecha_pago` datetime NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `ingreso` decimal(10,2) DEFAULT 0.00,
  `meses_vencidos` text DEFAULT NULL,
  `meses_adelantados` text DEFAULT NULL,
  `numero_comprobante` int(11) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `cupossocios`
--

CREATE TABLE `cupossocios` (
  `cedula` varchar(20) NOT NULL,
  `nombrecompleto` varchar(100) NOT NULL,
  `cupo` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `historial_aportes`
--

CREATE TABLE `historial_aportes` (
  `id` int(11) NOT NULL,
  `cedula` varchar(20) DEFAULT NULL,
  `apellidos_y_nombres` varchar(255) DEFAULT NULL,
  `nuevos_ingresos` decimal(10,2) DEFAULT NULL,
  `dic_aa` decimal(10,2) DEFAULT NULL,
  `enero` decimal(10,2) DEFAULT NULL,
  `febrero` decimal(10,2) DEFAULT NULL,
  `marzo` decimal(10,2) DEFAULT NULL,
  `abril` decimal(10,2) DEFAULT NULL,
  `mayo` decimal(10,2) DEFAULT NULL,
  `junio` decimal(10,2) DEFAULT NULL,
  `julio` decimal(10,2) DEFAULT NULL,
  `agosto` decimal(10,2) DEFAULT NULL,
  `septiembre` decimal(10,2) DEFAULT NULL,
  `octubre` decimal(10,2) DEFAULT NULL,
  `noviembre` decimal(10,2) DEFAULT NULL,
  `anio_respaldo` int(11) DEFAULT NULL,
  `fecha_respaldo` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `historial_carga_aportes`
--

CREATE TABLE `historial_carga_aportes` (
  `id` int(11) NOT NULL,
  `cedula` varchar(20) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `mes` varchar(20) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `archivo` varchar(255) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `historial_eliminaciones`
--

CREATE TABLE `historial_eliminaciones` (
  `id` int(11) NOT NULL,
  `cedula` varchar(15) NOT NULL,
  `nombre_completo` varchar(255) NOT NULL,
  `fecha_afiliacion` date NOT NULL,
  `motivo` text NOT NULL,
  `fecha_eliminacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `iniciosesion`
--

CREATE TABLE `iniciosesion` (
  `cedula` varchar(15) NOT NULL,
  `contrasena` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `noticias`
--

CREATE TABLE `noticias` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `contenido` text DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `socios`
--

CREATE TABLE `socios` (
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
  `tipo_usuario` enum('nuevo','adherente','fundador') DEFAULT 'nuevo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `aportes`
--
ALTER TABLE `aportes`
  ADD PRIMARY KEY (`cedula`);

--
-- Indexes for table `aportes_socios`
--
ALTER TABLE `aportes_socios`
  ADD PRIMARY KEY (`cedula`);

--
-- Indexes for table `comprobantes_pago`
--
ALTER TABLE `comprobantes_pago`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_comprobante` (`numero_comprobante`);

--
-- Indexes for table `cupossocios`
--
ALTER TABLE `cupossocios`
  ADD PRIMARY KEY (`cedula`);

--
-- Indexes for table `historial_aportes`
--
ALTER TABLE `historial_aportes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `historial_carga_aportes`
--
ALTER TABLE `historial_carga_aportes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `historial_eliminaciones`
--
ALTER TABLE `historial_eliminaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `iniciosesion`
--
ALTER TABLE `iniciosesion`
  ADD PRIMARY KEY (`cedula`);

--
-- Indexes for table `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `socios`
--
ALTER TABLE `socios`
  ADD PRIMARY KEY (`cedula`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comprobantes_pago`
--
ALTER TABLE `comprobantes_pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `historial_aportes`
--
ALTER TABLE `historial_aportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `historial_carga_aportes`
--
ALTER TABLE `historial_carga_aportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1210;

--
-- AUTO_INCREMENT for table `historial_eliminaciones`
--
ALTER TABLE `historial_eliminaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;