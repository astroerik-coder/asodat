<?php
require_once __DIR__ . '/../dompdf/autoload.inc.php';

use Dompdf\Dompdf;

include __DIR__ . '/../conexion.php';

$inicio = $_POST['fecha_inicio'] ?? '';
$fin = $_POST['fecha_fin'] ?? '';

if (!$inicio || !$fin || $inicio > $fin) {
    die("Rango de fechas inválido.");
}

// CONSULTA DE TOTALES
$query = "
    SELECT COUNT(s.cedula) AS total_personas, 
           SUM(a.nuevos_ingresos) AS total_ingresos
    FROM socios s
    JOIN aportes a ON s.cedula = a.cedula
    WHERE s.fecha_afiliacion BETWEEN '$inicio' AND '$fin'
";
$res = mysqli_query($conn, $query);
$data = mysqli_fetch_assoc($res);

// CONSULTA DE LISTADO DE SOCIOS NUEVOS
$lista_socios = [];
$sql_socios = "
    SELECT s.cedula, s.apellidos_nombres
    FROM socios s
    JOIN aportes a ON s.cedula = a.cedula
    WHERE s.fecha_afiliacion BETWEEN '$inicio' AND '$fin'
";
$res_lista = mysqli_query($conn, $sql_socios);
while ($row = mysqli_fetch_assoc($res_lista)) {
    $lista_socios[] = $row;
}

// INTENTAMOS CARGAR LOGO
$logoPath = __DIR__ . '/../img/Logo Asociación.jpeg';
$logoBase64 = file_exists($logoPath) ? base64_encode(file_get_contents($logoPath)) : '';

$fecha_actual = date("Y-m-d");

// HTML COMPLETO
$html = '
    <style>
        body { font-family: Arial, sans-serif; font-size: 13px; }
        h2 { text-align: center; color: #20859b; }
        h3 { margin-top: 20px; }
        .info { margin-top: 20px; }
        .info p { margin: 6px 0; }
        .logo { text-align: center; margin-bottom: 20px; }
        footer { margin-top: 40px; text-align: center; font-style: italic; font-size: 11px; color: #777; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        table, th, td { border: 1px solid #ccc; }
        th, td { padding: 8px; text-align: center; }
        th { background-color: #f2f2f2; }
    </style>

    <div class="logo">';

if ($logoBase64 !== '') {
    $html .= '<img src="data:image/jpeg;base64,' . $logoBase64 . '" height="70"><br>';
}

$html .= '<h2>ASODAT - Reporte de Nuevos Ingresos</h2>
    </div>

    <div class="info">
        <p><strong>Rango de fechas:</strong> ' . $inicio . ' hasta ' . $fin . '</p>
        <p><strong>Total de personas nuevas:</strong> ' . $data['total_personas'] . '</p>
        <p><strong>Total de nuevos ingresos:</strong> $' . number_format($data['total_ingresos'], 2) . '</p>
    </div>
';

if (count($lista_socios) > 0) {
    $html .= '
    <h3>Lista de Nuevos Socios</h3>
    <table>
        <thead>
            <tr>
                <th>Cédula</th>
                <th>Apellidos y Nombres</th>
            </tr>
        </thead>
        <tbody>';
    foreach ($lista_socios as $socio) {
        $html .= "<tr>
                    <td>{$socio['cedula']}</td>
                    <td>{$socio['apellidos_nombres']}</td>
                  </tr>";
    }
    $html .= '</tbody></table>';
} else {
    $html .= '<p style="margin-top: 20px;">No se encontraron nuevos socios en este rango.</p>';
}

// PIE DE PÁGINA
$html .= '<footer>Generado por ASODAT - ' . $fecha_actual . '</footer>';

// GENERAR PDF
$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream("reporte_nuevos_ingresos.pdf", ["Attachment" => true]);
exit;
