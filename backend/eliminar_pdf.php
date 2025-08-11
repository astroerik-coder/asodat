<?php
include("conexion.php");
$cedula = $_GET['cedula'] ?? '';

if ($cedula) {
    $query = $conn->prepare("SELECT documento_pdf FROM socios WHERE cedula = ?");
    $query->bind_param("s", $cedula);
    $query->execute();
    $result = $query->get_result();
    $data = $result->fetch_assoc();

    if ($data && file_exists($data['documento_pdf'])) {
        unlink($data['documento_pdf']); // Elimina el archivo del servidor
    }

    // Limpia el campo en la base
    $conn->query("UPDATE socios SET documento_pdf = NULL WHERE cedula = '$cedula'");
}

header("Location: editar_socio.php?buscar_cedula=$cedula");
exit;
