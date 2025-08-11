<?php
session_start();
if (!isset($_SESSION['cedula'])) {
    header("Location: login.php");
    exit();
}

include("conexion.php");
$cedula = $_SESSION['cedula'];
$mensaje = "";

// Obtener datos actuales
$sql = "SELECT * FROM socios WHERE cedula = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $cedula);
$stmt->execute();
$result = $stmt->get_result();
$datos = $result->fetch_assoc();

// Eliminar PDF
if (isset($_GET['eliminar_pdf']) && file_exists($datos['documento_pdf'])) {
    unlink($datos['documento_pdf']);
    $conn->query("UPDATE socios SET documento_pdf = NULL WHERE cedula = '$cedula'");
    $datos['documento_pdf'] = null;
    $mensaje = "📁 Documento eliminado correctamente.";
}

// Guardar cambios
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $apellidos_nombres = $_POST['apellidos_nombres'];
    $campus = $_POST['campus'];
    $genero = $_POST['genero'];
    $regimen = $_POST['regimen'];
    $celular = $_POST['celular'];
    $cargo = $_POST['cargo'];
    $direccion = $_POST['direccion'];
    $fecha_afiliacion = $_POST['fecha_afiliacion'];
    $correo = $_POST['correo'];

    $documento_pdf = $datos['documento_pdf'];
    if (isset($_FILES['documento_pdf']) && $_FILES['documento_pdf']['error'] == UPLOAD_ERR_OK) {
        $nombrePDF = "uploads/" . uniqid() . "_" . basename($_FILES["documento_pdf"]["name"]);
        move_uploaded_file($_FILES["documento_pdf"]["tmp_name"], $nombrePDF);
        $documento_pdf = $nombrePDF;
    }

    $update = $conn->prepare("UPDATE socios SET apellidos_nombres = ?, campus = ?, genero = ?, regimen = ?, celular = ?, cargo = ?, direccion = ?, fecha_afiliacion = ?, documento_pdf = ?, correo = ? WHERE cedula = ?");
    $update->bind_param("sssssssssss", $apellidos_nombres, $campus, $genero, $regimen, $celular, $cargo, $direccion, $fecha_afiliacion, $documento_pdf, $correo, $cedula);

    if ($update->execute()) {
        echo "<script>alert('✅ Datos actualizados correctamente.'); window.location.href='datos.php';</script>";
        exit;
    } else {
        $mensaje = "❌ Error al actualizar los datos.";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<link rel="stylesheet" href="styles.css" />
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

<head>
    <meta charset="UTF-8">
    <title>Actualizar Datos</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f2f9ff;
            margin: 0;
            padding: 0;
        }

        .contenedor {
            max-width: 800px;
            margin: 50px auto;
            background-color: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }

        h2 {
            text-align: center;
            color: #007bff;
        }

        label {
            font-weight: bold;
            margin-top: 15px;
            display: block;
        }

        input[type="text"],
        input[type="email"],
        input[type="date"],
        select {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 6px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-boton {
            text-align: center;
            margin-top: 30px;
        }

        .form-boton input {
            background-color: #28a745;
            color: white;
            padding: 12px 28px;
            border: none;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
        }

        .form-boton input:hover {
            background-color: #218838;
        }

        .mensaje {
            text-align: center;
            margin-bottom: 20px;
            font-weight: bold;
            color: #007bff;
        }

        .pdf-opciones {
            margin-top: 10px;
        }

        .pdf-opciones a {
            margin-right: 10px;
            text-decoration: none;
            color: #007bff;
            font-weight: bold;
        }

        .pdf-opciones a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <header class="header">
        <div class="container">
            <div class="logo-section">
                <a href="index.php">
                    <img src="img/Logo Asociación.jpeg" alt="Logo ASODAT" class="logo-img">
                </a>
                <h1 class="logo">ASODAT</h1>
            </div>
            <nav class="nav">
                <a href="index.php">Inicio</a>
                <a href="servicios.php">Servicios</a>
                <a href="afiliacion.php">Afiliación</a>
                <a href="noticias.php">Noticias</a>


                <?php if (isset($_SESSION['cedula'])): ?>

                    <div class="dropdown">
                        <button class="dropbtn">
                            <?= $_SESSION['nombre_completo'] ?>
                            <span class="flecha">▼</span>
                        </button>
                        <div class="dropdown-content">
                            

                            <?php if (in_array($_SESSION['rol'], ['socio', 'tesorero', 'secretaria'])): ?>
                                <a href="datos.php">Datos</a>
                                <a href="historial_aportes.php">Mis Aportes</a>
                            <?php endif; ?>

                            <?php if ($_SESSION['rol'] === 'tesorero' || $_SESSION['rol'] === 'secretaria'): ?>
                                <a href="socios.php">Socios</a>
                            <?php endif; ?>

                            <?php if ($_SESSION['rol'] === 'tesorero'): ?>
                                <a href="aportes.php">Aportes</a>
                                <a href="reportes.php">Reportes</a>
                                <a href="aportes_socios.php">Aportes Socios</a>
                            <?php endif; ?>

                            <a href="logout.php">Cerrar sesión</a>
                        </div>
                    </div>
                <?php else: ?>
                    <a class="activo" href="login.php">Login</a>
                <?php endif; ?>
        </div>
    </header>

    <div class="contenedor">
        <h2>Actualizar Información Personal</h2>

        <?php if ($mensaje): ?>
            <div class="mensaje"><?= $mensaje ?></div>
        <?php endif; ?>

        <form method="POST" enctype="multipart/form-data">
            <div class="form-group">
                <label>Cédula</label>
                <input type="text" name="cedula" value="<?= htmlspecialchars($cedula) ?>" readonly>
            </div>

            <div class="form-group">
                <label>Apellidos y Nombres</label>
                <input type="text" name="apellidos_nombres" value="<?= htmlspecialchars($datos['apellidos_nombres']) ?>" required>
            </div>

            <div class="form-group">
                <label>Correo</label>
                <input type="email" name="correo" value="<?= htmlspecialchars($datos['correo']) ?>" required>
            </div>

            <div class="form-group">
                <label>Celular</label>
                <input type="text" name="celular" value="<?= htmlspecialchars($datos['celular']) ?>" required>
            </div>

            <div class="form-group">
                <label>Dirección</label>
                <input type="text" name="direccion" value="<?= htmlspecialchars($datos['direccion']) ?>" required>
            </div>

            <div class="form-group">
                <label>Campus</label>
                <input type="text" name="campus" value="<?= htmlspecialchars($datos['campus']) ?>" required>
            </div>

            <div class="form-group">
                <label>Género</label>
                <select name="genero" required>
                    <option value="M" <?= $datos['genero'] == 'M' ? 'selected' : '' ?>>Masculino</option>
                    <option value="F" <?= $datos['genero'] == 'F' ? 'selected' : '' ?>>Femenino</option>
                </select>
            </div>

            <div class="form-group">
                <label>Régimen</label>
                <select name="regimen" required>
                    <option value="DOCENTE" <?= $datos['regimen'] == 'DOCENTE' ? 'selected' : '' ?>>Docente</option>
                    <option value="TRABAJADOR PUBLICO" <?= $datos['regimen'] == 'TRABAJADOR PUBLICO' ? 'selected' : '' ?>>Trabajador Público</option>
                    <option value="SERVIDOR PUBLICO" <?= $datos['regimen'] == 'SERVIDOR PUBLICO' ? 'selected' : '' ?>>Servidor Público</option>
                </select>
            </div>

            <div class="form-group">
                <label>Cargo</label>
                <input type="text" name="cargo" value="<?= htmlspecialchars($datos['cargo']) ?>" required>
            </div>

            <div class="form-group">
                <label>Fecha de Afiliación</label>
                <input type="date" name="fecha_afiliacion" value="<?= htmlspecialchars($datos['fecha_afiliacion']) ?>" required>
            </div>

            <div class="form-group">
                <label>Documento PDF</label>

                <?php if (!empty($datos['documento_pdf']) && file_exists($datos['documento_pdf'])): ?>
                    <div class="pdf-opciones">
                        <a href="<?= $datos['documento_pdf'] ?>" target="_blank">📄 Ver documento actual</a>
                        <a href="pagina_actualizacion.php?eliminar_pdf=1" style="color: red;">🗑️ Eliminar documento</a>
                    </div><br>
                <?php endif; ?>

                <!-- Enlace de descarga que siempre se muestra -->
                <div class="pdf-opciones">
                    <a href="files/Solicitud de Afiliación.pdf" download style="color: green; font-weight: bold;">
                        ⬇️ Descargar Solicitud de Afiliación (PDF)
                    </a>
                    <p style="font-size: 0.9rem; color: #555; margin-top: 4px;">
                        Descarga este documento, complétalo y súbelo en el campo inferior para tu afiliación.
                    </p>
                </div><br>

                <input type="file" name="documento_pdf" accept="application/pdf">
            </div>

            <div class="form-boton">
                <input type="submit" value="Guardar Cambios">
            </div>
            <div class="form-boton" style="margin-top: 15px;">
                <div class="form-boton" style="margin-top: 15px;">
                    <a href="datos.php" style="
                        background-color: #6c757d;
                        color: white;
                        padding: 10px 24px;
                        border-radius: 6px;
                        text-decoration: none;
                        font-weight: bold;
                        display: inline-block;
                    ">← Regresar</a>
                </div>

        </form>
    </div>

</body>

</html>

<script>
    const dropBtn = document.querySelector('.dropbtn');
    const dropdown = document.querySelector('.dropdown');

    if (dropBtn && dropdown) {
        dropBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        window.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });
    }
</script>