<?php
require_once 'conexion.php';
require_once 'dompdf/autoload.inc.php';

use Dompdf\Dompdf;

function obtenerMesesOrdenados()
{
    return ['dic_aa', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre'];
}

$archivo = $_FILES['archivo']['tmp_name'];
$nombreArchivo = $_FILES['archivo']['name'];
$fecha = date('Y-m-d H:i:s');
$meses = obtenerMesesOrdenados();
$reporte = [];
$sociosActualizados = [];

// 🔁 Limpiar historial anterior
$conn->query("DELETE FROM historial_carga_aportes");

if (($handle = fopen($archivo, "r")) !== false) {
    for ($i = 0; $i < 3; $i++) fgetcsv($handle, 1000, ";"); // Saltar encabezado

    while (($data = fgetcsv($handle, 1000, ";")) !== false) {
        $cedula = trim($data[6] ?? '');
        $montoStr = str_replace(',', '.', trim($data[9] ?? '0'));
        $monto = floatval($montoStr);

        if ($cedula === '' || $monto <= 0) continue;

        // Buscar en aportes_socios
        $stmt = $conn->prepare("SELECT * FROM aportes WHERE cedula = ?");
        $stmt->bind_param("s", $cedula);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows === 0) {
            $reporte[] = ['cedula' => $cedula, 'estado' => '❌ No encontrada'];
            continue;
        }

        // Buscar nombre desde tabla socios
        $stmtNombre = $conn->prepare("SELECT apellidos_nombres FROM socios WHERE cedula = ?");
        $stmtNombre->bind_param("s", $cedula);
        $stmtNombre->execute();
        $resNombre = $stmtNombre->get_result();
        $nombre = $resNombre->fetch_assoc()['apellidos_nombres'] ?? 'Desconocido';

        $socio = $resultado->fetch_assoc();
        $detalles = [];

        foreach ($meses as $mes) {
            if ($monto <= 0) break;
            if (is_null($socio[$mes]) || floatval($socio[$mes]) == 0) {
                $aplicar = min(10.00, $monto);

                // Actualizar aportes
                $stmtUpdate = $conn->prepare("UPDATE aportes SET $mes = ? WHERE cedula = ?");
                $stmtUpdate->bind_param("ds", $aplicar, $cedula);
                $stmtUpdate->execute();

                // Insertar en historial
                $stmtHist = $conn->prepare("INSERT INTO historial_carga_aportes (cedula, nombre, mes, monto, archivo, fecha_registro) VALUES (?, ?, ?, ?, ?, ?)");
                $stmtHist->bind_param("sssdss", $cedula, $nombre, $mes, $aplicar, $nombreArchivo, $fecha);

                $stmtHist->execute();

                $detalles[] = "$mes: \$$aplicar";
                $monto -= $aplicar;
            }
        }

        if (count($detalles)) {
            $reporte[] = ['cedula' => $cedula, 'nombre' => $nombre, 'estado' => 'Aportes aplicados', 'detalle' => implode(', ', $detalles)];
            $sociosActualizados[] = $cedula;
        } else {
            $reporte[] = ['cedula' => $cedula, 'nombre' => $nombre, 'estado' => 'Sin meses disponibles'];
        }
    }

    fclose($handle);
}

// Obtener socios que no recibieron cambios
$sociosSinCambios = [];
$result = $conn->query("SELECT cedula, apellidos_nombres FROM socios");
while ($row = $result->fetch_assoc()) {
    if (!in_array($row['cedula'], $sociosActualizados)) {
        $sociosSinCambios[] = $row['apellidos_nombres'] . " ({$row['cedula']})";
    }
}

// === Generar PDF ===
$html = '
<style>
    body { font-family: Arial; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
    th { background-color: #f2f2f2; }
</style>
<h2 style="text-align:center;">Reporte de Aportes - ' . date('d/m/Y H:i') . '</h2>
<p><strong>Archivo:</strong> ' . htmlspecialchars($nombreArchivo) . '</p>
<table>
<tr><th>#</th><th>Cédula</th><th>Nombre</th><th>Estado</th><th>Detalle</th></tr>';

foreach ($reporte as $i => $r) {
    $html .= '<tr>
        <td>' . ($i + 1) . '</td>
        <td>' . htmlspecialchars($r['cedula']) . '</td>
        <td>' . htmlspecialchars($r['nombre'] ?? '-') . '</td>
        <td>' . htmlspecialchars($r['estado']) . '</td>
        <td>' . htmlspecialchars($r['detalle'] ?? '-') . '</td>
    </tr>';
}

$html .= '</table>';

if (!empty($sociosSinCambios)) {
    $html .= '<h3 style="margin-top:20px;">🙅‍♂️ Socios sin aportes en esta carga:</h3><ul>';
    foreach ($sociosSinCambios as $nombreCedula) {
        $html .= '<li>' . htmlspecialchars($nombreCedula) . '</li>';
    }
    $html .= '</ul>';
}

$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

$nombrePDF = "reporte_aportes_" . date("Ymd_His") . ".pdf";
$dompdf->stream($nombrePDF, ["Attachment" => true]);
exit;
