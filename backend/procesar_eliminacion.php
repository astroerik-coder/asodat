<?php
session_start();
include 'conexion.php';  // Asegúrate de incluir tu archivo de conexión a la base de datos

// Verifica que el usuario tiene el rol de tesorero
if (!isset($_SESSION['cedula']) || $_SESSION['rol'] !== 'tesorero') {
    header("Location: login.php");
    exit();
}

// Verificar si se ha recibido la cédula y el motivo
if (isset($_POST['cedula']) && isset($_POST['motivo'])) {
    $cedula = $_POST['cedula'];
    $motivo = $_POST['motivo'];
    $nombre_completo = $_POST['nombre_completo'];
    $fecha_afiliacion = $_POST['fecha_afiliacion'];

    // Insertar en el historial de eliminaciones
    $sql_historial = "INSERT INTO historial_eliminaciones (cedula, nombre_completo, fecha_afiliacion, motivo)
                      VALUES (?, ?, ?, ?)";
    $stmt_historial = $conn->prepare($sql_historial);
    $stmt_historial->bind_param("ssss", $cedula, $nombre_completo, $fecha_afiliacion, $motivo);

    if ($stmt_historial->execute()) {
        // Eliminar el socio de la tabla socios
        $sql_delete_socio = "DELETE FROM socios WHERE cedula = ?";
        $stmt_delete_socio = $conn->prepare($sql_delete_socio);
        $stmt_delete_socio->bind_param("s", $cedula);

        if ($stmt_delete_socio->execute()) {
            // Eliminar de tabla iniciosesion
            $sql_delete_iniciosesion = "DELETE FROM iniciosesion WHERE cedula = ?";
            $stmt_iniciosesion = $conn->prepare($sql_delete_iniciosesion);
            $stmt_iniciosesion->bind_param("s", $cedula);

            if ($stmt_iniciosesion->execute()) {
                // Eliminar de tabla aportes_socios
                $sql_delete_aportes = "DELETE FROM aportes WHERE cedula = ?";
                $stmt_aportes = $conn->prepare($sql_delete_aportes);
                $stmt_aportes->bind_param("s", $cedula);

                if ($stmt_aportes->execute()) {
                    $_SESSION['success_message'] = "Socio eliminado correctamente de todas las tablas.";
                    echo "<script>alert('✅ Socio eliminado correctamente.'); window.location.href = 'socios.php';</script>";
                    exit();
                } else {
                    echo "<script>alert('⚠️ Error al eliminar de aportes.'); window.location.href = 'socios.php';</script>";
                }
                $stmt_aportes->close();
            } else {
                echo "<script>alert('⚠️ Error al eliminar del sistema de inicio de sesión.'); window.location.href = 'socios.php';</script>";
            }
            $stmt_iniciosesion->close();
        } else {
            echo "<script>alert('⚠️ Error al eliminar el socio.'); window.location.href = 'socios.php';</script>";
        }
        $stmt_delete_socio->close();
    } else {
        echo "<script>alert('⚠️ Error al guardar en el historial de eliminaciones.'); window.location.href = 'socios.php';</script>";
    }

    $stmt_historial->close();
    $conn->close();
}
