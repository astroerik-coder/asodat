<?php
session_start();
require_once __DIR__ . '/../dompdf/autoload.inc.php';
include '../conexion.php';

use Dompdf\Dompdf;

if (!isset($_SESSION['comprobante'])) {
    die('No hay datos del comprobante');
}
extract($_SESSION['comprobante']); // nombre, cedula, tipo_usuario, meses[], total_pagado, cuota_ingreso

// Mapear meses
$mapa_meses = [
    'ene' => 'Enero',
    'feb' => 'Febrero',
    'mar' => 'Marzo',
    'abr' => 'Abril',
    'may' => 'Mayo',
    'jun' => 'Junio',
    'jul' => 'Julio',
    'ago' => 'Agosto',
    'sept' => 'Septiembre',
    'oct' => 'Octubre',
    'nov' => 'Noviembre',
    'dic' => 'Diciembre'
];

$meses_legibles = [];
foreach ($meses as $m) {
    $partes = explode('_', $m);

    if (count($partes) == 2) {
        // Tiene formato mes_año, solo usamos el nombre del mes
        $mes_nombre = $mapa_meses[$partes[0]] ?? ucfirst($partes[0]);
    } else {
        // Es un nombre completo como "marzo", "abril"
        $mes_nombre = $mapa_meses[$m] ?? ucfirst($m);
    }

    $meses_legibles[] = $mes_nombre;
}

// Consultar número de comprobante más reciente para esta cédula
$stmt = $conn->prepare("SELECT numero_comprobante FROM comprobantes_pago WHERE cedula = ? ORDER BY id DESC LIMIT 1");
$stmt->bind_param("s", $cedula);
$stmt->execute();
$stmt->bind_result($numero_comprobante);
$stmt->fetch();
$stmt->close();

// Preparar datos visuales
$fecha = date('d/m/Y');
$nombre_archivo = "comprobante_{$cedula}_" . date('Ymd') . ".pdf";
$logo_base64 = base64_encode(file_get_contents(__DIR__ . '/../img/Logo Asociación.jpeg'));

// Verificar si ya se pagó cuota de ingreso
$mostrar_cuota_ingreso = ($cuota_ingreso > 0);

// HTML del PDF
$html = "
<style>
    body { font-family: Arial, sans-serif; font-size: 12px; color: #333; }
    .header { text-align: center; }
    .logo { width: 90px; }
    .titulo { font-size: 18px; font-weight: bold; color: #0a4974; margin-bottom: 5px; }
    .info { margin: 8px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { border: 1px solid #999; padding: 6px 8px; text-align: left; }
    th { background-color: #f0f0f0; }
    .total { text-align: right; font-weight: bold; padding-top: 12px; }
</style>

<div class='header'>
    <img src='data:image/jpeg;base64,{$logo_base64}' class='logo'><br>
    <div class='titulo'>ASODAT - Comprobante de Aporte</div>
</div>

<div class='info'><strong>N° Comprobante:</strong> {$numero_comprobante}</div>
<div class='info'><strong>Nombre:</strong> {$nombre}</div>
<div class='info'><strong>Cédula:</strong> {$cedula}</div>
<div class='info'><strong>Tipo de Socio:</strong> " . ucfirst($tipo_usuario) . "</div>
<div class='info'><strong>Fecha de Emisión:</strong> {$fecha}</div>

<table>
    <tr><th>Concepto</th><th>Monto</th></tr>";
$mostrar_cuota_ingreso = ($cuota_ingreso > 0);

if ($mostrar_cuota_ingreso) {
    $html .= "<tr><td>Cuota de ingreso</td><td>$5.00</td></tr>";
}

foreach ($meses_legibles as $m) {
    $html .= "<tr><td>$m</td><td>$10.00</td></tr>";
}

$html .= "</table>
<div class='total'>Total pagado: $ " . number_format($total_pagado, 2) . "</div>
";

// Render PDF
$dompdf = new Dompdf();
$dompdf->loadHtml($html, 'UTF-8');
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
ob_end_clean();
$dompdf->stream($nombre_archivo, ['Attachment' => true]);

unset($_SESSION['comprobante']);
exit;
