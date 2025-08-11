<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>Recuperar Contraseña | ASODAT</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="styles.css" />
    <style>
        body,
        html {
            height: 100%;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
        }

        main.login-page {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: start;
            min-height: 100vh;
            padding-top: 100px;
            padding-bottom: 5rem;
            background-color: #e4f4f6;
        }

        .login-box {
            background: #fff;
            padding: 2rem 2.5rem 2rem 2.5rem;
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
        }

        #btn-verificar {
            background-color: #178295;
            color: white;
            border: none;
            padding: 6px 16px;
            font-size: 14px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        #btn-verificar:hover {
            background-color: #0f6b7a;
        }

        .login-box button[type="submit"] {
            width: 60%;
            padding: 10px;
            font-size: 16px;
            background-color: #20859b;
            color: white;
            border: none;
            border-radius: 6px;
            margin: 1.2rem auto 0 auto;
            display: block;
            transition: background-color 0.3s ease;
        }

        .login-box button[type="submit"]:hover {
            background-color: #186c83;
        }

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

    <main class="login-page">
        <div class="login-box">
            <h2>Recuperar Contraseña</h2>
            <form id="formulario" class="form-login" action="actualizar_contrasena.php" method="post">
                <p>Ingresa tu cédula y tu nueva contraseña para actualizar tu cuenta.</p>

                <label for="cedula">Cédula</label>
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                    <input
                        type="text"
                        id="cedula"
                        name="cedula"
                        class="input-password"
                        required
                        placeholder="Ingresa tu cédula"
                        onkeydown="if(event.key === 'Enter'){ event.preventDefault(); verificarCedula(); }" />
                    <button
                        type="button"
                        onclick="verificarCedula()"
                        id="btn-verificar">
                        Verificar
                    </button>
                </div>

                <label for="nueva">Nueva contraseña</label>
                <input type="password" id="nueva" name="nueva" class="input-password" disabled required />

                <label for="confirmar">Confirmar contraseña</label>
                <input type="password" id="confirmar" name="confirmar" class="input-password" disabled required />

                <p id="mensaje-cedula" style="text-align: center; margin: 1rem 0; font-weight: bold;"></p>

                <p id="error" class="error-text" style="color:red; display:none; text-align:center; margin-top: 1rem;">
                    ⚠ Las contraseñas no coinciden.
                </p>

                <p id="respuesta-servidor" class="success-text" style="display:none; text-align:center; margin-top: 1rem;"></p>

                <div class="mostrar-password" style="margin: 1rem 0;">
                    <input type="checkbox" id="ver-passwords" onclick="mostrarContrasenas()" />
                    <label for="ver-passwords">Mostrar contraseñas</label>
                </div>

                <button type="submit">Actualizar contraseña</button>

                <div class="forgot-password" style="text-align: center; margin-top: 1rem;">
                    <a href="login.php">Volver al inicio de sesión</a>
                </div>
            </form>
        </div>
    </main>


    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ASODAT - Asociación de Docentes, Personal Administrativo y Trabajadores de la ESPE sede
                Latacunga.</p>
        </div>
    </footer>

    <script>
        function mostrarContrasenas() {
            const nueva = document.getElementById("nueva");
            const confirmar = document.getElementById("confirmar");
            const tipo = nueva.type === "password" ? "text" : "password";
            nueva.type = confirmar.type = tipo;
        }

        document.getElementById("formulario").addEventListener("submit", function(e) {
            e.preventDefault();

            const cedula = document.getElementById("cedula").value;
            const nueva = document.getElementById("nueva").value;
            const confirmar = document.getElementById("confirmar").value;
            const errorDiv = document.getElementById("error");
            const respuesta = document.getElementById("respuesta-servidor");

            if (nueva !== confirmar) {
                errorDiv.style.display = "block";
                respuesta.style.display = "none";
                return;
            }

            errorDiv.style.display = "none";

            const datos = new FormData(this);

            fetch("actualizar_contrasena.php", {
                    method: "POST",
                    body: datos
                })
                .then(response => response.json())
                .then(data => {
                    respuesta.style.display = "block";
                    respuesta.style.color = data.tipo === "error" ? "red" : "green";
                    respuesta.textContent = data.mensaje;

                    if (data.tipo === "exito") {
                        setTimeout(() => {
                            window.location.href = "login.php";
                        }, 2000);
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
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
    <script>
        function mostrarContrasenas() {
            const nueva = document.getElementById("nueva");
            const confirmar = document.getElementById("confirmar");
            const tipo = nueva.type === "password" ? "text" : "password";
            nueva.type = confirmar.type = tipo;
        }

        function verificarCedula() {
            const cedula = document.getElementById("cedula").value.trim();
            const mensaje = document.getElementById("mensaje-cedula");
            const nueva = document.getElementById("nueva");
            const confirmar = document.getElementById("confirmar");

            if (cedula === "") {
                mensaje.textContent = "⚠ Por favor ingresa una cédula.";
                mensaje.style.color = "red";
                nueva.disabled = true;
                confirmar.disabled = true;
                return;
            }

            fetch("verificar_cedula.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: "cedula=" + encodeURIComponent(cedula),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.existe) {
                        mensaje.textContent = "✅ Cédula verificada. Ingresa tu nueva contraseña.";
                        mensaje.style.color = "green";
                        nueva.disabled = false;
                        confirmar.disabled = false;
                        nueva.focus();
                    } else {
                        mensaje.textContent = "❌ La cédula ingresada no existe en el sistema.";
                        mensaje.style.color = "red";
                        nueva.disabled = true;
                        confirmar.disabled = true;
                    }
                })
                .catch(error => {
                    mensaje.textContent = "❌ La cedula ingresada no existe en el sistema";
                    mensaje.style.color = "red";
                    nueva.disabled = true;
                    confirmar.disabled = true;
                    console.error(error);
                });
        }
    </script>


</body>

</html>