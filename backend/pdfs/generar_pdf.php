<?php
require_once __DIR__ . '/../dompdf/autoload.inc.php';
include __DIR__ . '/../conexion.php';

use Dompdf\Dompdf;
use Dompdf\Options;

$mes = $_POST['mes'] ?? '';
if (!$mes) die('Mes no válido.');

// Total aportado
$sqlTotal = "SELECT SUM($mes) AS total_mes FROM aportes";
$resTotal = mysqli_query($conn, $sqlTotal);
$dataTotal = mysqli_fetch_assoc($resTotal);
$total = $dataTotal['total_mes'] ?? 0;

// Deudores
$sqlNoPago = "SELECT cedula, apellidos_y_nombres FROM aportes WHERE $mes IS NULL OR $mes = 0";
$resNoPago = mysqli_query($conn, $sqlNoPago);

// Pagados
$sqlSiPago = "SELECT cedula, apellidos_y_nombres, $mes AS monto FROM aportes WHERE $mes > 0";
$resSiPago = mysqli_query($conn, $sqlSiPago);

// Cargar logo correctamente
$logoPath = __DIR__ . '/../img/Logo Asociación.jpeg';
if (file_exists($logoPath)) {
    $logoBase64 = base64_encode(file_get_contents($logoPath));
    $logoImgTag = '<img src="data:image/jpeg;base64,' . $logoBase64 . '" height="70">';
} else {
    $logoImgTag = '<p style="color:red;">[Logo no disponible]</p>';
}

// HTML del PDF
$html = '
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        h2, h3 { text-align: center; color: #20859b; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #888; padding: 6px; text-align: center; }
        th { background-color: #f0f0f0; }
        .logo { text-align: center; margin-bottom: 20px; }
    </style>

    <div class="logo">
        ' . $logoImgTag . '
        <h2>ASODAT - Reporte de Aporte Mensual</h2>
    </div>

    <p><strong>Mes consultado:</strong> ' . strtoupper($mes) . '</p>
    <p><strong>Total aportado:</strong> $' . number_format($total, 2) . '</p>

    <h3>Socios que NO han pagado</h3>
    <table>
        <tr><th>Cédula</th><th>Nombre</th></tr>';
while ($row = mysqli_fetch_assoc($resNoPago)) {
    $html .= "<tr><td>{$row['cedula']}</td><td>{$row['apellidos_y_nombres']}</td></tr>";
}
$html .= '</table>';

$html .= '
    <h3 style="margin-top:20px;">Socios que SÍ han pagado</h3>
    <table>
        <tr><th>Cédula</th><th>Nombre</th><th>Monto</th></tr>';
while ($row = mysqli_fetch_assoc($resSiPago)) {
    $monto = number_format($row['monto'], 2);
    $html .= "<tr><td>{$row['cedula']}</td><td>{$row['apellidos_y_nombres']}</td><td>\$$monto</td></tr>";
}
$html .= '</table>';

// PDF
$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream("reporte_aporte_mensual_$mes.pdf", ["Attachment" => true]);
exit;
