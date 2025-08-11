<?php
// Obtener datos del POST
$input = json_decode(file_get_contents('php://input'), true);

// Validar campos requeridos
$campos_requeridos = ['cedula', 'apellidos_nombres', 'telefono', 'email', 'rol'];
foreach ($campos_requeridos as $campo) {
    if (!isset($input[$campo]) || empty(trim($input[$campo]))) {
        http_response_code(400);
        echo json_encode(['error' => "El campo '$campo' es requerido"]);
        exit();
    }
}

$cedula = trim($input['cedula']);
$apellidos_nombres = trim($input['apellidos_nombres']);
$telefono = trim($input['telefono']);
$email = trim($input['email']);
$rol = trim($input['rol']);
$fecha_afiliacion = isset($input['fecha_afiliacion']) ? $input['fecha_afiliacion'] : date('Y-m-d');
$estado = isset($input['estado']) ? $input['estado'] : 'activo';

// Validar formato de cédula (10 dígitos)
if (!preg_match('/^\d{10}$/', $cedula)) {
    http_response_code(400);
    echo json_encode(['error' => 'La cédula debe tener 10 dígitos']);
    exit();
}

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato de email inválido']);
    exit();
}

// Validar rol
$roles_validos = ['socio', 'tesorero', 'secretaria', 'presidente'];
if (!in_array($rol, $roles_validos)) {
    http_response_code(400);
    echo json_encode(['error' => 'Rol inválido']);
    exit();
}

// Verificar si la cédula ya existe
$sql_check = "SELECT id FROM socios WHERE cedula = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $cedula);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'Ya existe un socio con esa cédula']);
    $stmt_check->close();
    exit();
}
$stmt_check->close();

// Insertar nuevo socio
$sql = "INSERT INTO socios (cedula, apellidos_nombres, telefono, email, rol, fecha_afiliacion, estado) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $cedula, $apellidos_nombres, $telefono, $email, $rol, $fecha_afiliacion, $estado);

if ($stmt->execute()) {
    $nuevo_id = $conn->insert_id;
    
    // Crear credenciales de acceso
    $contrasena_default = substr($cedula, -4); // Últimos 4 dígitos de la cédula
    $sql_credenciales = "INSERT INTO iniciosesion (cedula, contrasena) VALUES (?, ?)";
    $stmt_credenciales = $conn->prepare($sql_credenciales);
    $stmt_credenciales->bind_param("ss", $cedula, $contrasena_default);
    $stmt_credenciales->execute();
    $stmt_credenciales->close();
    
    echo json_encode([
        'status' => 'success',
        'mensaje' => 'Socio creado exitosamente',
        'data' => [
            'id' => $nuevo_id,
            'cedula' => $cedula,
            'apellidos_nombres' => $apellidos_nombres,
            'telefono' => $telefono,
            'email' => $email,
            'rol' => $rol,
            'fecha_afiliacion' => $fecha_afiliacion,
            'estado' => $estado,
            'contrasena_temporal' => $contrasena_default
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al crear el socio: ' . $stmt->error]);
}

$stmt->close();
?>
