<?php
include("conexion.php");

$mensaje = "";
$cedula_buscar = $_GET['buscar_cedula'] ?? '';
$socio = null;

if ($cedula_buscar) {
  $stmt = $conn->prepare("SELECT * FROM socios WHERE cedula = ?");
  $stmt->bind_param("s", $cedula_buscar);
  $stmt->execute();
  $result = $stmt->get_result();
  $socio = $result->fetch_assoc();
}

// Mostrar alerta de eliminación si viene por GET
if (isset($_GET['pdf_eliminado']) && $_GET['pdf_eliminado'] == "1") {
  $mensaje = "📁 Documento eliminado correctamente.";
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
    html,
    body {
      height: 100%;
      margin: 0;
      display: flex;
      flex-direction: column;
    }

    main {
      flex: 1;
      padding: 2rem;
      background: #e3f2f9;
    }

    .footer {
      background-color: #20859b;
      padding: 1rem;
      text-align: center;
      font-size: 0.8rem;
      color: #fff;
    }

    .footer .container {
      max-width: 1200px;
      margin: auto;
    }

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
    textarea,
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

    .form-boton input,
    .form-boton a {
      background-color: #28a745;
      color: white;
      padding: 12px 28px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      margin: 0 10px;
    }

    .form-boton a {
      background-color: #6c757d;
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
      font-weight: bold;
    }

    .pdf-opciones a:first-child {
      color: #007bff;
    }

    .pdf-opciones a:last-child {
      color: red;
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

      <?php session_start(); ?>
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
  <main>
    <div class="contenedor">
      <h2>Editar Datos de Socio</h2>

      <?php if ($mensaje): ?>
        <div class="mensaje"><?= $mensaje ?></div>
      <?php endif; ?>

      <!-- Formulario de búsqueda -->
      <form method="GET" style="margin-bottom: 30px;">
        <label for="buscar_cedula">Buscar por Cédula:</label>
        <input type="text" id="buscar_cedula" name="buscar_cedula" placeholder="Ingrese la cédula" value="<?= htmlspecialchars($cedula_buscar) ?>" required>
        <div class="form-boton">
          <input type="submit" value="Buscar">
        </div>
      </form>

      <?php if ($socio): ?>
        <form method="POST" action="procesar_edicion.php" enctype="multipart/form-data">
          <div class="form-group">
            <label>Cédula</label>
            <input type="text" name="cedula" value="<?= $socio['cedula'] ?>" readonly>
          </div>
          <div class="form-group">
            <label>Apellidos y Nombres</label>
            <input type="text" name="apellidos_nombres" value="<?= $socio['apellidos_nombres'] ?>" required>
          </div>
          <div class="form-group">
            <label>Correo</label>
            <input type="email" name="correo" value="<?= $socio['correo'] ?>" required>
          </div>
          <div class="form-group">
            <label>Celular</label>
            <input type="text" name="celular" value="<?= $socio['celular'] ?>" required>
          </div>
          <div class="form-group">
            <label>Dirección</label>
            <input type="text" name="direccion" value="<?= $socio['direccion'] ?>" required>
          </div>
          <div class="form-group">
            <label>Campus</label>
            <input type="text" name="campus" value="<?= $socio['campus'] ?>" required>
          </div>
          <div class="form-group">
            <label>Género</label>
            <select name="genero" required>
              <option value="M" <?= $socio['genero'] == 'M' ? 'selected' : '' ?>>Masculino</option>
              <option value="F" <?= $socio['genero'] == 'F' ? 'selected' : '' ?>>Femenino</option>
            </select>
          </div>
          <div class="form-group">
            <label>Régimen</label>
            <input type="text" name="regimen" value="<?= $socio['regimen'] ?>" required>
          </div>
          <div class="form-group">
            <label>Cargo</label>
            <input type="text" name="cargo" value="<?= $socio['cargo'] ?>" required>
          </div>
          <div class="form-group">
            <label>Fecha de Afiliación</label>
            <input type="date" name="fecha_afiliacion" value="<?= $socio['fecha_afiliacion'] ?>" required>
          </div>
          <div class="form-group">
            <label>Observaciones</label>
            <textarea name="observaciones" rows="3"><?= htmlspecialchars($socio['observaciones']) ?></textarea>
          </div>

          <!-- Documento PDF -->
          <div class="form-group">
            <label>Documento PDF</label>
            <?php if (!empty($socio['documento_pdf']) && file_exists($socio['documento_pdf'])): ?>
              <div class="pdf-opciones">
                <a href="<?= $socio['documento_pdf'] ?>" target="_blank">📄 Ver documento actual</a>
                <a href="eliminar_pdf.php?cedula=<?= $socio['cedula'] ?>" onclick="return confirm('¿Eliminar el documento actual?')">🗑️ Eliminar documento</a>
              </div>
            <?php endif; ?>
            <input type="file" name="documento_pdf" accept="application/pdf">
          </div>

          <div class="form-boton">
            <input type="submit" value="Guardar Cambios">
            <a href="socios.php">← Regresar</a>
          </div>
        </form>
      <?php endif; ?>
    </div>
  </main>
  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 ASODAT - Asociación de Docentes, Personal Administrativo y Trabajadores de la ESPE sede
        Latacunga.</p>
    </div>
  </footer>
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