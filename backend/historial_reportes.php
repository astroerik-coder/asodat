<?php
session_start();
include 'conexion.php';

if (!isset($_SESSION['cedula']) || $_SESSION['rol'] !== 'tesorero') {
    header("Location: login.php");
    exit();
}

$query = "SELECT cedula, fecha_pago, total, ingreso, meses_vencidos, meses_adelantados, numero_comprobante, observaciones, created_at FROM comprobantes_pago ORDER BY created_at DESC";
$resultado = $conn->query($query);
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

        h2 {
            color: #0a4974;
        }

        .btn-regresar {
            display: inline-block;
            margin-top: 10px;
            margin-bottom: 20px;
            padding: 8px 16px;
            background-color: #0a4974;
            color: white;
            border-radius: 4px;
            text-decoration: none;
            font-size: 14px;
        }

        .btn-regresar:hover {
            background-color: #083a5e;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
        }

        th,
        td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: center;
        }

        th {
            background-color: #e0e0e0;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .btn-pdf {
            background-color: #0a4974;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 14px;
        }

        .btn-pdf:hover {
            background-color: #083a5e;
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
        <h2>📄 Historial de Comprobantes de Pago</h2>
        <a href="aportes.php" class="btn-regresar">← Volver a Gestión de Aportes</a>

        <table>
            <thead>
                <tr>
                    <th>Cédula</th>
                    <th>Fecha de Pago</th>
                    <th>Total</th>
                    <th>Ingreso</th>
                    <th>Meses Vencidos</th>
                    <th>Meses Adelantados</th>
                    <th>N° Comprobante</th>
                    <th>Observaciones</th>
                    <th>Registrado</th>
                    <th>Comprobante</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($row = $resultado->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($row['cedula']) ?></td>
                        <td><?= htmlspecialchars($row['fecha_pago']) ?></td>
                        <td>$<?= number_format($row['total'], 2) ?></td>
                        <td>$<?= number_format($row['ingreso'], 2) ?></td>
                        <td><?= htmlspecialchars($row['meses_vencidos']) ?></td>
                        <td><?= htmlspecialchars($row['meses_adelantados']) ?></td>
                        <td><?= htmlspecialchars($row['numero_comprobante']) ?></td>
                        <td><?= htmlspecialchars($row['observaciones'] ?? '—') ?></td>
                        <td><?= htmlspecialchars($row['created_at']) ?></td>
                        <td>
                            <a href="pdfs/generar_comprobante_get.php?cedula=<?= $row['cedula'] ?>&comprobante=<?= $row['numero_comprobante'] ?>" target="_blank" class="btn-pdf">📄 Descargar</a>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ASODAT - Asociación de Docentes, Personal Administrativo y Trabajadores de la ESPE sede
                Latacunga.</p>
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