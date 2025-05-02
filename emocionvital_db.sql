-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-05-2025 a las 23:31:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `psicologia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita`
--

CREATE TABLE `cita` (
  `id_cita` int(10) UNSIGNED NOT NULL,
  `id_paciente` int(10) UNSIGNED NOT NULL,
  `id_psicologa` int(10) UNSIGNED NOT NULL,
  `id_horario` int(10) UNSIGNED NOT NULL,
  `tipo_cita` enum('online','presencial') NOT NULL,
  `categoria` enum('Infantil','Jovenes','Adulto','Pareja') NOT NULL,
  `costo_consulta` float NOT NULL,
  `fecha_cita` date NOT NULL,
  `hora_cita` time NOT NULL,
  `metodo_pago` enum('Divisas','Pago Movil') NOT NULL,
  `Status` enum('Confirmada','Cancelada','Reprogramada') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cita`
--

INSERT INTO `cita` (`id_cita`, `id_paciente`, `id_psicologa`, `id_horario`, `tipo_cita`, `categoria`, `costo_consulta`, `fecha_cita`, `hora_cita`, `metodo_pago`, `Status`) VALUES
(1, 1, 1, 1, 'online', 'Adulto', 50, '2025-05-10', '10:00:00', 'Pago Movil', 'Confirmada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_medico`
--

CREATE TABLE `historial_medico` (
  `id_historial_medico` int(10) UNSIGNED NOT NULL,
  `id_paciente` int(10) UNSIGNED NOT NULL,
  `fecha_consulta` date DEFAULT NULL,
  `diagnostico` text DEFAULT NULL,
  `tratamiento` text DEFAULT NULL,
  `antecedentes` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Registrado','Actualizado','Inactivo') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_medico`
--

INSERT INTO `historial_medico` (`id_historial_medico`, `id_paciente`, `fecha_consulta`, `diagnostico`, `tratamiento`, `antecedentes`, `observaciones`, `fecha_registro`, `status`) VALUES
(1, 1, '2025-05-10', 'Ansiedad Generalizada', 'Terapia cognitivo-conductual', 'Ninguno', 'Paciente muestra mejoría', '2025-05-02 16:02:28', 'Registrado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historia_clinica_psicologia`
--

CREATE TABLE `historia_clinica_psicologia` (
  `id_historia_clinica` int(10) UNSIGNED NOT NULL,
  `id_paciente` int(10) UNSIGNED NOT NULL,
  `entrevistador` varchar(255) NOT NULL,
  `fecha_consulta` date NOT NULL,
  `motivo_consulta` text NOT NULL,
  `sintomas` text NOT NULL,
  `episodios_previos` text NOT NULL,
  `tiempo_problema` varchar(50) NOT NULL,
  `desencadenantes` text NOT NULL,
  `tratamientos_previos` text NOT NULL,
  `auto_descripcion` text NOT NULL,
  `antecedentes_familiares` text NOT NULL,
  `desarrollo_psicomotor` text NOT NULL,
  `escolaridad` text NOT NULL,
  `problemas_afectivos` text NOT NULL,
  `vida_laboral` text NOT NULL,
  `relaciones_interpersonales` text NOT NULL,
  `conducta_sexual` text NOT NULL,
  `sumario_diagnostico` text NOT NULL,
  `evaluacion_psicologica` text NOT NULL,
  `tratamiento` text NOT NULL,
  `evolucion` text NOT NULL,
  `firma_responsable` varchar(255) NOT NULL,
  `cargo_responsable` varchar(255) NOT NULL,
  `universidad_responsable` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historia_clinica_psicologia`
--

INSERT INTO `historia_clinica_psicologia` (`id_historia_clinica`, `id_paciente`, `entrevistador`, `fecha_consulta`, `motivo_consulta`, `sintomas`, `episodios_previos`, `tiempo_problema`, `desencadenantes`, `tratamientos_previos`, `auto_descripcion`, `antecedentes_familiares`, `desarrollo_psicomotor`, `escolaridad`, `problemas_afectivos`, `vida_laboral`, `relaciones_interpersonales`, `conducta_sexual`, `sumario_diagnostico`, `evaluacion_psicologica`, `tratamiento`, `evolucion`, `firma_responsable`, `cargo_responsable`, `universidad_responsable`) VALUES
(1, 1, 'Dra. Martínez', '2025-05-02', 'Ansiedad severa', 'Palpitaciones, sudoración excesiva, pensamientos intrusivos', 'Hace dos años comenzó con síntomas de ansiedad relacionados con su vida laboral', 'Desde hace aproximadamente 6 meses', 'Estrés laboral y problemas familiares', 'Terapia cognitivo-conductual y medicación ansiolítica', 'Paciente describe su personalidad como perfeccionista y analítica', 'Padre con antecedentes de trastornos de ansiedad', 'Desarrollo psicomotor normal', 'Universidad completada, dificultades con exámenes orales', 'Experimentó dificultades emocionales en la adolescencia', 'Trabaja en el sector financiero con alta carga laboral', 'Relaciones interpersonales estables pero con conflictos en el ámbito laboral', 'Vida sexual activa, sin problemas reportados', 'Ansiedad severa con episodios de pánico', 'Evaluación a través de inventario de ansiedad Beck', 'Terapia cognitivo-conductual con seguimiento psiquiátrico', 'Mejoría moderada tras dos meses de tratamiento', 'Dr. Pérez', 'Psiquiatra', 'Universidad Central de Venezuela');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

CREATE TABLE `horario` (
  `id_horario` int(10) UNSIGNED NOT NULL,
  `id_psicologa` int(10) UNSIGNED NOT NULL,
  `dias_laborables` date NOT NULL,
  `horario_laboral` time NOT NULL,
  `status` enum('Activo','Inactivo','Pendiente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horario`
--

INSERT INTO `horario` (`id_horario`, `id_psicologa`, `dias_laborables`, `horario_laboral`, `status`) VALUES
(1, 0, '2025-05-12', '07:29:16', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `informe_medico`
--

CREATE TABLE `informe_medico` (
  `id_informe_medico` int(10) UNSIGNED NOT NULL,
  `id_paciente` int(10) UNSIGNED NOT NULL,
  `id_psicologa` int(10) UNSIGNED NOT NULL,
  `id_cita` int(10) UNSIGNED NOT NULL,
  `fecha_informe` date NOT NULL,
  `motivo_consulta` text NOT NULL,
  `evaluacion_psicologica` text DEFAULT NULL,
  `diagnostico` text DEFAULT NULL,
  `recomendaciones` text NOT NULL,
  `conclusiones` text DEFAULT NULL,
  `status` enum('Registrado','Actualizado','Inactivo') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `informe_medico`
--

INSERT INTO `informe_medico` (`id_informe_medico`, `id_paciente`, `id_psicologa`, `id_cita`, `fecha_informe`, `motivo_consulta`, `evaluacion_psicologica`, `diagnostico`, `recomendaciones`, `conclusiones`, `status`) VALUES
(1, 1, 1, 1, '2025-05-10', 'Estrés laboral', 'Presenta síntomas de ansiedad leve', 'Ansiedad leve', 'Practicar mindfulness y técnicas de respiración', 'Requiere seguimiento', 'Registrado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `id_paciente` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `primer_nombre` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) NOT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_apellido` varchar(50) NOT NULL,
  `cedula` varchar(15) NOT NULL,
  `edad` int(10) UNSIGNED NOT NULL,
  `fecha_de_nacimiento` date NOT NULL,
  `sexo` enum('Masculino','Femenino') NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `id_direccion` int(10) UNSIGNED NOT NULL,
  `status` enum('activo','inactivo','pendiente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paciente`
--

INSERT INTO `paciente` (`id_paciente`, `id_usuario`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `cedula`, `edad`, `fecha_de_nacimiento`, `sexo`, `telefono`, `id_direccion`, `status`) VALUES
(1, 1, 'Juan', 'Carlos', 'Pérez', 'Ramírez', 'V-12345678', 30, '1995-06-15', 'Masculino', '04121234567', 1, 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente_cita`
--

CREATE TABLE `paciente_cita` (
  `id_paciente_cita` int(10) UNSIGNED NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_cita` int(10) UNSIGNED NOT NULL,
  `status` enum('Activo','Inactivo','Pendiente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `psicologa`
--

CREATE TABLE `psicologa` (
  `id_psicologa` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `primer_nombre` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) NOT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_apellido` varchar(50) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `direccion` text NOT NULL,
  `especialidad` text NOT NULL,
  `status` enum('activo','inactivo','pendiente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `psicologa`
--

INSERT INTO `psicologa` (`id_psicologa`, `id_usuario`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `telefono`, `direccion`, `especialidad`, `status`) VALUES
(1, 2, 'Maria', 'Luisa', 'Gómez', 'Fernández', '04125678901', 'Av. Libertador, Caracas', 'Terapia Cognitivo-Conductual', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reprogramacion_cita`
--

CREATE TABLE `reprogramacion_cita` (
  `id_reprogramacion` int(10) UNSIGNED NOT NULL,
  `id_cita` int(10) UNSIGNED NOT NULL,
  `id_horario` int(10) UNSIGNED NOT NULL,
  `id_psicologa` int(10) UNSIGNED NOT NULL,
  `motivo_reprogramacion` text NOT NULL,
  `nueva_fecha_cita` date NOT NULL,
  `nueva_hora_cita` time NOT NULL,
  `status` enum('Confirmada','Cancelada') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `reprogramacion_cita`
--

INSERT INTO `reprogramacion_cita` (`id_reprogramacion`, `id_cita`, `id_horario`, `id_psicologa`, `motivo_reprogramacion`, `nueva_fecha_cita`, `nueva_hora_cita`, `status`) VALUES
(1, 1, 0, 1, 'Inconveniente personal', '2025-05-15', '14:00:00', 'Confirmada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `correo` varchar(100) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `tipo_usuario` enum('paciente','psicologa') NOT NULL,
  `status` enum('activo','inactivo','pendiente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `correo`, `nombre_usuario`, `contraseña`, `tipo_usuario`, `status`) VALUES
(1, 'juan.perez@example.com', 'juanp', 'hashedpassword1', 'paciente', 'activo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cita`
--
ALTER TABLE `cita`
  ADD PRIMARY KEY (`id_cita`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indices de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD PRIMARY KEY (`id_historial_medico`);

--
-- Indices de la tabla `historia_clinica_psicologia`
--
ALTER TABLE `historia_clinica_psicologia`
  ADD PRIMARY KEY (`id_historia_clinica`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indices de la tabla `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`id_horario`),
  ADD KEY `id_psicologa` (`id_psicologa`),
  ADD KEY `id_psicologa_2` (`id_psicologa`);

--
-- Indices de la tabla `informe_medico`
--
ALTER TABLE `informe_medico`
  ADD PRIMARY KEY (`id_informe_medico`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`id_paciente`);

--
-- Indices de la tabla `paciente_cita`
--
ALTER TABLE `paciente_cita`
  ADD PRIMARY KEY (`id_paciente_cita`),
  ADD KEY `id_cita` (`id_cita`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indices de la tabla `psicologa`
--
ALTER TABLE `psicologa`
  ADD PRIMARY KEY (`id_psicologa`);

--
-- Indices de la tabla `reprogramacion_cita`
--
ALTER TABLE `reprogramacion_cita`
  ADD PRIMARY KEY (`id_reprogramacion`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cita`
--
ALTER TABLE `cita`
  MODIFY `id_cita` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  MODIFY `id_historial_medico` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `historia_clinica_psicologia`
--
ALTER TABLE `historia_clinica_psicologia`
  MODIFY `id_historia_clinica` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `horario`
--
ALTER TABLE `horario`
  MODIFY `id_horario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `informe_medico`
--
ALTER TABLE `informe_medico`
  MODIFY `id_informe_medico` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `paciente`
--
ALTER TABLE `paciente`
  MODIFY `id_paciente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `psicologa`
--
ALTER TABLE `psicologa`
  MODIFY `id_psicologa` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `reprogramacion_cita`
--
ALTER TABLE `reprogramacion_cita`
  MODIFY `id_reprogramacion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
