<?php
session_start();
date_default_timezone_set('America/Guayaquil'); // Ajustar zona horaria

require_once __DIR__ . '/../dompdf/autoload.inc.php';
include '../conexion.php';

use Dompdf\Dompdf;
use Dompdf\Options;

$logoPath = __DIR__ . '/../img/Logo Asociación.jpeg';
if (file_exists($logoPath)) {
    $logoBase64 = base64_encode(file_get_contents($logoPath));
    $logoImgTag = '<img src="data:image/jpeg;base64,' . $logoBase64 . '" height="70">';
} else {
    $logoImgTag = '<p style="color:red;">[Logo no disponible]</p>';
}

// Datos para encabezado
$fechaActual = date('d/m/Y H:i');
$cedulaSesion = $_SESSION['cedula'] ?? 'Desconocido';

// Consultar socios
$sql = "SELECT cedula, apellidos_nombres, regimen FROM socios ORDER BY apellidos_nombres ASC";
$res = $conn->query($sql);

// Comenzar HTML
$html = "
<style>
    body { font-family: Arial, sans-serif; font-size: 12px; }
    h2 { text-align: center; color: #20859b; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #888; padding: 6px; text-align: center; }
    th { background-color: #f0f0f0; }
    .header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .logo { text-align: center; margin-bottom: 10px; }
</style>

<div class='header'>
    <div></div>
    <div style='text-align: right;'>
        <strong>Fecha:</strong> $fechaActual<br>
        <strong>Cédula:</strong> $cedulaSesion
    </div>
</div>

<div class='logo'>
    $logoImgTag
    <h2>ASODAT - Listado de Socios</h2>
</div>

<table>
    <thead>
        <tr>
            <th>N.º</th>
            <th>Cédula</th>
            <th>Apellidos y Nombres</th>
            <th>Régimen</th>
        </tr>
    </thead>
    <tbody>";

$orden = 1; // Inicializar el contador

$orden = 1; // Inicializar el contador
while ($row = $res->fetch_assoc()) {
    $html .= "<tr>
        <td>$orden</td>
        <td>" . htmlspecialchars($row['cedula']) . "</td>
        <td>" . htmlspecialchars($row['apellidos_nombres']) . "</td>
        <td>" . htmlspecialchars($row['regimen']) . "</td>
    </tr>";
    $orden++;
}

$html .= '</tbody></table>';

// Configurar y renderizar PDF
$options = new Options();
$options->set('defaultFont', 'Arial');
$dompdf = new Dompdf($options);
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

// Agregar numeración centrada abajo
$canvas = $dompdf->getCanvas();
$fontMetrics = $dompdf->getFontMetrics();
$font = $fontMetrics->get_font('Arial', 'normal');
$size = 10;

$canvas->page_script(function ($pageNum, $pageCount, $canvas, $fontMetrics) use ($font, $size) {
    $text = "Página $pageNum de $pageCount";
    $width = $fontMetrics->getTextWidth($text, $font, $size);
    $x = ($canvas->get_width() - $width) / 2;
    $y = $canvas->get_height() - 28;
    $canvas->text($x, $y, $text, $font, $size);
});

$dompdf->stream("socios_listado.pdf", ["Attachment" => false]);
exit;
