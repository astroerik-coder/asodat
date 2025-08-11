<?php
session_start();
include 'conexion.php';

$resultado = $conn->query("SELECT * FROM historial_eliminaciones ORDER BY fecha_eliminacion DESC");
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Noticias | ASODAT</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <script src="https://kit.fontawesome.com/a2e0e9f6e4.js" crossorigin="anonymous"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <style>
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

        .btn-volver {
            display: inline-block;
            margin: 30px auto 0;
            padding: 10px 20px;
            background-color: #004080;
            color: #fff;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            font-size: 15px;
            transition: background-color 0.3s ease, transform 0.2s ease;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .btn-volver:hover {
            background-color: #00264d;
            transform: translateY(-2px);
        }

        /* Tabla responsiva */
        .tabla-wrapper {
            overflow-x: auto;
            max-width: 100%;
            margin-bottom: 2rem;
        }

        .tabla-datos {
            width: 100%;
            border-collapse: collapse;
        }

        .tabla-datos th,
        .tabla-datos td {
            padding: 10px;
            border: 1px solid #ccc;
            text-align: left;
            white-space: nowrap;
        }

        @media (max-width: 768px) {

            .tabla-datos th,
            .tabla-datos td {
                font-size: 14px;
                padding: 8px;
            }
        }

        .volver-container {
            display: flex;
            justify-content: center;
            margin-top: 2rem;
            padding: 1rem;
        }

        @media (max-width: 768px) {
            .btn-volver {
                width: 90%;
                font-size: 14px;
                padding: 10px;
            }
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
        <h2>Historial de Eliminaciones</h2>

        <?php if ($resultado->num_rows > 0): ?>
            <div class="tabla-wrapper">
                <table class="tabla-datos">
                    <thead>
                        <tr>
                            <th>Cédula</th>
                            <th>Nombre Completo</th>
                            <th>Fecha Afiliación</th>
                            <th>Motivo</th>
                            <th>Fecha de Eliminación</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($fila = $resultado->fetch_assoc()): ?>
                            <tr>
                                <td><?= htmlspecialchars($fila['cedula']) ?></td>
                                <td><?= htmlspecialchars($fila['nombre_completo']) ?></td>
                                <td><?= htmlspecialchars($fila['fecha_afiliacion']) ?></td>
                                <td><?= nl2br(htmlspecialchars($fila['motivo'])) ?></td>
                                <td><?= htmlspecialchars($fila['fecha_eliminacion']) ?></td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        <?php else: ?>
            <p class="mensaje-vacio">📂 El historial de eliminaciones está vacío.</p>
        <?php endif; ?>

        <div class="volver-container">
            <a href="socios.php" class="btn-volver">← Volver</a>
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