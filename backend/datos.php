<?php
session_start();
include 'conexion.php';

if (!isset($_SESSION['cedula']) || !in_array($_SESSION['rol'], ['socio', 'tesorero', 'secretaria'])) {
    header("Location: login.php");
    exit();
}

$cedula = $_SESSION['cedula'];
$sql = "SELECT * FROM socios WHERE cedula = '$cedula'";
$result = $conn->query($sql);
$datos = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Mis Datos | ASODAT</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            background-color: #eaf6ff;
        }

        header,
        footer {
            background-color: #003366;
            color: white;
            padding: 15px 0;
        }

        .container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 15px;
        }

        .logo-section {
            display: flex;
            align-items: center;
        }

        .logo-img {
            height: 50px;
            margin-right: 10px;
        }

        nav {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        nav a {
            color: white;
            text-decoration: none;
            font-weight: 500;
        }

        main {
            max-width: 1100px;
            margin: 40px auto;
            background: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .titulo-tabla {
            text-align: center;
            font-size: 1.8em;
            font-weight: bold;
            color: white;
            background-color: #007bff;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 30px;
        }

        .grid-datos {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }

        .campo-dato {
            flex: 1 1 calc(50% - 20px);
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 15px 20px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        }

        .campo-dato strong {
            display: block;
            margin-bottom: 5px;
            color: #333;
        }

        .campo-dato span {
            color: #555;
        }

        .campo-documento {
            margin-top: 40px;
        }

        .campo-documento a {
            color: #007bff;
            font-weight: bold;
            text-decoration: none;
        }

        .campo-documento a:hover {
            text-decoration: underline;
        }

        iframe {
            width: 100%;
            height: 420px;
            margin-top: 10px;
            border-radius: 8px;
            border: 1px solid #ccc;
        }

        .boton-actualizar {
            text-align: center;
            margin-top: 35px;
        }

        .btn-actualizar {
            background-color: #28a745;
            color: white;
            padding: 12px 28px;
            border-radius: 8px;
            font-weight: bold;
            text-decoration: none;
            transition: background 0.3s ease;
        }

        .btn-actualizar:hover {
            background-color: #218838;
        }

        footer p {
            text-align: center;
            margin: 0;
        }

        @media (max-width: 768px) {
            .campo-dato {
                flex: 1 1 100%;
            }

            nav {
                flex-direction: column;
                align-items: flex-start;
            }
        }

        .footer .container {
            max-width: 1200px;
            margin: auto;
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

    <main>
        <div class="titulo-tabla">Datos Personales</div>

        <div class="grid-datos">
            <div class="campo-dato"><strong>Nombre completo</strong><span><?= $datos['apellidos_nombres'] ?></span></div>
            <div class="campo-dato"><strong>Correo</strong><span><?= $datos['correo'] ?></span></div>
            <div class="campo-dato"><strong>Cédula</strong><span><?= $datos['cedula'] ?></span></div>
            <div class="campo-dato"><strong>Celular</strong><span><?= $datos['celular'] ?></span></div>
            <div class="campo-dato"><strong>Campus</strong><span><?= $datos['campus'] ?></span></div>
            <div class="campo-dato"><strong>Género</strong><span><?= $datos['genero'] ?></span></div>
            <div class="campo-dato"><strong>Régimen</strong><span><?= $datos['regimen'] ?></span></div>
            <div class="campo-dato"><strong>Cargo</strong><span><?= $datos['cargo'] ?></span></div>
            <div class="campo-dato"><strong>Dirección</strong><span><?= $datos['direccion'] ?></span></div>
            <div class="campo-dato"><strong>Fecha de Afiliación</strong><span><?= $datos['fecha_afiliacion'] ?></span></div>
        </div>

        <div class="campo-documento">
            <strong>Documento:</strong><br><br>
            <?php if (!empty($datos['documento_pdf']) && file_exists($datos['documento_pdf'])): ?>
                <a href="<?= $datos['documento_pdf'] ?>" target="_blank">Ver documento PDF</a><br><br>
                <iframe src="<?= $datos['documento_pdf'] ?>"></iframe>
            <?php else: ?>
                No se ha subido ningún documento.
            <?php endif; ?>
        </div>

        <div class="boton-actualizar">
            <a href="pagina_actualizacion.php" class="btn-actualizar">Actualizar Datos</a>
        </div>
    </main>
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

</body>

</html>