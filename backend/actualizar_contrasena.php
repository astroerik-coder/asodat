<?php
header('Content-Type: application/json');
include 'conexion.php';

$cedula = $_POST['cedula'] ?? '';
$nueva = $_POST['nueva'] ?? '';
$confirmar = $_POST['confirmar'] ?? '';

if (empty($cedula) || empty($nueva) || empty($confirmar)) {
    echo json_encode(['tipo' => 'error', 'mensaje' => 'Todos los campos son obligatorios.']);
    exit;
}

if ($nueva !== $confirmar) {
    echo json_encode(['tipo' => 'error', 'mensaje' => 'Las contraseñas no coinciden.']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM socios WHERE cedula = ?");
$stmt->bind_param("s", $cedula);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    echo json_encode(['tipo' => 'error', 'mensaje' => 'La cédula no existe en el sistema.']);
    exit;
}
$stmt->close();

$update = $conn->prepare("UPDATE iniciosesion SET contrasena = ? WHERE cedula = ?");
$update->bind_param("ss", $nueva, $cedula);

if ($update->execute()) {
    echo json_encode(['tipo' => 'exito', 'mensaje' => 'Contraseña actualizada correctamente.']);
} else {
    echo json_encode(['tipo' => 'error', 'mensaje' => 'Error al actualizar la contraseña.']);
}

$update->close();
