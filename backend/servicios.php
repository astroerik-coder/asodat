<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Servicios - ASODAT</title>
    <link rel="stylesheet" href="styles.css" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <script src="https://kit.fontawesome.com/a2e0e9f6e4.js" crossorigin="anonymous"></script>
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
    <main style="background-color: #3ca8b7;">
        <section class="servicios-section" style="background-color:#e3f2f9">
            <div class="container">
                <h2 class="titulo-servicios">Nuestros Servicios</h2>
                <div class="servicios-grid">

                    <div class="servicio-card">
                        <i class="fas fa-user-friends"></i>
                        <h3>Afiliación a la Asociación</h3>
                        <p>Permite a docentes, administrativos y trabajadores ser parte activa de la ASODAT.</p>
                        <strong>Requisitos:</strong>
                        <ul>
                            <li>Relación laboral con la UFA-ESPE Sede Latacunga.</li>
                            <li>Solicitud escrita de afiliación.</li>
                            <li>Copia de cédula de identidad.</li>
                            <li>Autorización de descuentos por rol de pagos.</li>
                        </ul>
                    </div>

                    <div class="servicio-card">
                        <i class="fas fa-balance-scale"></i>
                        <h3>Asesoría Legal y Administrativa</h3>
                        <p>Apoyo en temas legales relacionados con la relación laboral de los socios.</p>
                        <strong>Requisitos:</strong>
                        <ul>
                            <li>Ser miembro activo de la Asociación.</li>
                            <li>Solicitud escrita dirigida a la Directiva.</li>
                        </ul>
                    </div>

                    <div class="servicio-card">
                        <i class="fas fa-handshake"></i>
                        <h3>Convenios Comerciales</h3>
                        <p>Facilidad de acceso a bienes y servicios mediante descuentos por rol.</p>
                        <strong>Requisitos:</strong>
                        <ul>
                            <li>Estar al día en las cuotas.</li>
                            <li>No estar sancionado o en mora.</li>
                        </ul>
                    </div>

                    <div class="servicio-card">
                        <i class="fas fa-running"></i>
                        <h3>Actividades Recreativas y Culturales</h3>
                        <p>Eventos deportivos, culturales y de integración para fortalecer la unidad gremial.</p>
                        <strong>Requisitos:</strong>
                        <ul>
                            <li>Inscripción previa cuando se requiera.</li>
                            <li>Participación activa en la organización.</li>
                        </ul>
                    </div>

                    <div class="servicio-card">
                        <i class="fas fa-file-alt"></i>
                        <h3>Participación en Asambleas</h3>
                        <p>Derecho a voz y voto en decisiones importantes para la Asociación.</p>
                        <strong>Requisitos:</strong>
                        <ul>
                            <li>Estar registrado ante la autoridad competente.</li>
                            <li>Estar al día en obligaciones estatutarias.</li>
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    </main>
    <div class="logo-final">
        <a href="index.php">
            <img src="img/Logo Asociación.jpeg" alt="Logo ASODAT">
        </a>
    </div>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ASODAT - Asociación de Docentes, Personal Administrativo y Trabajadores de la ESPE sede
            Latacunga.</p>
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