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

// Obtener noticia existente
$sql = $conn->prepare("SELECT * FROM noticias WHERE id = ?");
$sql->bind_param("i", $id);
$sql->execute();
$resultado = $sql->get_result();

if ($resultado->num_rows === 0) {
    echo "Noticia no encontrada.";
    exit();
}

$noticia = $resultado->fetch_assoc();

// Procesar formulario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titulo = $_POST['titulo'];
    $contenido = $_POST['contenido'];
    $categoria = $_POST['categoria'];
    $rutaImagen = $noticia['imagen']; // usar la imagen actual por defecto

    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
        $nombreArchivo = basename($_FILES['imagen']['name']);
        $rutaDestino = "img/" . $nombreArchivo;
        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
            $rutaImagen = $rutaDestino;
        }
    }

    $update = $conn->prepare("UPDATE noticias SET titulo = ?, contenido = ?, categoria = ?, imagen = ? WHERE id = ?");
    $update->bind_param("ssssi", $titulo, $contenido, $categoria, $rutaImagen, $id);
    $update->execute();

    header("Location: noticias.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Noticias | ASODAT</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <script src="https://kit.fontawesome.com/a2e0e9f6e4.js" crossorigin="anonymous"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <style>
        .footer {
            background-color: #20859b;
            padding: 1rem 1rem;
            text-align: center;
            font-size: 0.8rem;
            color: #fff;
        }

        .footer .container {
            max-width: 1200px;
            margin: auto;
        }

        .btn-agregar-noticia {
            display: inline-block;
            margin: 10px 0 20px 0;
            padding: 10px 20px;
            background-color: #20859b;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
        }

        form {
            max-width: 600px;
            margin: auto;
            background: #f5f5f5;
            padding: 20px;
            border-radius: 10px;
        }

        form label {
            display: block;
            margin-top: 10px;
            font-weight: bold;
        }

        form input[type="text"],
        form textarea,
        form select {
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }

        form input[type="file"] {
            margin-top: 5px;
        }

        form button {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #20859b;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        form button:hover {
            background-color: #186e81;
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

    <div class="container">
        <h2>Editar Noticia</h2>
        <form method="POST" enctype="multipart/form-data">
            <label for="titulo">Título:</label>
            <input type="text" name="titulo" id="titulo" value="<?= htmlspecialchars($noticia['titulo']) ?>" required>

            <label for="contenido">Contenido:</label>
            <textarea name="contenido" id="contenido" rows="5" required><?= htmlspecialchars($noticia['contenido']) ?></textarea>

            <label for="categoria">Categoría:</label>
            <select name="categoria" id="categoria" required>
                <option value="eventos" <?= $noticia['categoria'] == 'eventos' ? 'selected' : '' ?>>Eventos</option>
                <option value="comunicados" <?= $noticia['categoria'] == 'comunicados' ? 'selected' : '' ?>>Comunicados</option>
                <option value="asamblea" <?= $noticia['categoria'] == 'asamblea' ? 'selected' : '' ?>>Asambleas</option>
            </select>

            <label for="imagen">Imagen:</label>
            <input type="file" name="imagen" id="imagen" accept="image/*">
            <small>Imagen actual: <?= htmlspecialchars($noticia['imagen']) ?></small>

            <button type="submit">Actualizar Noticia</button>
        </form>
    </div>
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ASODAT - Asociación de Docentes, Personal Administrativo y Trabajadores de la ESPE sede
                Latacunga.</p>
        </div>
    </footer>
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


</body>

</html>