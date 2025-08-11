<?php
session_start();
include 'conexion.php';

if (!isset($_SESSION['cedula']) || !in_array($_SESSION['rol'], ['tesorero', 'secretaria'])) {
    header("Location: login.php");
    exit();
}

$buscar = isset($_GET['buscar']) ? trim($_GET['buscar']) : '';
$pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
$limite = 25;
$offset = ($pagina - 1) * $limite;

$condicion = $buscar ? "WHERE cedula LIKE '%$buscar%'" : '';

$sql_total = "SELECT COUNT(*) as total FROM socios $condicion";
$total_resultado = $conn->query($sql_total)->fetch_assoc();
$total_socios = $total_resultado['total'];
$total_paginas = ceil($total_socios / $limite);

$sql = "SELECT * FROM socios $condicion ORDER BY apellidos_nombres ASC LIMIT $limite OFFSET $offset";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Socios | ASODAT</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <style>
        html,
        body {
            height: 100%;
            margin: 0;
            padding: 0;
        }

        body {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }

        main.contenedor-centro {
            flex: 1;
            padding-bottom: 2rem;
        }

        .tabla-wrapper {
            overflow-x: auto;
            width: 100%;
        }

        .tabla-datos {
            width: 100%;
            max-width: 1100px;
            margin: 1rem auto;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            table-layout: auto;
        }

        .tabla-datos th,
        .tabla-datos td {
            padding: 18px 12px;
            text-align: center;
            word-wrap: break-word;
            font-size: 12px;
        }

        .tabla-datos th {
            background-color: #003366;
            color: white;
        }

        .tabla-datos tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        .btn-accion {
            display: inline-block;
            padding: 10px 20px;
            /* Aumenta el padding para tener el mismo tamaño */
            margin: 5px;
            font-size: 16px;
            border-radius: 6px;
            /* Bordes redondeados */
            border: none;
            text-align: center;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s;
            /* Animación de cambio de color */
            width: 140px;
            /* Establece un tamaño fijo para todos los botones */
        }

        /* Estilo para los botones */
        .btn-editar {
            background-color: #ffc107;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            margin: 1rem auto;
            display: inline-block;
            text-align: center;
            text-decoration: none;
            width: 140px;
        }

        .btn-eliminar {
            background-color: #dc3545;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            margin: 1rem auto;
            display: inline-block;
            text-align: center;
            text-decoration: none;
            width: 140px;
        }

        .btn-nuevo {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            margin: 1rem auto;
            display: inline-block;
            text-align: center;
            text-decoration: none;
            width: 140px;
            /* Igual al de los otros botones */
        }

        /* Alineación horizontal de los botones */
        .botones-acciones {
            display: flex;
            justify-content: flex-start;
            gap: 10px;
            /* Añadir espacio entre los botones */
            margin-top: 20px;
        }

        .botones-acciones a {
            padding: 10px 20px;
            text-align: center;
            font-size: 16px;
            text-decoration: none;
            border-radius: 6px;
            /* Bordes redondeados */
        }

        /* Efecto hover: oscurecer el color y agrandar el botón */
        .btn-accion:hover {
            background-color: #0056b3;
            /* Oscurecer el color */
            transform: scale(1.05);
            /* Agrandar ligeramente el botón */
        }

        .btn-nuevo:hover {
            background-color: #0056b3;
            /* Oscurecer el color */
            transform: scale(1.05);
            /* Agrandar ligeramente el botón */
        }

        .btn-editar:hover {
            background-color: #e0a800;
            /* Oscurecer el color */
            transform: scale(1.05);
            /* Agrandar ligeramente el botón */
        }

        .btn-eliminar:hover {
            background-color: #c82333;
            /* Oscurecer el color */
            transform: scale(1.05);
            /* Agrandar ligeramente el botón */
        }

        .busqueda-form {
            max-width: 600px;
            margin: 1rem auto;
            text-align: center;
        }

        .busqueda-form input {
            padding: 8px;
            width: 300px;
        }

        .busqueda-form button {
            padding: 8px 12px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
        }

        .paginacion {
            text-align: center;
            margin: 1rem 0;
        }

        .paginacion a {
            margin: 0 5px;
            text-decoration: none;
            color: #003366;
        }

        .paginacion strong {
            margin: 0 5px;
        }

        .footer {
            background-color: #007b8a;
            color: white;
            text-align: center;
            padding: 20px 0;
            margin-top: auto;
        }

        .footer .social-icons a {
            color: white;
            margin: 0 10px;
            text-decoration: none;
            font-weight: bold;
        }

        @media (max-width: 768px) {

            .tabla-datos th,
            .tabla-datos td {
                font-size: 12px;
                padding: 6px;
            }

            .busqueda-form input {
                width: 100%;
            }
        }

        .btn-limpiar {
            display: inline-block;
            padding: 8px 12px;
            background-color: #6c757d;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-left: 5px;
        }

        .tabla-datos {
            width: 90vw;
            max-width: none;
        }

        .tabla-wrapper {
            overflow: auto;
            max-height: none;
            height: auto;
        }

        .mensaje-label {
            text-align: center;
            background-color: #e6f4ff;
            border: 1px solid #b3d8ff;
            color: #004085;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 600;
            margin: 1rem auto;
            width: fit-content;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            font-size: 16px;
        }

        .mensaje-label span {
            color: #007bff;
            font-weight: bold;
        }

        input[name="buscar"] {
            padding: 10px 15px;
            width: 300px;
            font-size: 15px;
            border: 1px solid #ccc;
            border-radius: 6px;
            outline: none;
            transition: border-color 0.3s, box-shadow 0.3s;
        }

        input[name="buscar"]:focus {
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.4);
        }

        .footer {
            background-color: #20859b;
            padding: 1rem 1rem;
            text-align: center;
            font-size: 0.8rem;
            color: #fff;
        }

        .footer .container {
            max-width: 1200px;
            margin: auto;
        }

        .btn-accion {
            display: inline-block;
            padding: 10px 16px;
            margin: 5px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            text-align: center;
            text-decoration: none;
            font-size: 14px;
            color: #ffffff;
            transition: background-color 0.3s ease;
        }

        .btn-historial {
            background-color: #6c757d;
            /* gris */
        }

        .btn-historial:hover {
            background-color: #5a6268;
        }

        .btn-pdf {
            background-color: #dc3545;
            /* rojo */
        }

        .btn-pdf:hover {
            background-color: #c82333;
        }
    </style>
