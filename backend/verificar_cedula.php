<?php
header('Content-Type: application/json');
include 'conexion.php';

$cedula = $_POST['cedula'] ?? '';
$response = ['existe' => false];

if (!empty($cedula)) {
    $stmt = $conn->prepare("SELECT * FROM socios WHERE cedula = ?");
    $stmt->bind_param("s", $cedula);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $response['existe'] = true;
    }

    $stmt->close();
}

echo json_encode($response);
?>
