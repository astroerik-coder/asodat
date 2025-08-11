<?php
session_start();

if (!isset($_SESSION['cedula']) || !in_array($_SESSION['rol'], ['tesorero', 'secretaria'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Nuevo Socio | ASODAT</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <style>
        /* Estilo para los mensajes */
        .message {
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 8px;
            text-align: center;
        }

        .success-message {
            background-color: #28a745;
            color: white;
        }

        .error-message {
            background-color: #dc3545;
            color: white;
        }

        /* Diseño y estilos del formulario */
        .form-nuevo-socio-grid {
            width: 100%;
            max-width: 720px;
            margin: 3rem auto;
            padding: 2rem 2.5rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
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

    <main class="contenedor-centro">
        <section class="form-nuevo-socio-grid">
            <h2>Registrar Nuevo Socio</h2>

            <form action="procesar_socio.php" method="POST" enctype="multipart/form-data" class="form-grid">
                <div class="form-group">
                    <!-- Cédula -->
                    <label for="cedula">Cédula:</label>
                    <input type="text" id="cedula" name="cedula" required><br>

                    <!-- Apellidos -->
                    <label for="apellidos">Apellidos:</label>
                    <input type="text" id="apellidos" name="apellidos" required><br>

                    <!-- Nombres -->
                    <label for="nombres">Nombres:</label>
                    <input type="text" id="nombres" name="nombres" required><br>

                    <!-- Cargo -->
                    <label for="cargo">Cargo:</label>
                    <input type="text" id="cargo" name="cargo"><br>

                    <!-- Teléfono -->
                    <label for="telefono">Teléfono:</label>
                    <input type="text" id="telefono" name="telefono"><br>

                    <!-- Dirección -->
                    <label for="direccion">Dirección:</label>
                    <input type="text" id="direccion" name="direccion"><br>

                    <!-- Campus -->
                    <label for="campus">Campus:</label>
                    <input type="text" id="campus" name="campus"><br>
                </div>

                <div class="form-group">

                    <label for="correo">Correo Electrónico:</label>
                    <input type="email" id="correo" name="correo" required><br>
                    
                    <!-- Fecha de afiliación -->
                    <label for="fecha">Fecha de afiliación:</label>
                    <input type="date" id="fecha" name="fecha" required><br>

                    <!-- Sector laboral -->
                    <label for="sector">Sector laboral:</label>
                    <select id="sector" name="sector" required>
                        <option value="">Seleccione una opción</option>
                        <option value="DOCENTE">DOCENTE</option>
                        <option value="TRABAJO PUBLICO">TRABAJO PUBLICO</option>
                        <option value="SERVIDOR PUBLICO">SERVIDOR PUBLICO</option>
                    </select><br>

                    <!-- Género -->
                    <label for="genero">Género:</label>
                    <select id="genero" name="genero" required>
                        <option value="">Seleccione</option>
                        <option value="MASCULINA">MASCULINO</option>
                        <option value="FEMENINO">FEMENINO</option>
                    </select><br>

                    <!-- Documento PDF -->
                    <label for="documento">Documento PDF:</label>
                    <input type="file" id="documento" name="documento" accept="application/pdf"><br>

                    <!-- Observaciones -->
                    <label for="observaciones">Observaciones:</label>
                    <textarea id="observaciones" name="observaciones"></textarea><br>
                </div>

                <!-- Botones -->
                <div class="botones">
                    <button type="submit">Guardar</button>
                    <a href="socios.php">Cancelar</a>
                </div>
            </form>
        </section>
    </main>
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