<?php
session_start();
include 'conexion.php'; // Asegúrate de incluir tu conexión a la base de datos

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Obtener los valores del formulario
    $cedula = $_POST['cedula'];
    $apellidos = $_POST['apellidos'];
    $nombres = $_POST['nombres'];
    $cargo = $_POST['cargo'];
    $telefono = $_POST['telefono'];
    $direccion = $_POST['direccion'];
    $campus = $_POST['campus'];
    $fecha = $_POST['fecha'];
    $sector = $_POST['sector'];
    $genero = $_POST['genero'];
    $observaciones = $_POST['observaciones'];
    $correo = $_POST['correo'];  // Obtener el correo

    // Subir el archivo PDF si se ha seleccionado
    $documento = null;
    if (isset($_FILES['documento']) && $_FILES['documento']['error'] == 0) {
        $documento = 'uploads/' . basename($_FILES['documento']['name']);
        move_uploaded_file($_FILES['documento']['tmp_name'], $documento);
    }

    // Realizar la conexión a la base de datos
    $conn = new mysqli('localhost', 'root', '', 'asodat_db');  // Asegúrate de cambiar 'asodat_db' al nombre correcto de tu base de datos

    // Verificar si la conexión fue exitosa
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Verificar si la cédula ya existe en la base de datos
    $check_cedula = "SELECT * FROM socios WHERE cedula = '$cedula'";
    $result = $conn->query($check_cedula);

    if ($result->num_rows > 0) {
        echo "<script>
            alert('La cédula $cedula ya está registrada.');
            window.location.href = 'nuevo_socio.php';
        </script>";
        exit();
    }

    // Preparar la consulta SQL para insertar los datos en la tabla socios, incluyendo el correo
    $sql = "INSERT INTO socios (cedula, apellidos_nombres, cargo, celular, direccion, campus, fecha_afiliacion, regimen, genero, documento_pdf, observaciones, correo, rol, tipo_usuario)
        VALUES ('$cedula', '$apellidos $nombres', '$cargo', '$telefono', '$direccion', '$campus', '$fecha', '$sector', '$genero', '$documento', '$observaciones', '$correo', 'socio', 'nuevo')";

    if ($conn->query($sql) === TRUE) {

        // 🔽 INSERTAR EN aportes_socios
        $nombre_completo = "$apellidos $nombres";
        $sql_aportes = "INSERT INTO aportes (cedula, apellidos_y_nombres) 
                    VALUES ('$cedula', '$nombre_completo')";
        $conn->query($sql_aportes);

        // 🔽 INSERTAR EN iniciosesion
        $sql_iniciosesion = "INSERT INTO iniciosesion (cedula, contrasena)
                         VALUES ('$cedula', '$campus')";

        if ($conn->query($sql_iniciosesion) === TRUE) {
            echo "<script>
        alert('Nuevo socio registrado correctamente.');
        window.location.href = 'socios.php';
    </script>";
            exit();
        } else {
            $_SESSION['error_message'] = "Error al registrar en iniciosesion: " . $conn->error;
            header("Location: nuevo_socio.php");
            exit();
        }
    }

    // Cerrar la conexión
    $conn->close();
}
?>
