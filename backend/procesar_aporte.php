<?php
session_start();
include 'conexion.php';

if (!isset($_SESSION['cedula']) || $_SESSION['rol'] !== 'tesorero') {
    header("Location: login.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cedula = $_POST['cedula'];
    $tipo_usuario = $_POST['tipo_usuario'];
    $cuota_mensual = 10.00;
    $cuota_ingreso = 0.00;
    $total_pagado = 0.00;

    // Obtener nombre del socio
    $stmtNombre = $conn->prepare("SELECT apellidos_nombres FROM socios WHERE cedula = ?");
    $stmtNombre->bind_param("s", $cedula);
    $stmtNombre->execute();
    $stmtNombre->bind_result($nombre);
    $stmtNombre->fetch();
    $stmtNombre->close();

    // Verificar que haya meses seleccionados
    if (!isset($_POST['meses_seleccionados']) || count($_POST['meses_seleccionados']) === 0) {
        echo "<script>alert('❌ No se seleccionaron meses para registrar.'); window.location.href='aportes.php';</script>";
        exit;
    }

    $meses = $_POST['meses_seleccionados'];
    $observaciones = $_POST['observaciones'] ?? null;

    // Si es nuevo, registrar ingreso
    $ya_pago_ingreso = false;

    // Verificar si ya pagó ingreso antes
    if ($tipo_usuario === 'nuevo') {
        $stmt = $conn->prepare("SELECT nuevos_ingresos FROM aportes WHERE cedula = ?");
        $stmt->bind_param("s", $cedula);
        $stmt->execute();
        $stmt->bind_result($ingreso_actual);
        $stmt->fetch();
        $stmt->close();

        $ya_pago_ingreso = floatval($ingreso_actual) > 0;

        if (!$ya_pago_ingreso) {
            $cuota_ingreso = 5.00;
            $total_pagado += $cuota_ingreso;

            $stmtIngreso = $conn->prepare("UPDATE aportes SET nuevos_ingresos = ? WHERE cedula = ?");
            $stmtIngreso->bind_param("ds", $cuota_ingreso, $cedula);
            $stmtIngreso->execute();
        }
    }

    // Registrar aportes mensuales
    foreach ($meses as $mes) {
        $sql = "UPDATE aportes SET $mes = ? WHERE cedula = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ds", $cuota_mensual, $cedula);
        $stmt->execute();
        $total_pagado += $cuota_mensual;
    }

    // Verificar si debe cambiar a adherente
    // Verificar si debe cambiar a adherente
    if ($tipo_usuario === 'nuevo') {
        $meses_bd = [
            'dic_aa',
            'enero',
            'febrero',
            'marzo',
            'abril',
            'mayo',
            'junio',
            'julio',
            'agosto',
            'septiembre',
            'octubre',
            'noviembre'
        ];

        $hoy = new DateTime();
        $mes_actual = (int)$hoy->format('n'); // 1 a 12

        $todos_pagados = true;

        foreach ($meses_bd as $index => $campo) {
            // Solo verificar hasta el mes actual
            if ($campo == 'dic_aa' || $index <= $mes_actual) {
                $sql = "SELECT $campo FROM aportes WHERE cedula = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("s", $cedula);
                $stmt->execute();
                $stmt->bind_result($valor);
                $stmt->fetch();
                $stmt->close();

                if (empty($valor) || floatval($valor) == 0) {
                    $todos_pagados = false;
                    break;
                }
            }
        }

        if ($todos_pagados) {
            $stmtTipo = $conn->prepare("UPDATE socios SET tipo_usuario = 'adherente' WHERE cedula = ?");
            $stmtTipo->bind_param("s", $cedula);
            $stmtTipo->execute();
            $tipo_usuario = 'adherente'; // actualizar para comprobante
        }
    }

    // Clasificar meses vencidos vs adelantados
    // Clasificar meses vencidos vs adelantados
    $meses_v = [];
    $meses_a = [];

    $mes_map = [
        'dic_aa'     => 0,
        'enero'      => 1,
        'febrero'    => 2,
        'marzo'      => 3,
        'abril'      => 4,
        'mayo'       => 5,
        'junio'      => 6,
        'julio'      => 7,
        'agosto'     => 8,
        'septiembre' => 9,
        'octubre'    => 10,
        'noviembre'  => 11
    ];

    $anio_actual = (int)date('Y');
    $mes_actual  = (int)date('n'); // Mes numérico actual (1-12)

    foreach ($meses as $m) {
        $mes_num = $mes_map[$m] ?? null;

        if ($mes_num === null) {
            // El mes no es válido, lo ignoramos
            continue;
        }

        // dic_aa (0) siempre es vencido
        $es_vencido = ($mes_num === 0) || ($mes_num <= $mes_actual);

        if ($tipo_usuario === 'nuevo' && $es_vencido) {
            $meses_v[] = $m;
        } else {
            $meses_a[] = $m;
        }
    }

    // Obtener siguiente número de comprobante
    $result = $conn->query("SELECT MAX(numero_comprobante) AS max_num FROM comprobantes_pago");
    $row = $result->fetch_assoc();
    $siguiente_comprobante = ($row['max_num'] ?? 0) + 1;

    // Preparar datos para insertar comprobante
    $fecha_actual = date('Y-m-d H:i:s');
    $meses_v_str = implode(', ', $meses_v);
    $meses_a_str = implode(', ', $meses_a);

    // Insertar comprobante
    $stmtReg = $conn->prepare("INSERT INTO comprobantes_pago 
    (cedula, fecha_pago, total, ingreso, meses_vencidos, meses_adelantados, numero_comprobante, observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    $stmtReg->bind_param("ssdsssis", $cedula, $fecha_actual, $total_pagado, $cuota_ingreso, $meses_v_str, $meses_a_str, $siguiente_comprobante, $observaciones);
    $stmtReg->execute();

    // Guardar en sesión para generar comprobante
    $_SESSION['comprobante'] = [
        'nombre' => $nombre,
        'cedula' => $cedula,
        'tipo_usuario' => $tipo_usuario,
        'meses' => $meses,
        'total_pagado' => $total_pagado,
        'cuota_ingreso' => $cuota_ingreso
    ];

    // Redirigir con alerta y descarga de comprobante
    echo "<script>
    alert('✅ Aporte registrado correctamente. Descargando comprobante...');
    window.location.href = 'descargar_y_redirigir.html';
</script>";
}
