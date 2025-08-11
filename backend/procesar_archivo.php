<?php
require_once __DIR__ . '/PhpSpreadsheet/PhpSpreadsheet-4.2.0/src/Psr/SimpleCache/CacheInterface.php';
require_once __DIR__ . '/PhpSpreadsheet/PhpSpreadsheet-4.2.0/src/Bootstrap.php';

include 'conexion.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['archivo'])) {
    $archivo = $_FILES['archivo'];
    $nombre_archivo = basename($archivo['name']);
    $ext = strtolower(pathinfo($nombre_archivo, PATHINFO_EXTENSION));
    $permitidos = ['xlsx', 'csv'];

    if (!in_array($ext, $permitidos)) {
        echo "<script>alert('❌ Solo se permiten archivos .xlsx o .csv'); window.location.href='aportes.php';</script>";
        exit;
    }

    try {
        $documento = IOFactory::load($archivo['tmp_name']);
        $hoja = $documento->getActiveSheet();
        $filas = $hoja->toArray();

        // Definir los campos de mes en orden cronológico
        $campos_mes = ['dic_aa', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septtiembre', 'octubre', 'noviembre'];

        $actualizados = 0;

        for ($i = 3; $i < count($filas); $i++) {
            $fila = $filas[$i];
            $cedula = trim($fila[6]);         // columna G
            $monto_total = floatval($fila[9]); // columna J

            if (empty($cedula) || $monto_total <= 0) continue;

            // Obtener aportes actuales
            $sql = "SELECT " . implode(', ', $campos_mes) . " FROM aportes WHERE cedula = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $cedula);
            $stmt->execute();
            $resultado = $stmt->get_result();
            $estado = $resultado->fetch_assoc();
            $stmt->close();

            if (!$estado) continue;

            $monto_restante = $monto_total;
            $campos_actualizar = [];
            $valores_actualizar = [];
            $tipos = '';

            foreach ($campos_mes as $campo) {
                if ($monto_restante <= 0) break;

                $valor_actual = $estado[$campo];
                if (is_null($valor_actual) || floatval($valor_actual) == 0) {
                    $monto_aplicar = min(10.00, $monto_restante);

                    // Armar update dinámico
                    $campos_actualizar[] = "$campo = ?";
                    $valores_actualizar[] = $monto_aplicar;
                    $tipos .= 'd';

                    // Registrar en historial
                    $stmt_hist = $conn->prepare("INSERT INTO historial_carga_aportes (cedula, mes, monto, archivo) VALUES (?, ?, ?, ?)");
                    $stmt_hist->bind_param("ssds", $cedula, $campo, $monto_aplicar, $nombre_archivo);
                    $stmt_hist->execute();
                    $stmt_hist->close();

                    $monto_restante -= $monto_aplicar;
                }
            }

            if (!empty($campos_actualizar)) {
                $valores_actualizar[] = $cedula;
                $tipos .= 's';
                $sql_update = "UPDATE aportes SET " . implode(", ", $campos_actualizar) . " WHERE cedula = ?";
                $stmt_up = $conn->prepare($sql_update);
                $stmt_up->bind_param($tipos, ...$valores_actualizar);
                $stmt_up->execute();
                $stmt_up->close();
                $actualizados++;
            }
        }

        echo "<script>alert('✅ Se actualizaron $actualizados socios correctamente con valores distribuidos.'); window.location.href='aportes.php';</script>";
    } catch (Exception $e) {
        echo "❌ Error capturado: " . $e->getMessage();
        exit;
    }
}
