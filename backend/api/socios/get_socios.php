<?php
// Parámetros de consulta
$buscar = isset($_GET['buscar']) ? trim($_GET['buscar']) : '';
$pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
$limite = isset($_GET['limite']) ? (int)$_GET['limite'] : 25;
$offset = ($pagina - 1) * $limite;

// Construir consulta con prepared statements
$condicion = '';
$params = [];
$types = '';

if ($buscar) {
    $condicion = "WHERE cedula LIKE ? OR apellidos_nombres LIKE ? OR telefono LIKE ?";
    $buscar_param = "%$buscar%";
    $params = [$buscar_param, $buscar_param, $buscar_param];
    $types = 'sss';
}

// Contar total de socios
$sql_total = "SELECT COUNT(*) as total FROM socios $condicion";
if ($params) {
    $stmt_total = $conn->prepare($sql_total);
    $stmt_total->bind_param($types, ...$params);
    $stmt_total->execute();
    $total_resultado = $stmt_total->get_result()->fetch_assoc();
    $stmt_total->close();
} else {
    $total_resultado = $conn->query($sql_total)->fetch_assoc();
}

$total_socios = $total_resultado['total'];
$total_paginas = ceil($total_socios / $limite);

// Obtener socios
$sql = "SELECT * FROM socios $condicion ORDER BY apellidos_nombres ASC LIMIT ? OFFSET ?";
$params[] = $limite;
$params[] = $offset;
$types .= 'ii';

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$socios = [];
while ($row = $result->fetch_assoc()) {
    $socios[] = [
        'id' => $row['id'],
        'cedula' => $row['cedula'],
        'apellidos_nombres' => $row['apellidos_nombres'],
        'telefono' => $row['telefono'],
        'email' => $row['email'],
        'rol' => $row['rol'],
        'fecha_afiliacion' => $row['fecha_afiliacion'],
        'estado' => $row['estado']
    ];
}

$stmt->close();

echo json_encode([
    'status' => 'success',
    'data' => [
        'socios' => $socios,
        'paginacion' => [
            'pagina_actual' => $pagina,
            'total_paginas' => $total_paginas,
            'total_socios' => $total_socios,
            'limite' => $limite
        ]
    ]
]);
?>
