<?php
include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $cedula = $_POST['cedula'];
    $apellidos_nombres = $_POST['apellidos_nombres'];
    $correo = $_POST['correo'];
    $celular = $_POST['celular'];
    $direccion = $_POST['direccion'];
    $campus = $_POST['campus'];
    $genero = $_POST['genero'];
    $regimen = $_POST['regimen'];
    $cargo = $_POST['cargo'];
    $fecha_afiliacion = $_POST['fecha_afiliacion'];
    $observaciones = $_POST['observaciones'];

    // Buscar documento anterior
    $sql_doc = $conn->prepare("SELECT documento_pdf FROM socios WHERE cedula = ?");
    $sql_doc->bind_param("s", $cedula);
    $sql_doc->execute();
    $resultado = $sql_doc->get_result();
    $datos = $resultado->fetch_assoc();
    $documento_pdf = $datos['documento_pdf'];

    // Subida de nuevo PDF (si hay)
    if (isset($_FILES['documento_pdf']) && $_FILES['documento_pdf']['error'] == UPLOAD_ERR_OK) {
        $nombrePDF = "uploads/" . uniqid() . "_" . basename($_FILES["documento_pdf"]["name"]);
        move_uploaded_file($_FILES["documento_pdf"]["tmp_name"], $nombrePDF);
        $documento_pdf = $nombrePDF;
    }

    // Actualizar en base de datos
    $update = $conn->prepare("
        UPDATE socios SET 
            apellidos_nombres = ?, correo = ?, celular = ?, direccion = ?, 
            campus = ?, genero = ?, regimen = ?, cargo = ?, 
            fecha_afiliacion = ?, observaciones = ?, documento_pdf = ?
        WHERE cedula = ?
    ");

    $update->bind_param(
        "ssssssssssss",
        $apellidos_nombres,
        $correo,
        $celular,
        $direccion,
        $campus,
        $genero,
        $regimen,
        $cargo,
        $fecha_afiliacion,
        $observaciones,
        $documento_pdf,
        $cedula
    );

    if ($update->execute()) {
        echo "<script>alert('✅ Socio actualizado correctamente.'); window.location.href='socios.php?buscar_cedula=$cedula';</script>";
    } else {
        echo "<script>alert('❌ Error al actualizar.'); window.history.back();</script>";
    }
}
