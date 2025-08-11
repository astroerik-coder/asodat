<?php
// Obtener datos del POST
$input = json_decode(file_get_contents('php://input'), true);

// Validar campos requeridos
$campos_requeridos = ['cedula', 'monto', 'tipo_aporte'];
foreach ($campos_requeridos as $campo) {
    if (!isset($input[$campo]) || empty(trim($input[$campo]))) {
        http_response_code(400);
        echo json_encode(['error' => "El campo '$campo' es requerido"]);
        exit();
    }
}

$cedula = trim($input['cedula']);
$monto = (float)$input['monto'];
$tipo_aporte = trim($input['tipo_aporte']);
$fecha = isset($input['fecha']) ? $input['fecha'] : date('Y-m-d');
$descripcion = isset($input['descripcion']) ? trim($input['descripcion']) : '';
$estado = isset($input['estado']) ? $input['estado'] : 'pendiente';

// Validar formato de cédula (10 dígitos)
if (!preg_match('/^\d{10}$/', $cedula)) {
    http_response_code(400);
    echo json_encode(['error' => 'La cédula debe tener 10 dígitos']);
    exit();
}

// Validar monto
if ($monto <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'El monto debe ser mayor a 0']);
    exit();
}

// Validar tipo de aporte
$tipos_validos = ['mensual', 'extraordinario', 'donacion', 'otro'];
if (!in_array($tipo_aporte, $tipos_validos)) {
    http_response_code(400);
    echo json_encode(['error' => 'Tipo de aporte inválido']);
    exit();
}

// Verificar si el socio existe
$sql_check = "SELECT id, apellidos_nombres FROM socios WHERE cedula = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $cedula);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'No se encontró un socio con esa cédula']);
    $stmt_check->close();
    exit();
}

$socio = $result_check->fetch_assoc();
$stmt_check->close();

// Insertar nuevo aporte
$sql = "INSERT INTO aportes (cedula, monto, fecha, tipo_aporte, descripcion, estado) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sdsss", $cedula, $monto, $fecha, $tipo_aporte, $descripcion, $estado);

if ($stmt->execute()) {
    $nuevo_id = $conn->insert_id;
    
    echo json_encode([
        'status' => 'success',
        'mensaje' => 'Aporte registrado exitosamente',
        'data' => [
            'id' => $nuevo_id,
            'cedula' => $cedula,
            'nombre_socio' => $socio['apellidos_nombres'],
            'monto' => $monto,
            'fecha' => $fecha,
            'tipo_aporte' => $tipo_aporte,
            'descripcion' => $descripcion,
            'estado' => $estado
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al registrar el aporte: ' . $stmt->error]);
}

$stmt->close();
?>
