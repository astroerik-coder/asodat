<?php
session_start();
include 'conexion.php';

if (!isset($_SESSION['cedula']) || !in_array($_SESSION['rol'], ['socio', 'tesorero', 'secretaria'])) {
    header("Location: login.php");
    exit();
}

$cedula = $_SESSION['cedula'];
$nombre = isset($_SESSION['nombre_completo']) ? $_SESSION['nombre_completo'] : 'Desconocido';


$stmt = $conn->prepare("SELECT * FROM aportes WHERE cedula = ?");
$stmt->bind_param("s", $cedula);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo "<p>No se encontraron datos de aportes.</p>";
    exit();
}

$row = $res->fetch_assoc();
$nuevosIngresos = floatval($row['nuevos_ingresos']);

$meses = [
    'dic_aa' => 'Diciembre AA',
    'enero' => 'Enero',
    'febrero' => 'Febrero',
    'marzo' => 'Marzo',
    'abril' => 'Abril',
    'mayo' => 'Mayo',
    'junio' => 'Junio',
    'julio' => 'Julio',
    'agosto' => 'Agosto',
    'septiembre' => 'Septiembre',
    'octubre' => 'Octubre',
    'noviembre' => 'Noviembre'
];

$total = 0;
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Mis Aportes | ASODAT</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #e6f4f9;
            margin: 0;
            padding: 0;
        }

        .contenedor-centro {
            max-width: 800px;
            margin: 30px auto;
            padding: 2rem;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: #20859b;
            text-align: center;
            margin-bottom: 1rem;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }

        th,
        td {
            padding: 10px;
            border: 1px solid #ccc;
            text-align: center;
        }

        th {
            background-color: #20859b;
            color: white;
        }

        .pagado {
            color: green;
            font-weight: bold;
        }

        .no-pagado {
            color: red;
            font-weight: bold;
        }

        p {
            margin: 0.5rem 0;
            text-align: center;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #e6f4f9;
            margin: 0;
            padding: 0;
            padding-bottom: 100px;
            /* evita que el footer se monte */
        }

        .contenedor-centro {
            width: 90%;
            max-width: 900px;
            min-height: auto;
            /* deja que crezca según contenido */
            margin: 90px auto 30px auto;
            padding: 2rem 2rem 3rem 2rem;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            overflow: visible;
            /* importante para que el contenido no se recorte */
        }

        .footer {
            background-color: #20859b;
            color: white;
            text-align: center;
            padding: 1.2rem 1rem;
            font-size: 0.9rem;
            position: relative;
            z-index: 10;
        }

        .tabla-aportes {
            width: 100%;
            max-width: 100%;
            overflow-x: auto;
            display: block;
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
        <h2 style="margin-top: 60px;">Resumen de Aportes</h2>

        <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; padding: 0 1rem;">
            <div><strong>Socio:</strong> <?= htmlspecialchars($nombre)?></div>
            <div><strong>&nbsp; Cédula:</strong> <?= htmlspecialchars($cedula) ?></div>
        </div>

        <?php if ($nuevosIngresos > 0): ?>
            <h3>Ingreso por nueva afiliación</h3>
            <div class="tabla-aportes">
                <table>
                    <thead>
                        <tr>
                            <th>Concepto</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Pago de Afiliación</td>
                            <td>$<?= number_format($nuevosIngresos, 2) ?></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>

        <h3>Aportes mensuales</h3>
        <div class="tabla-aportes">
            <table>
                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>Estado</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($meses as $col => $label):
                        $valor = isset($row[$col]) ? $row[$col] : null;
                        $pagado = !empty($valor) && $valor > 0;
                        if ($pagado) $total += $valor;
                    ?>
                        <tr>
                            <td><?= $label ?></td>
                            <td class="<?= $pagado ? 'pagado' : 'no-pagado' ?>">
                                <?= $pagado ? 'Pagado' : 'No pagado' ?>
                            </td>
                            <td><?= $pagado ? '$' . number_format($valor, 2) : '-' ?></td>
                        </tr>
                    <?php endforeach; ?>
                    <tr>
                        <th colspan="2">Total Aportado</th>
                        <th>$<?= number_format($total, 2) ?></th>
                    </tr>
                </tbody>
            </table>
        </div>
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