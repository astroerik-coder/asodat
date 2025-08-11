<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <title>Iniciar Sesión | ASODAT</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="styles.css" />
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

  <main class="login-page" style="background-color: #e3f2f9">
    <div class="login-box">
      <h2>Iniciar Sesión</h2>

      <form id="form-login" class="form-login" action="validar_login.php" method="post">
        <label for="cedula">Cédula</label>
        <input type="text" id="cedula" name="cedula" class="input-password" required />

        <label for="contrasena">Contraseña</label>
        <input type="password" id="contrasena" name="contrasena" class="input-password" required />

        <div class="mostrar-password">
          <input type="checkbox" id="ver-login" onclick="mostrarContrasena()" />
          <label for="ver-login">Mostrar contraseña</label>
        </div>

        <div id="login-exito" class="success-text" style="display: none;">
          <span class="spinner"></span>
          ✅ Bienvenido. Redirigiendo...
        </div>
        <div id="login-error" class="error-text" style="display: none; text-align: center; color: red; margin-top: 1rem;">
          La Cédula o contraseña son incorrectas
        </div>

        <button type="submit">Ingresar</button>

        <div class="forgot-password" style="text-align: center; margin-top: 1rem;">
          <a href="recuperar.php">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 ASODAT - Asociación de Docentes, Personal Administrativo y Trabajadores de la ESPE sede Latacunga.</p>
    </div>
  </footer>

  <script>
    function mostrarContrasena() {
      const input = document.getElementById("contrasena");
      input.type = input.type === "password" ? "text" : "password";
    }

    const form = document.getElementById("form-login");
    const cedula = document.getElementById("cedula");
    const contrasena = document.getElementById("contrasena");
    const errorDiv = document.getElementById("login-error");
    const successMsg = document.getElementById("login-exito");

    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const datos = new FormData(form);

      fetch("validar_login.php", {
          method: "POST",
          body: datos
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === "success") {
            errorDiv.style.display = "none";
            successMsg.style.display = "block";
            setTimeout(() => {
              window.location.href = "index.php";
            }, 2000);
          } else {
            successMsg.style.display = "none";
            errorDiv.style.display = "block";
            errorDiv.textContent = data.mensaje;
          }
        })
        .catch(error => {
          console.error("Error al enviar datos:", error);
        });
    });
  </script>
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