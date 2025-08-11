<?php
session_start();
if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'presidente') {
    header("Location: login.php");
    exit();
}

include 'conexion.php';

$id = $_GET['id'] ?? null;
if (!$id) {
    echo "ID inválido.";
    exit();
}

// Buscar noticia para eliminar imagen si existe
$sql = $conn->prepare("SELECT imagen FROM noticias WHERE id = ?");
$sql->bind_param("i", $id);
$sql->execute();
$resultado = $sql->get_result();

if ($resultado->num_rows === 0) {
    echo "Noticia no encontrada.";
    exit();
}

$noticia = $resultado->fetch_assoc();

// Eliminar archivo de imagen si existe físicamente
if (!empty($noticia['imagen']) && file_exists($noticia['imagen'])) {
    unlink($noticia['imagen']);
}

// Eliminar de la base de datos
$delete = $conn->prepare("DELETE FROM noticias WHERE id = ?");
$delete->bind_param("i", $id);
$delete->execute();

header("Location: noticias.php");
exit();