<?php
session_start();
include 'conexion.php'; // ESTA LÍNEA ES LA CLAVE
if (!isset($_SESSION['cedula']) || $_SESSION['rol'] !== 'tesorero') {
    header("Location: login.php");
    exit();
}
$conexion = new mysqli("localhost", "root", "", "asodat_db");
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}
// Filtro por cédula

$cedulaBuscada = isset($_GET['cedula']) ? $_GET['cedula'] : '';

$sql = "SELECT * FROM aportes";
if (!empty($cedulaBuscada)) {
    $sql .= " WHERE cedula LIKE '%" . $conexion->real_escape_string($cedulaBuscada) . "%'";
}
$sql .= " ORDER BY apellidos_y_nombres ASC";

$resultado = $conexion->query($sql);

if (!$resultado) {
    die("Error en la consulta SQL: " . $conexion->error);
}
// Eliminar datos (POST)
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['eliminar_aportes'])) {
    $updateSql = "
        UPDATE aportes SET
            nuevos_ingresos = NULL,
            dic_aa = NULL,
            enero = NULL,
            febrero = NULL,
            marzo = NULL,
            abril = NULL,
            mayo = NULL,
            junio = NULL,
            julio = NULL,
            agosto = NULL,
            septiembre = NULL,
            octubre = NULL,
            noviembre = NULL
    ";
    $conexion->query($updateSql);
    header("Location: " . $_SERVER['PHP_SELF']); // Recarga para evitar re-envío de POST
    exit();
}
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
        h2 {
            text-align: center;
            color: #333;
            margin-bottom: 20px;
        }

        .form-container {
            max-width: 1200px;
            margin: 20px auto;
            text-align: center;
        }

        .form-container input[type="text"] {
            padding: 8px;
            width: 250px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .form-container button {
            padding: 8px 16px;
            background-color: #005f73;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
        }

        .form-container button:hover {
            background-color: #0a9396;
        }

        .table-scroll-wrapper {
            overflow-x: auto;
            width: 100%;
            margin: auto;
            padding: 0 1rem;
        }

        .table-scroll-wrapper table {
            min-width: 1300px;
            width: max-content;
            border-collapse: collapse;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        th,
        td {
            padding: 6px 4px;
            border: 1px solid #ccc;
            text-align: center;
            font-size: 11px;
            white-space: nowrap;
        }

        th {
            background-color: #005f73;
            color: #fff;
            font-size: 12px;
        }

        tr:hover {
            background-color: #f1f1f1;
        }

        .footer {
            background-color: #20859b;
            padding: 1rem;
            text-align: center;
            font-size: 0.8rem;
            color: #fff;
            margin-top: 2rem;
        }

        .delete-btn {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #ae2012;
            color: white;
            font-weight: bold;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .delete-btn:hover {
            background-color: #9b2226;
        }

        .form-container button[type="submit"]:nth-child(2) {
            background-color: #6c757d;
        }

        .form-container button[type="submit"]:nth-child(2):hover {
            background-color: #495057;
        }

        .footer {
            background-color: #20859b;
            padding: 1rem;
            text-align: center;
            font-size: 0.8rem;
            color: #fff;
            margin-top: 2rem;
        }

        .footer .container {
            max-width: 1200px;
            margin: auto;
        }

        .tabla-contenedor {
            display: flex;
            justify-content: center;
            margin-top: 20px;
            padding: 0 1rem;
        }

        .tabla-scroll {
            max-width: 100%;
            overflow-x: auto;
            border-radius: 6px;
            border: 1px solid #ccc;
            background-color: white;
            padding: 10px;
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
        }

        .tabla-scroll table {
            min-width: 1200px;
            border-collapse: collapse;
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
        <h2>Listado de Aportes de Socios</h2>

        <div class="form-container">
            <form method="GET" style="display: inline-block;">
                <input type="text" name="cedula" placeholder="Buscar por cédula" value="<?= htmlspecialchars($cedulaBuscada) ?>">
                <button type="submit">Buscar</button>
            </form>
            <form method="GET" action="<?= $_SERVER['PHP_SELF'] ?>" style="display: inline-block;">
                <button type="submit" style="background-color: #6c757d;">Limpiar</button>
            </form>
        </div>

        <div class="tabla-contenedor">
            <div class="tabla-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Cédula</th>
                            <th>Apellidos y Nombres</th>
                            <th>Nuevos Ingresos</th>
                            <th>Diciembre AA</th>
                            <th>Enero</th>
                            <th>Febrero</th>
                            <th>Marzo</th>
                            <th>Abril</th>
                            <th>Mayo</th>
                            <th>Junio</th>
                            <th>Julio</th>
                            <th>Agosto</th>
                            <th>Septiembre</th>
                            <th>Octubre</th>
                            <th>Noviembre</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        if ($resultado->num_rows > 0) {
                            while ($fila = $resultado->fetch_assoc()) {
                                echo "<tr>";
                                echo "<td>" . htmlspecialchars($fila['cedula']) . "</td>";
                                echo "<td>" . htmlspecialchars($fila['apellidos_y_nombres']) . "</td>";
                                echo "<td>" . $fila['nuevos_ingresos'] . "</td>";
                                echo "<td>" . $fila['dic_aa'] . "</td>";
                                echo "<td>" . $fila['enero'] . "</td>";
                                echo "<td>" . $fila['febrero'] . "</td>";
                                echo "<td>" . $fila['marzo'] . "</td>";
                                echo "<td>" . $fila['abril'] . "</td>";
                                echo "<td>" . $fila['mayo'] . "</td>";
                                echo "<td>" . $fila['junio'] . "</td>";
                                echo "<td>" . $fila['julio'] . "</td>";
                                echo "<td>" . $fila['agosto'] . "</td>";
                                echo "<td>" . $fila['septiembre'] . "</td>";
                                echo "<td>" . $fila['octubre'] . "</td>";
                                echo "<td>" . $fila['noviembre'] . "</td>";

                                echo "</tr>";
                            }
                        } else {
                            echo "<tr><td colspan='16'>No hay registros encontrados.</td></tr>";
                        }
                        $conexion->close();
                        ?>
                    </tbody>
                </table>
            </div>
        </div>

        <form method="POST">
            <button type="submit" name="eliminar_aportes" class="delete-btn" onclick="return confirm('¿Estás seguro de eliminar todos los aportes?')">
                Eliminar todos los aportes
            </button>
        </form>

        <hr style="margin: 50px auto; max-width: 1200px;">

        <h3 style="text-align:center;">Consultar Historial de Aportes por Año</h3>

        <form method="GET" style="text-align:center; margin-bottom: 20px;">
            <label for="anio">Selecciona un año:</label>
            <select name="anio" id="anio" onchange="this.form.submit()" style="padding: 6px 10px; font-size: 14px; border-radius: 4px;">
                <option value="">-- Seleccionar --</option>
                <?php
                $conexion = new mysqli("localhost", "root", "", "asodat_db");
                $aniosQuery = "SELECT DISTINCT anio_respaldo FROM historial_aportes ORDER BY anio_respaldo DESC";
                $aniosResult = $conexion->query($aniosQuery);
                $anioSeleccionado = isset($_GET['anio']) ? intval($_GET['anio']) : '';

                while ($row = $aniosResult->fetch_assoc()) {
                    $anio = $row['anio_respaldo'];
                    $selected = ($anio == $anioSeleccionado) ? 'selected' : '';
                    echo "<option value='$anio' $selected>$anio</option>";
                }
                ?>
            </select>
        </form>

        <?php
        if (!empty($anioSeleccionado)):
            $historialSql = "SELECT * FROM historial_aportes WHERE anio_respaldo = $anioSeleccionado ORDER BY apellidos_y_nombres ASC";
            $historialResult = $conexion->query($historialSql);
        ?>
            <div class="tabla-contenedor">
                <div class="tabla-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>Cédula</th>
                                <th>Apellidos y Nombres</th>
                                <th>Nuevos Ingresos</th>
                                <th>Diciembre AA</th>
                                <th>Enero</th>
                                <th>Febrero</th>
                                <th>Marzo</th>
                                <th>Abril</th>
                                <th>Mayo</th>
                                <th>Junio</th>
                                <th>Julio</th>
                                <th>Agosto</th>
                                <th>Septiembre</th>
                                <th>Octubre</th>
                                <th>Noviembre</th>
                                <th>Fecha de Respaldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            if ($historialResult->num_rows > 0):
                                while ($fila = $historialResult->fetch_assoc()):
                            ?>
                                    <tr>
                                        <td><?= htmlspecialchars($fila['cedula']) ?></td>
                                        <td><?= htmlspecialchars($fila['apellidos_y_nombres']) ?></td>
                                        <td><?= $fila['nuevos_ingresos'] ?></td>
                                        <td><?= $fila['dic_aa'] ?></td>
                                        <td><?= $fila['enero'] ?></td>
                                        <td><?= $fila['febrero'] ?></td>
                                        <td><?= $fila['marzo'] ?></td>
                                        <td><?= $fila['abril'] ?></td>
                                        <td><?= $fila['mayo'] ?></td>
                                        <td><?= $fila['junio'] ?></td>
                                        <td><?= $fila['julio'] ?></td>
                                        <td><?= $fila['agosto'] ?></td>
                                        <td><?= $fila['septiembre'] ?></td>
                                        <td><?= $fila['octubre'] ?></td>
                                        <td><?= $fila['noviembre'] ?></td>
                                        <td><?= $fila['fecha_respaldo'] ?></td>
                                    </tr>
                            <?php
                                endwhile;
                            else:
                                echo "<tr><td colspan='16'>No hay registros para el año seleccionado.</td></tr>";
                            endif;
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?>

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