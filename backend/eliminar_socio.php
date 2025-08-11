<?php
session_start();
include 'conexion.php';  // Asegúrate de incluir tu archivo de conexión a la base de datos

// Verifica que el usuario tiene el rol de tesorero
if (!isset($_SESSION['cedula']) || !in_array($_SESSION['rol'], ['tesorero', 'secretaria'])) {
    header("Location: login.php");
    exit();
}

// Inicializamos la variable para los datos del socio
$socio = null;
$error_message = '';

// Verificar si se ha enviado la cédula para buscar los datos
if (isset($_GET['buscar_cedula'])) {
    $cedula_buscar = $_GET['buscar_cedula'];

    // Conectar a la base de datos
    $conn = new mysqli('localhost', 'root', '', 'asodat_db');

    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Buscar los datos del socio por cédula
    $sql = "SELECT * FROM socios WHERE cedula = '$cedula_buscar'";
    $result = $conn->query($sql);
    $socio = $result->fetch_assoc();

    if (!$socio) {
        $error_message = "No se encontró el socio con la cédula proporcionada.";
    }

    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Eliminar Socio | ASODAT</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
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

    <main class="contenedor-centro">
        <h2>Eliminar Socio</h2>

        <!-- Formulario para Buscar Socio por Cédula -->
        <form method="GET" class="form-group" style="margin-bottom: 2rem; max-width: 400px; margin-inline: auto;">
            <label for="buscar_cedula">Buscar por Cédula:</label>
            <input type="text" id="buscar_cedula" name="buscar_cedula" placeholder="Ingrese la cédula" value="<?= isset($cedula_buscar) ? $cedula_buscar : '' ?>" />
            <button type="submit" style="margin-top: 1rem; padding: 0.5rem 1rem;">Buscar</button>
        </form>

        <!-- Mostrar mensaje de error si no se encuentra el socio -->
        <?php if ($error_message): ?>
            <div class="error-message"><?= $error_message ?></div>
        <?php endif; ?>

        <!-- Mostrar los datos del socio si se encuentra -->
        <?php if ($socio && !$error_message): ?>
            <form class="form-nuevo-socio-grid" method="POST" action="procesar_eliminacion.php">
                <div class="form-group">
                    <label>Cédula:</label>
                    <input type="text" value="<?= $socio['cedula'] ?>" readonly>
                    <!-- Campo oculto para enviar la cédula -->
                    <input type="hidden" name="cedula" value="<?= $socio['cedula'] ?>">
                </div>

                <div class="form-group">
                    <label>Nombre Completo:</label>
                    <input type="text" value="<?= $socio['apellidos_nombres'] ?>" readonly>
                    <!-- Campo oculto para enviar el nombre completo -->
                    <input type="hidden" name="nombre_completo" value="<?= $socio['apellidos_nombres'] ?>">
                </div>

                <div class="form-group">
                    <label>Fecha de afiliación:</label>
                    <input type="text" value="<?= $socio['fecha_afiliacion'] ?>" readonly>
                    <!-- Campo oculto para enviar la fecha de afiliación -->
                    <input type="hidden" name="fecha_afiliacion" value="<?= $socio['fecha_afiliacion'] ?>">
                </div>

                <div class="form-group">
                    <label>Motivo de eliminación:</label>
                    <textarea name="motivo" placeholder="Describa el motivo..." required></textarea>
                </div>

                <div class="botones">
                    <button type="submit" class="btn-eliminar-final">Eliminar</button>
                    <a href="socios.php" class="cancelar">Cancelar</a>
                </div>
            </form>
        <?php endif; ?>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ASODAT - Asociación de Docentes, Personal Administrativo y Trabajadores de la ESPE sede Latacunga.</p>
        </div>
    </footer>

</body>
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

</html>