<?php
// Obtener datos del POST
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['cedula']) || !isset($input['contrasena'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Cédula y contraseña son requeridos']);
    exit();
}

$cedula = $input['cedula'];
$contrasena = $input['contrasena'];

// Validar credenciales
$sql = "SELECT * FROM iniciosesion WHERE cedula = ? AND contrasena = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $cedula, $contrasena);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    // Obtener datos del socio
    $sql_socios = "SELECT * FROM socios WHERE cedula = ?";
    $stmt_socios = $conn->prepare($sql_socios);
    $stmt_socios->bind_param("s", $cedula);
    $stmt_socios->execute();
    $socios = $stmt_socios->get_result();

    if ($socios->num_rows > 0) {
        $datos = $socios->fetch_assoc();
        
        // Generar token JWT simple (en producción usar una librería JWT)
        $token = base64_encode(json_encode([
            'cedula' => $cedula,
            'rol' => $datos['rol'],
            'exp' => time() + (60 * 60 * 24) // 24 horas
        ]));

        echo json_encode([
            'status' => 'success',
            'mensaje' => 'Login exitoso',
            'data' => [
                'cedula' => $cedula,
                'nombre_completo' => $datos['apellidos_nombres'],
                'rol' => $datos['rol'],
                'token' => $token
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'mensaje' => 'Cédula válida pero sin datos de socio'
        ]);
    }
} else {
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'mensaje' => 'Cédula o contraseña incorrecta'
    ]);
}

$stmt->close();
?>
