<?php
require_once __DIR__ . '/../dompdf/autoload.inc.php';

use Dompdf\Dompdf;

include __DIR__ . '/../conexion.php';

$cedula = $_POST['cedula'] ?? '';
$inicio = $_POST['mes_inicio'] ?? '';
$fin = $_POST['mes_fin'] ?? '';

$meses = ['dic_aa', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre'];

$inicioIdx = array_search($inicio, $meses);
$finIdx = array_search($fin, $meses);

if (!$cedula || $inicioIdx === false || $finIdx === false || $inicioIdx > $finIdx) {
    die("Datos inválidos.");
}

$res = mysqli_query($conn, "SELECT * FROM aportes WHERE cedula = '$cedula'");
$fila = mysqli_fetch_assoc($res);
if (!$fila) {
    die("Cédula no encontrada.");
}

// Logo
$logoPath = __DIR__ . '/../img/Logo Asociación.jpeg';
$logoBase64 = file_exists($logoPath) ? base64_encode(file_get_contents($logoPath)) : '';
$fecha_actual = date("Y-m-d");

// Tabla de aportes
$total = 0;
$tabla = '<table width="100%" border="1" cellspacing="0" cellpadding="5">
            <thead>
                <tr><th>Mes</th><th>Aporte</th></tr>
            </thead><tbody>';
$mesNombres = [
    'dic_aa' => 'Diciembre AA',
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

for ($i = $inicioIdx; $i <= $finIdx; $i++) {
    $mes = $meses[$i];
    $valor = $fila[$mes] ?? 0;
    $nombreMes = $mesNombres[$mes] ?? $mes;

    if ($valor > 0) {
        $tabla .= "<tr><td>$nombreMes</td><td>$" . number_format($valor, 2) . "</td></tr>";
        $total += $valor;
    }
}
$tabla .= "<tr><th>Total</th><th>$" . number_format($total, 2) . "</th></tr></tbody></table>";

// HTML
$html = '
<style>
    body { font-family: Arial, sans-serif; font-size: 13px; }
    h2 { text-align: center; color: #20859b; }
    .info p { margin: 5px 0; }
    table, th, td { border: 1px solid #ccc; border-collapse: collapse; }
    th, td { padding: 8px; text-align: center; }
    th { background-color: #f2f2f2; }
    footer { margin-top: 30px; text-align: center; font-size: 11px; font-style: italic; color: #777; }
</style>

<div style="text-align: center; margin-bottom: 15px;">';
if ($logoBase64 !== '') {
    $html .= '<img src="data:image/jpeg;base64,' . $logoBase64 . '" height="70"><br>';
}
$html .= '<h2>ASODAT - Reporte de Aportes Individuales</h2></div>

<div class="info">
    <p><strong>Cédula:</strong> ' . $fila['cedula'] . '</p>
    <p><strong>Nombre:</strong> ' . $fila['apellidos_y_nombres'] . '</p>
    <p><strong>Rango de meses:</strong> ' . $inicio . ' a ' . $fin . '</p>
</div>

' . $tabla . '

<footer>Generado por ASODAT - ' . $fecha_actual . '</footer>
';

// Generar PDF
$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream("aporte_individual_$cedula.pdf", ["Attachment" => true]);
exit;
