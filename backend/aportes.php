<?php
session_start();
include 'conexion.php'; // ESTA LÍNEA ES LA CLAVE
if (!isset($_SESSION['cedula']) || $_SESSION['rol'] !== 'tesorero') {
    header("Location: login.php");
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
        html,
        body {
            height: 100%;
            /* Asegura que el body ocupe toda la altura disponible */
            margin: 0;
        }

        /* Footer */
        .footer {
            background-color: #20859b;
            padding: 1rem 1rem;
            text-align: center;
            font-size: 0.8rem;
            color: #fff;
            position: relative;
            bottom: 0;
            width: 100%;
            margin-top: auto;
            /* Esto asegura que el footer se quede al fondo */
        }

        /* Estilo general del contenedor */
        .contenedor-centro {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background-color: #f2f9fd;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            font-family: 'Segoe UI', sans-serif;
        }

        /* Título */
        .contenedor-centro h2 {
            text-align: center;
            color: #004080;
            margin-bottom: 20px;
        }

        /* Etiquetas y campos */
        .contenedor-centro label {
            font-weight: bold;
            display: block;
            margin-top: 15px;
            color: #333;
        }

        .contenedor-centro input[type="text"],
        .contenedor-centro input[type="number"] {
            width: 100%;
            padding: 10px;
            margin-top: 6px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
        }

        /* Botones */
        .contenedor-centro button {
            margin-top: 20px;
            background-color: #007baf;
            color: white;
            padding: 12px 20px;
            font-size: 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .contenedor-centro button:hover {
            background-color: #005f85;
        }

        /* Mensajes */
        .contenedor-centro p {
            margin-top: 10px;
            font-size: 15px;
            color: #444;
        }

        .contenedor-centro p strong {
            color: #000;
        }

        #total_pago {
            font-weight: bold;
            color: #0c5b82;
            font-size: 18px;
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
    <br>
    <main>
        <?php
        include 'conexion.php';
        $mensaje = "";
        $datos_socio = null;
        $tipo_usuario = '';

        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cedula_buscar'])) {
            $cedula = trim($_POST['cedula_buscar']);

            $stmt = $conn->prepare("SELECT * FROM socios WHERE cedula = ?");
            $stmt->bind_param("s", $cedula);
            $stmt->execute();
            $resultado = $stmt->get_result();

            if ($resultado->num_rows > 0) {
                $datos_socio = $resultado->fetch_assoc();
                $tipo_usuario = $datos_socio['tipo_usuario'];
            } else {
                $mensaje = "❌ No se encontró ningún socio con esa cédula.";
            }
        }
        ?>

        <div class="contenedor-centro">
            <h2>Gestión de Aportes</h2>

            <form method="POST">
                <label for="cedula_buscar">Cédula del socio:</label>
                <input type="text" name="cedula_buscar" id="cedula_buscar" required>
                <button type="submit">Buscar</button>
            </form>

            <form action="procesar_csv.php" method="POST" enctype="multipart/form-data">
                <label for="archivo">📤 Subir archivo de aportes (.csv):</label>
                <input type="file" name="archivo" id="archivo" accept=".csv" required>
                <button type="submit">Subir y procesar</button>
                <?php if (isset($_GET['mensaje'])): ?>
                    <?php if ($_GET['mensaje'] === 'correcto'): ?>
                        <div style="background:#d4edda; padding:10px; margin-bottom:10px; border:1px solid #c3e6cb;">
                            ✅ Archivo procesado correctamente y reporte generado.
                        </div>
                    <?php elseif ($_GET['mensaje'] === 'error_tipo'): ?>
                        <div style="background:#f8d7da; padding:10px; margin-bottom:10px; border:1px solid #f5c6cb;">
                            ❌ Solo se permiten archivos con extensión `.csv`.
                        </div>
                    <?php endif; ?>
                <?php endif; ?>
            </form>
            <form action="historial_reportes.php" method="GET">
                <button type="submit">📄 Ver historial de reportes</button>
            </form>

            <?php if (!empty($mensaje)): ?>
                <p style="color:red;"><?= $mensaje ?></p>
            <?php endif; ?>

            <?php if ($datos_socio): ?>
                <div class="datos-socio">
                    <p><strong>Nombre:</strong> <?= $datos_socio['apellidos_nombres'] ?></p>
                    <p><strong>Tipo de Socio:</strong> <?= ucfirst($tipo_usuario) ?></p>

                    <form method="POST" action="procesar_aporte.php" onsubmit="return validarPago();">
                        <input type="hidden" name="cedula" value="<?= $datos_socio['cedula'] ?>">

                        <?php
                        $consulta = $conn->prepare("SELECT * FROM aportes WHERE cedula = ?");
                        $consulta->execute([$datos_socio['cedula']]);
                        $registro = $consulta->get_result()->fetch_assoc();
                        $ya_pago_ingreso = isset($registro['nuevos_ingresos']) && floatval($registro['nuevos_ingresos']) > 0;
                        ?>

                        <input type="hidden" name="tipo_usuario" id="tipo_usuario" value="<?= $tipo_usuario ?>">
                        <input type="hidden" id="cuota_ingreso" value="<?= ($tipo_usuario === 'nuevo' && !$ya_pago_ingreso) ? 5 : 0 ?>">
                        <input type="hidden" id="cuota_mensual" value="10">

                        <h4>Selecciona los meses que deseas pagar:</h4>
                        <?php
                        $meses_bd = [
                            'dic_aa' => 'Diciembre Año Anterior',
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

                        $orden_meses = array_keys($meses_bd);
                        $hoy = new DateTime();
                        $mes_actual = (int)$hoy->format('n');
                        $hay_meses_pendientes = false;

                        foreach ($orden_meses as $index => $campo) {
                            $valor = isset($registro[$campo]) ? floatval($registro[$campo]) : 0;

                            if ($tipo_usuario === 'nuevo') {
                                if (($campo == 'dic_aa' || $index <= $mes_actual) && $valor == 0) {
                                    echo "<label><input type='checkbox' name='meses_seleccionados[]' value='$campo' onchange='calcularTotal()'> {$meses_bd[$campo]}</label><br>";
                                    $hay_meses_pendientes = true;
                                }
                            } else {
                                if ($valor == 0) {
                                    echo "<label><input type='checkbox' name='meses_seleccionados[]' value='$campo' onchange='calcularTotal()'> {$meses_bd[$campo]}</label><br>";
                                    $hay_meses_pendientes = true;
                                }
                            }
                        }

                        // Mostrar diciembre solo si es adherente o fundador
                        if ($tipo_usuario !== 'nuevo') {
                            echo "<label><input type='checkbox' id='check_diciembre' value='dic_aa' onchange='validarDiciembre(this)'> Diciembre</label><br>";
                        }

                        if (!$hay_meses_pendientes) {
                            echo "<p style='color: green;'>✅ No hay meses pendientes por pagar.</p>";
                        }
                        ?>

                        <p><strong>Total a pagar:</strong> $<span id="total_pago">0.00</span></p>

                        <?php if ($tipo_usuario === 'nuevo'): ?>
                            <label for="observaciones">Observaciones (solo para socios nuevos):</label><br>
                            <textarea name="observaciones" id="observaciones" rows="3" cols="40" placeholder="Opcional..."></textarea><br><br>
                        <?php endif; ?>

                        <?php if ($hay_meses_pendientes): ?>
                            <button type="submit">Registrar Aporte</button>
                        <?php endif; ?>
                    </form>
                </div>
            <?php endif; ?>
        </div>

        <script>
            function calcularTotal() {
                const cuotaIngreso = parseFloat(document.getElementById('cuota_ingreso').value);
                const cuotaMensual = parseFloat(document.getElementById('cuota_mensual').value);
                const checkboxes = document.querySelectorAll('input[name="meses_seleccionados[]"]:checked');
                const total = cuotaIngreso + (checkboxes.length * cuotaMensual);
                document.getElementById('total_pago').textContent = total.toFixed(2);
            }

            function validarPago() {
                const checkboxes = document.querySelectorAll('input[name="meses_seleccionados[]"]:checked');
                if (checkboxes.length === 0) {
                    alert("Debe seleccionar al menos un mes para registrar el aporte.");
                    return false;
                }
                return true;
            }

            function validarDiciembre(checkbox) {
                const mesActual = new Date().getMonth() + 1;
                if (mesActual < 12) {
                    alert("🚫 No puedes pagar diciembre todavía. Solo se habilita en diciembre.");
                    checkbox.checked = false;
                } else {
                    const hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = 'meses_seleccionados[]';
                    hiddenInput.value = 'dic_aa';
                    checkbox.closest('form').appendChild(hiddenInput);
                    calcularTotal();
                }
            }
            window.onload = calcularTotal;
        </script>
    </main>
    <br>


    <div class="footer">
        <p>&copy; 2025 ASODAT - Asociación de Docentes, Personal Administrativo y Trabajadores de la ESPE sede Latacunga.</p>
    </div>

</body>
<?php if (isset($_GET['mensaje'])): ?>
    <div style="background-color: #e6ffe6; border: 1px solid #00a000; padding: 10px; margin: 10px 0; border-radius: 5px;">
        <?php
        switch ($_GET['mensaje']) {
            case 'exito':
                echo "✅ Archivo procesado correctamente.";
                break;
            case 'error_tipo':
                echo "⚠️ Solo se permiten archivos .csv.";
                break;
        }
        ?>
    </div>
<?php endif; ?>
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