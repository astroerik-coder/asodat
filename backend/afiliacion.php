<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Afiliación | ASODAT</title>
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

    <main class="container contenido-afiliacion">

        <h2>Afiliación a ASODAT</h2>

        <section class="card-seccion card-con-imagen">
            <div class="card-texto">
                <h3>Requisitos para Afiliación</h3>
                <ul class="card-lista">
                    <li>Ser servidor de la UFA-ESPE sede Latacunga con relación de dependencia.</li>
                    <li>Presentar una solicitud escrita dirigida al Presidente de la Asociación.</li>
                    <li>Adjuntar copia de la cédula de identidad.</li>
                    <li>Aceptar cumplir con el Estatuto, normativas y comisiones asignadas.</li>
                    <li>Autorizar descuentos por nómina de aportes ordinarios y extraordinarios.</li>
                </ul>
            </div>
            <div class="card-imagen">
                <img src="img/afiliacion.png" alt="Imagen Afiliación">
            </div>
        </section>

        <section class="card-seccion card-con-imagen reverse">
            <div class="card-texto">
                <h3>Beneficios de ser Miembro</h3>
                <ul class="card-lista">
                    <li>Elegir y ser elegido para dignidades de la Directiva.</li>
                    <li>Participar con voz y voto en Asambleas Generales.</li>
                    <li>Asesoría administrativa y legal en temas laborales.</li>
                    <li>Acceso a proyectos sociales, culturales, deportivos y académicos.</li>
                    <li>Descuentos y convenios comerciales gestionados por la asociación.</li>
                    <li>Acceso a cooperativas y servicios de bienestar.</li>
                </ul>
            </div>
            <div class="card-imagen">
                <img src="img/miembro.jpg" alt="Imagen Beneficios">
            </div>
        </section>

    </main>

    <section class="pdf-section">
        <h3>Formulario Oficial de Afiliación</h3>
        <p>Puedes revisar y descargar el formulario oficial que deberás llenar y entregar:</p>

        <div class="pdf-viewer">
            <iframe src="files/Solicitud de Afiliación.pdf" width="100%" height="600px"></iframe>
        </div>

        <a class="btn-descargar" href="files/Solicitud de Afiliación.pdf" download>
            <i class="fas fa-file-download"></i> Descargar PDF
        </a>
    </section>

    <div class="logo-final">
        <a href="index.php">
            <img src="img/Logo Asociación.jpeg" alt="Logo ASODAT">
        </a>
    </div>

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