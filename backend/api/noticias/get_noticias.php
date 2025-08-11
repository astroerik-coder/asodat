<?php
// Parámetros de consulta
$buscar = isset($_GET['buscar']) ? trim($_GET['buscar']) : '';
$categoria = isset($_GET['categoria']) ? trim($_GET['categoria']) : '';
$pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
$limite = isset($_GET['limite']) ? (int)$_GET['limite'] : 10;
$offset = ($pagina - 1) * $limite;

// Construir consulta con prepared statements
$condicion = '';
$params = [];
$types = '';

if ($buscar) {
    $condicion = "WHERE titulo LIKE ? OR contenido LIKE ?";
    $buscar_param = "%$buscar%";
    $params = [$buscar_param, $buscar_param];
    $types = 'ss';
}

if ($categoria) {
    if ($condicion) {
        $condicion .= " AND categoria = ?";
    } else {
        $condicion = "WHERE categoria = ?";
    }
    $params[] = $categoria;
    $types .= 's';
}

// Contar total de noticias
$sql_total = "SELECT COUNT(*) as total FROM noticias $condicion";
if ($params) {
    $stmt_total = $conn->prepare($sql_total);
    $stmt_total->bind_param($types, ...$params);
    $stmt_total->execute();
    $total_resultado = $stmt_total->get_result()->fetch_assoc();
    $stmt_total->close();
} else {
    $total_resultado = $conn->query($sql_total)->fetch_assoc();
}

$total_noticias = $total_resultado['total'];
$total_paginas = ceil($total_noticias / $limite);

// Obtener noticias
$sql = "SELECT * FROM noticias $condicion ORDER BY fecha_publicacion DESC LIMIT ? OFFSET ?";
$params[] = $limite;
$params[] = $offset;
$types .= 'ii';

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$noticias = [];
while ($row = $result->fetch_assoc()) {
    $noticias[] = [
        'id' => $row['id'],
        'titulo' => $row['titulo'],
        'contenido' => $row['contenido'],
        'categoria' => $row['categoria'],
        'fecha_publicacion' => $row['fecha_publicacion'],
        'autor' => $row['autor'],
        'imagen' => $row['imagen'],
        'estado' => $row['estado']
    ];
}

$stmt->close();

echo json_encode([
    'status' => 'success',
    'data' => [
        'noticias' => $noticias,
        'paginacion' => [
            'pagina_actual' => $pagina,
            'total_paginas' => $total_paginas,
            'total_noticias' => $total_noticias,
            'limite' => $limite
        ],
        'filtros' => [
            'buscar' => $buscar,
            'categoria' => $categoria
        ]
    ]
]);
?>
