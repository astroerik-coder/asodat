<?php
// Parámetros de consulta
$cedula = isset($_GET['cedula']) ? trim($_GET['cedula']) : '';
$fecha_inicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : '';
$fecha_fin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : '';
$pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
$limite = isset($_GET['limite']) ? (int)$_GET['limite'] : 25;
$offset = ($pagina - 1) * $limite;

// Construir consulta con prepared statements
$condicion = '';
$params = [];
$types = '';

if ($cedula) {
    $condicion = "WHERE a.cedula = ?";
    $params = [$cedula];
    $types = 's';
}

if ($fecha_inicio && $fecha_fin) {
    if ($condicion) {
        $condicion .= " AND a.fecha BETWEEN ? AND ?";
    } else {
        $condicion = "WHERE a.fecha BETWEEN ? AND ?";
    }
    $params[] = $fecha_inicio;
    $params[] = $fecha_fin;
    $types .= 'ss';
}

// Contar total de aportes
$sql_total = "SELECT COUNT(*) as total FROM aportes a $condicion";
if ($params) {
    $stmt_total = $conn->prepare($sql_total);
    $stmt_total->bind_param($types, ...$params);
    $stmt_total->execute();
    $total_resultado = $stmt_total->get_result()->fetch_assoc();
    $stmt_total->close();
} else {
    $total_resultado = $conn->query($sql_total)->fetch_assoc();
}

$total_aportes = $total_resultado['total'];
$total_paginas = ceil($total_aportes / $limite);

// Obtener aportes con información del socio
$sql = "SELECT a.*, s.apellidos_nombres 
        FROM aportes a 
        LEFT JOIN socios s ON a.cedula = s.cedula 
        $condicion 
        ORDER BY a.fecha DESC 
        LIMIT ? OFFSET ?";

$params[] = $limite;
$params[] = $offset;
$types .= 'ii';

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$aportes = [];
while ($row = $result->fetch_assoc()) {
    $aportes[] = [
        'id' => $row['id'],
        'cedula' => $row['cedula'],
        'nombre_socio' => $row['apellidos_nombres'],
        'monto' => $row['monto'],
        'fecha' => $row['fecha'],
        'tipo_aporte' => $row['tipo_aporte'],
        'descripcion' => $row['descripcion'],
        'estado' => $row['estado']
    ];
}

$stmt->close();

echo json_encode([
    'status' => 'success',
    'data' => [
        'aportes' => $aportes,
        'paginacion' => [
            'pagina_actual' => $pagina,
            'total_paginas' => $total_paginas,
            'total_aportes' => $total_aportes,
            'limite' => $limite
        ],
        'filtros' => [
            'cedula' => $cedula,
            'fecha_inicio' => $fecha_inicio,
            'fecha_fin' => $fecha_fin
        ]
    ]
]);
?>
