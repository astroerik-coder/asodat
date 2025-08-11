<?php
session_start();
require_once __DIR__ . '/../dompdf/autoload.inc.php';
include '../conexion.php';

use Dompdf\Dompdf;

$cedula = $_GET['cedula'] ?? null;
$numero_comprobante = $_GET['comprobante'] ?? null;

if (!$cedula || !$numero_comprobante) {
    die('Datos insuficientes');
}

// Consultar datos del comprobante
$stmt = $conn->prepare("SELECT * FROM comprobantes_pago WHERE cedula = ? AND numero_comprobante = ?");
$stmt->bind_param("si", $cedula, $numero_comprobante);
$stmt->execute();
$resultado = $stmt->get_result();
$comprobante = $resultado->fetch_assoc();
$stmt->close();

if (!$comprobante) {
    die('Comprobante no encontrado');
}

// Obtener nombre del socio
$stmtNombre = $conn->prepare("SELECT apellidos_nombres, tipo_usuario FROM socios WHERE cedula = ?");
$stmtNombre->bind_param("s", $cedula);
$stmtNombre->execute();
$stmtNombre->bind_result($nombre, $tipo_usuario);
$stmtNombre->fetch();
$stmtNombre->close();

$meses_v = array_filter(array_map('trim', explode(',', $comprobante['meses_vencidos'])));
$meses_a = array_filter(array_map('trim', explode(',', $comprobante['meses_adelantados'])));
$meses = array_merge($meses_v, $meses_a);

$total_pagado = $comprobante['total'];
$cuota_ingreso = $comprobante['ingreso'];

// Mapear meses abreviados
$mapa_meses = [
    'dic_aa' => 'Diciembre',
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

$meses_legibles = [];
foreach ($meses as $m) {
    $meses_legibles[] = $mapa_meses[$m] ?? ucfirst($m);
}

$fecha = date('d/m/Y');
$nombre_archivo = "comprobante_{$cedula}_{$numero_comprobante}.pdf";
$logo_base64 = base64_encode(file_get_contents(__DIR__ . '/../img/Logo Asociación.jpeg'));

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
<div class='info'><strong>Nº Comprobante:</strong> {$numero_comprobante}</div>
<div class='info'><strong>Nombre:</strong> {$nombre}</div>
<div class='info'><strong>Cédula:</strong> {$cedula}</div>
<div class='info'><strong>Tipo de Socio:</strong> " . ucfirst($tipo_usuario) . "</div>
<div class='info'><strong>Fecha de Emisión:</strong> {$fecha}</div>

<table>
    <tr><th>Concepto</th><th>Monto</th></tr>";

if ($cuota_ingreso > 0) {
    $html .= "<tr><td>Cuota de ingreso</td><td>$5.00</td></tr>";
}

foreach ($meses_legibles as $m) {
    $html .= "<tr><td>$m</td><td>$10.00</td></tr>";
}

$html .= "</table>
<div class='total'>Total pagado: $ " . number_format($total_pagado, 2) . "</div>
";

$dompdf = new Dompdf();
$dompdf->loadHtml($html, 'UTF-8');
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
ob_end_clean();
$dompdf->stream($nombre_archivo, ['Attachment' => true]);
exit;