</head>

<body>

    <header class="header">
        <div class="container">
            <div class="logo-section">
                <a href="index.php">
                    <img src="img/Logo Asociación.jpeg" alt="Logo ASODAT" class="logo-img">
                </a>
                <h1 class="logo">ASODAT</h1>
            </div>

            <nav class="nav">
                <a href="index.php">Inicio</a>
                <a href="servicios.php">Servicios</a>
                <a href="afiliacion.php">Afiliación</a>
                <a href="noticias.php">Noticias</a>

                <?php if (isset($_SESSION['cedula'])): ?>
                    <div class="dropdown">
                        <button class="dropbtn">
                            <?= $_SESSION['nombre_completo'] ?>
                            <span class="flecha">▼</span>
                        </button>
                        <div class="dropdown-content">
                            

                            <?php if (in_array($_SESSION['rol'], ['socio', 'tesorero', 'secretaria'])): ?>
                                <a href="datos.php">Datos</a>
                                <a href="historial_aportes.php">Mis Aportes</a>
                            <?php endif; ?>

                            <?php if ($_SESSION['rol'] === 'tesorero' || $_SESSION['rol'] === 'secretaria'): ?>
                                <a href="socios.php">Socios</a>
                            <?php endif; ?>

                            <?php if ($_SESSION['rol'] === 'tesorero'): ?>
                                <a href="aportes.php">Aportes</a>
                                <a href="reportes.php">Reportes</a>
                                <a href="aportes_socios.php">Aportes Socios</a>
                            <?php endif; ?>

                            <a href="logout.php">Cerrar sesión</a>
                        </div>
                    </div>
                <?php else: ?>
                    <a class="activo" href="login.php">Login</a>
                <?php endif; ?>
        </div>
    </header>

    <main class="contenedor-centro">
        <h2>Listado de Socios</h2>
        <form class="busqueda-form" method="get" action="socios.php">
            <input type="text" name="buscar" placeholder="Buscar por cédula..."
                value="<?= htmlspecialchars($buscar) ?>"
                onkeydown="if(event.key === 'Enter'){ this.form.submit(); }">
            <button type="submit">Buscar</button>
            <?php if (!empty($buscar)): ?>
                <a href="socios.php" class="btn-limpiar">Limpiar</a>
            <?php endif; ?>
            <?php if (!empty($buscar)): ?>
                <p class="mensaje-label">
                    🔍 Mostrando resultados para: <span><?= htmlspecialchars($buscar) ?></span>
                </p>
            <?php endif; ?>
        </form>
        <div class="tabla-wrapper">
            <table class="tabla-datos">
                <tr>
                    <th>Cédula</th>
                    <th>Nombres</th>
                    <th>Régimen</th>
                </tr>
                <?php while ($socio = $result->fetch_assoc()): ?>
                    <tr>
                        <td><?= $socio['cedula'] ?></td>
                        <td><?= $socio['apellidos_nombres'] ?></td>
                        <td><?= $socio['regimen'] ?></td>
                    </tr>
                <?php endwhile; ?>
            </table>
        </div>

        <!-- Botones de acción al lado del botón de "Nuevo Socio" -->
        <div class="botones-acciones">
            <a href="nuevo_socio.php" class="btn-accion btn-nuevo">Nuevo Socio</a>
            <a href="editar_socio.php" class="btn-accion btn-editar">Editar</a>
            <a href="eliminar_socio.php" class="btn-accion btn-eliminar">Eliminar</a>
            <!-- Nuevo botón: Historial de Eliminaciones -->
            <a href="historial_eliminaciones.php" class="btn-accion btn-historial" style="background-color: #6c757d;">
                Historial de Eliminaciones
            </a>

            <!-- Nuevo botón: Generar PDF -->
            <a href="pdfs/generar_pdf_socios.php" target="_blank" class="btn-accion btn-pdf" style="background-color: #dc3545;">
                Generar PDF Socios
            </a>
        </div>

        <div class="paginacion">
            <?php for ($i = 1; $i <= $total_paginas; $i++): ?>
                <?php if ($i == $pagina): ?>
                    <strong><?= $i ?></strong>
                <?php else: ?>
                    <a href="?pagina=<?= $i ?>&buscar=<?= urlencode($buscar) ?>"><?= $i ?></a>
                <?php endif; ?>
            <?php endfor; ?>
        </div>
    </main>

</body>
<footer class="footer">
    <div class="container">
        <p>&copy; 2025 ASODAT - Asociación de Docentes, Personal Administrativo y Trabajadores de la ESPE sede Latacunga.</p>
    </div>
</footer>
<script>
    const dropBtn = document.querySelector('.dropbtn');
    const dropdown = document.querySelector('.dropdown');

    if (dropBtn && dropdown) {
        dropBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        window.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });
    }
</script>

</html>