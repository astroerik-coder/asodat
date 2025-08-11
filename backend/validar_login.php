<?php
include 'conexion.php';
session_start();

$cedula = $_POST['cedula'];
$contrasena = $_POST['contrasena'];

$sql = "SELECT * FROM iniciosesion WHERE cedula = '$cedula' AND contrasena = '$contrasena'";
$resultado = $conn->query($sql);

$response = [];

if ($resultado->num_rows > 0) {
    $sql_socios = "SELECT * FROM socios WHERE cedula = '$cedula'";
    $socios = $conn->query($sql_socios);

    if ($socios->num_rows > 0) {
        $datos = $socios->fetch_assoc();

        $_SESSION['cedula'] = $cedula;
        $_SESSION['nombre_completo'] = $datos['apellidos_nombres'];
        $_SESSION['rol'] = $datos['rol']; 

        $response['status'] = 'success';
        $response['mensaje'] = $_SESSION['rol'];
    } else {
        $response['status'] = 'error';
        $response['mensaje'] = 'Cédula válida pero sin datos de socio.';
    }

} else {
    $response['status'] = 'error';
    $response['mensaje'] = '❌ Cédula o contraseña incorrecta';
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>
