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

            <?php session_start(); ?>
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

    <main class="container">
        <h1 style="text-align:center; margin-top: 1rem;">
            <i class="fas fa-chart-bar"></i> Reportes - ASODAT
        </h1>

        <!-- Botones de navegación -->
        <div class="botones" style="text-align:center; margin: 20px 0;">
            <button class="btn btn-reporte" onclick="mostrarSeccion('nuevosIngresos')">
                📥 Nuevos Ingresos
            </button>
            <button class="btn btn-reporte" onclick="mostrarSeccion('aporteIndividual')">
                👤 Aporte Individual
            </button>
            <button class="btn btn-reporte" onclick="mostrarSeccion('aporteMensual')">
                📅 Aporte Mensual
            </button>
        </div>

        <!-- Secciones (ocultas por defecto) -->
        <div id="nuevosIngresos" class="seccion" style="display: none;">
            <h2><i class="fas fa-user-plus"></i> Reporte de Nuevos Ingresos</h2>

            <form method="post">
                <input type="hidden" name="seccion_activa" value="nuevosIngresos">
                <label><strong>Desde:</strong></label>
                <select name="mes_inicio" required>
                    <?php
                    $meses_op = [
                        '01' => 'Enero',
                        '02' => 'Febrero',
                        '03' => 'Marzo',
                        '04' => 'Abril',
                        '05' => 'Mayo',
                        '06' => 'Junio',
                        '07' => 'Julio',
                        '08' => 'Agosto',
                        '09' => 'Septiembre',
                        '10' => 'Octubre',
                        '11' => 'Noviembre',
                        '12' => 'Diciembre'
                    ];
                    foreach ($meses_op as $num => $nombre) {
                        echo "<option value=\"$num\">$nombre</option>";
                    }
                    ?>
                </select>
                <select name="anio_inicio" required>
                    <?php for ($a = 2023; $a <= 2025; $a++) echo "<option value=\"$a\">$a</option>"; ?>
                </select>

                <label style="margin-left: 20px;"><strong>Hasta:</strong></label>
                <select name="mes_fin" required>
                    <?php foreach ($meses_op as $num => $nombre) echo "<option value=\"$num\">$nombre</option>"; ?>
                </select>
                <select name="anio_fin" required>
                    <?php for ($a = 2023; $a <= 2025; $a++) echo "<option value=\"$a\">$a</option>"; ?>
                </select>

                <br><br>
                <button type="submit" name="buscar_ingresos" class="btn-reporte">Buscar</button>
            </form>

            <?php
            include 'conexion.php';
            if (isset($_POST['buscar_ingresos'])) {
                $inicio = $_POST['anio_inicio'] . '-' . $_POST['mes_inicio'] . '-01';
                $fin = $_POST['anio_fin'] . '-' . $_POST['mes_fin'] . '-31';

                if ($inicio > $fin) {
                    echo "<p style='color:red;'>El rango de fechas es inválido.</p>";
                } else {
                    $query = "
                SELECT COUNT(s.cedula) AS total_personas, 
                       SUM(a.nuevos_ingresos) AS total_ingresos
                FROM socios s
                JOIN aportes a ON s.cedula = a.cedula
                WHERE s.fecha_afiliacion BETWEEN '$inicio' AND '$fin'
            ";
                    $res = mysqli_query($conn, $query);
                    $data = mysqli_fetch_assoc($res);

                    echo "<div style='margin-top: 20px;'>
                        <p><strong>Total de personas nuevas:</strong> {$data['total_personas']}</p>
                        <p><strong>Total de nuevos ingresos:</strong> $" . number_format($data['total_ingresos'], 2) . "</p>
                    </div>";

                    // Botón para exportar PDF
                    echo '
                        <form method="post" action="pdfs/generar_pdf_ingresos.php" target="_blank">
                            <input type="hidden" name="fecha_inicio" value="' . htmlspecialchars($inicio) . '">
                            <input type="hidden" name="fecha_fin" value="' . htmlspecialchars($fin) . '">
                            <button type="submit" class="btn-reporte" style="margin-top: 10px;">📄 Exportar PDF</button>
                        </form>';
                }
            }
            ?>
        </div>


        <div id="aporteIndividual" class="seccion" style="display: none;">
            <h2><i class="fas fa-user"></i> Consulta de Aportes Individuales</h2>

            <form method="post">
                <input type="hidden" name="seccion_activa" value="aporteIndividual">
                <label><strong>Cédula:</strong></label><br>
                <input type="text" name="cedula_ind" placeholder="Ingrese la cédula" required style="width: 250px;"><br><br>

                <label><strong>Desde el mes:</strong></label>
                <select name="mes_inicio" required>
                    <?php
                    $meses = ['dic_aa', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre'];
                    foreach ($meses as $mes) echo "<option value=\"$mes\">$mes</option>";
                    ?>
                </select>

                <label style="margin-left: 20px;"><strong>Hasta el mes:</strong></label>
                <select name="mes_fin" required>
                    <?php
                    foreach ($meses as $mes) echo "<option value=\"$mes\">$mes</option>";
                    ?>
                </select>

                <br><br>
                <button type="submit" name="buscar_ind" class="btn-reporte">Buscar</button>
            </form>

            <?php
            if (isset($_POST['buscar_ind'])) {
                $cedula = mysqli_real_escape_string($conn, $_POST['cedula_ind']);
                $inicio = $_POST['mes_inicio'];
                $fin = $_POST['mes_fin'];

                $indiceInicio = array_search($inicio, $meses);
                $indiceFin = array_search($fin, $meses);

                if ($indiceInicio !== false && $indiceFin !== false && $indiceInicio <= $indiceFin) {
                    $res = mysqli_query($conn, "SELECT * FROM aportes WHERE cedula = '$cedula'");
                    if ($fila = mysqli_fetch_assoc($res)) {
                        echo "<p><strong>Nombre:</strong> {$fila['apellidos_y_nombres']}</p>";
                        echo "<table><tr><th>Mes</th><th>Aporte</th></tr>";

                        $total = 0;
                        for ($i = $indiceInicio; $i <= $indiceFin; $i++) {
                            $mes = $meses[$i];
                            $valor = $fila[$mes] ?? 0;
                            if ($valor > 0) {
                                echo "<tr><td>$mes</td><td>$" . number_format($valor, 2) . "</td></tr>";
                                $total += $valor;
                            }
                        }

                        echo "<tr><th>Total</th><th>$" . number_format($total, 2) . "</th></tr></table>";
                    } else {
                        echo "<p style='color:red;'>No se encontró la cédula ingresada.</p>";
                    }
                } else {
                    echo "<p style='color:red;'>Rango de meses inválido. El mes final debe ser igual o posterior al mes inicial.</p>";
                }
                // Botón para exportar a PDF
                echo '
                    <form method="post" action="pdfs/generar_pdf_individual.php" target="_blank">
                        <input type="hidden" name="cedula" value="' . htmlspecialchars($cedula) . '">
                        <input type="hidden" name="mes_inicio" value="' . htmlspecialchars($inicio) . '">
                        <input type="hidden" name="mes_fin" value="' . htmlspecialchars($fin) . '">
                        <button type="submit" class="btn-reporte" style="margin-top:10px;">📄 Exportar PDF</button>
                    </form>';
            }
            ?>
        </div>



        <div id="aporteMensual" class="seccion" style="display: none;">
            <h2><i class="fas fa-calendar-alt"></i> Consulta de Aporte Mensual</h2>

            <!-- Formulario solo para consultar -->
            <form method="post">
                <input type="hidden" name="seccion_activa" value="aporteMensual">
                <label for="mes">Selecciona un mes:</label>
                <select name="mes" required>
                    <option value="">-- Selecciona un mes --</option>
                    <?php
                    $meses = ['dic_aa', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre'];
                    foreach ($meses as $m) echo "<option value=\"$m\">$m</option>";
                    ?>
                </select>
                <br><br>
                <button type="submit" name="consultar_mes" class="btn-reporte">Consultar</button>
            </form>

            <?php
            include 'conexion.php';
            if (isset($_POST['consultar_mes']) && $_POST['mes'] != '') {
                $mes = mysqli_real_escape_string($conn, $_POST['mes']);

                // Total de aportes
                $sqlTotal = "SELECT SUM($mes) AS total_mes FROM aportes";
                $resTotal = mysqli_query($conn, $sqlTotal);
                $dataTotal = mysqli_fetch_assoc($resTotal);
                $total = $dataTotal['total_mes'] ?? 0;

                echo "<div style='margin-top: 20px;'>
            <p><strong>Total de aportes en $mes:</strong> $" . number_format($total, 2) . "</p>
        </div>";

                // Exportar PDF (solo se activa después de consultar)
                echo '<form method="post" action="pdfs/generar_pdf.php" target="_blank">
            <input type="hidden" name="mes" value="' . htmlspecialchars($mes) . '">
            <button type="submit" class="btn-reporte">📄 Exportar PDF</button>
        </form><br>';

                // Socios que NO han pagado
                $sqlNoPago = "SELECT cedula, apellidos_y_nombres FROM aportes WHERE $mes IS NULL OR $mes = 0 ORDER BY apellidos_y_nombres ASC";
                $resNoPago = mysqli_query($conn, $sqlNoPago);

                if (mysqli_num_rows($resNoPago) > 0) {
                    echo "<h4 style='margin-top: 25px;'>❌ Socios que NO han aportado en $mes:</h4>";
                    echo "<table><tr><th>Cédula</th><th>Nombre</th></tr>";
                    while ($row = mysqli_fetch_assoc($resNoPago)) {
                        echo "<tr><td>{$row['cedula']}</td><td>{$row['apellidos_y_nombres']}</td></tr>";
                    }
                    echo "</table>";
                } else {
                    echo "<p style='color: green; font-weight: bold;'>✔ Todos los socios han pagado en ese mes.</p>";
                }

                // Socios que SÍ han pagado
                $sqlSiPago = "SELECT cedula, apellidos_y_nombres, $mes AS monto FROM aportes WHERE $mes > 0 ORDER BY apellidos_y_nombres ASC";

                $resSiPago = mysqli_query($conn, $sqlSiPago);

                if (mysqli_num_rows($resSiPago) > 0) {
                    echo "<h4 style='margin-top: 30px;'>✅ Socios que SÍ han aportado en $mes:</h4>";
                    echo "<table><tr><th>Cédula</th><th>Nombre</th><th>Monto</th></tr>";
                    while ($row = mysqli_fetch_assoc($resSiPago)) {
                        $monto = number_format($row['monto'], 2);
                        echo "<tr><td>{$row['cedula']}</td><td>{$row['apellidos_y_nombres']}</td><td>$$monto</td></tr>";
                    }
                    echo "</table>";
                }
            }
            ?>
        </div>





        <style>
            .btn-reporte {
                background-color: #007bff;
                border: none;
                color: white;
                padding: 12px 25px;
                margin: 5px;
                font-size: 16px;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.3s ease;
            }

            .btn-reporte:hover {
                background-color: #0056b3;
            }

            .seccion {
                background: #f4faff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
                margin-bottom: 30px;
            }
        </style>

        <script>
            function mostrarSeccion(id) {
                // Oculta todas
                document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
                // Muestra la seleccionada
                document.getElementById(id).style.display = 'block';
            }
        </script>
        <?php if (isset($_POST['consultar_mes'])): ?>
            <script>
                window.addEventListener('DOMContentLoaded', () => {
                    mostrarSeccion('aporteMensual');
                });
            </script>
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
<script>
    function mostrarSeccion(id) {
        document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
        document.getElementById(id).style.display = 'block';
    }

    // Mostrar solo si se envió un formulario
    <?php if (isset($_POST['seccion_activa'])): ?>
        mostrarSeccion("<?= $_POST['seccion_activa'] ?>");
    <?php endif; ?>
</script>

</html>