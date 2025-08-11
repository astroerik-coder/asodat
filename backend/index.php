<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ASODAT</title>
    <link rel="stylesheet" href="styles.css" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">


    <style>
        .beneficios-modernos {
            background: #f1f6fa;
            padding: 4rem 2rem;
            text-align: center;
        }

        .titulo-beneficios {
            font-size: 2.5rem;
            font-weight: 800;
            color: #123a5d;
            margin-bottom: 2.5rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .grid-beneficios {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
            max-width: 1300px;
            margin: auto;
        }

        .beneficio-box {
            background: #ffffff;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .beneficio-box:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        }

        .icono-beneficio {
            font-size: 2.8rem;
            color: #1c7da7;
            margin-bottom: 1rem;
        }

        .beneficio-box h3 {
            font-size: 1.3rem;
            color: #1d3557;
            margin-bottom: 0.8rem;
            font-weight: 700;
        }

        .beneficio-box p {
            font-size: 0.95rem;
            color: #444;
            line-height: 1.5;
        }

        @media (max-width: 992px) {
            .grid-beneficios {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 576px) {
            .grid-beneficios {
                grid-template-columns: 1fr;
            }
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

    <main>

        <section id="inicio" class="inicio-section">
            <div class="container">
                <div class="asociacion-img">
                    <img src="img/sociosASODAT.jpeg" alt="Foto de la Asociación" />
                </div>

                <div class="historia">
                    <h2>Historia de ASODAT</h2>
                    <p>La Asociación de Docentes, Personal Administrativo y Trabajadores de la Universidad de las Fuerzas
                        Armadas “ESPE” sede Latacunga fue constituida con el objetivo de fortalecer la unidad y el bienestar
                        de sus miembros. Surgió del compromiso y esfuerzo colectivo de sus fundadores el 23 de octubre de
                        2023.
                    </p>
                </div>

                <section class="mision-vision">
                    <div class="contenedor-seccion">
                        <div class="bloque mision">
                            <div class="mision-imagen">
                                <img src="img/mision.webp" alt="Misión" />
                            </div>
                            <div class="mision-contenido">
                                <h3>Misión</h3>
                                <p>Fomentar el espíritu de unidad, solidaridad, pertenencia y compañerismo entre los socios,
                                    para coadyuvar en el desarrollo y progreso de la Universidad, promoviendo el
                                    mejoramiento
                                    laboral, económico, social y cultural.</p>
                            </div>
                        </div>

                        <div class="bloque vision">
                            <div class="vision-imagen">
                                <img src="img/vision.svg" alt="Visión" />
                            </div>
                            <div class="vision-contenido">
                                <h3>Visión</h3>
                                <p>Ser una organización sólida y representativa que defienda los derechos de sus miembros,
                                    brinde servicios de calidad y contribuya activamente al fortalecimiento institucional de
                                    la UFA-ESPE sede Latacunga.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div class="objetivos">
                    <h2 class="titulo-objetivos">Objetivos</h2>
                    <div class="objetivo-grid">
                        <div class="objetivo-card">
                            <div class="objetivo-icono">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="objetivo-contenido">
                                <h3>Unidad y solidaridad</h3>
                                <p>Fomentar la unidad y solidaridad entre los miembros para contribuir al desarrollo y
                                    progreso de la Universidad de las Fuerzas Armadas ESPE (UFA-ESPE) Sede Latacunga.</p>
                            </div>
                        </div>
                        <div class="objetivo-card">
                            <div class="objetivo-icono">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="objetivo-contenido">
                                <h3>Mejoramiento de condiciones</h3>
                                <p>Mejorar las condiciones laborales, económicas, sociales, deportivas y culturales de los
                                    miembros a través de programas y actividades específicas.</p>
                            </div>
                        </div>
                        <div class="objetivo-card">
                            <div class="objetivo-icono">
                                <i class="fas fa-balance-scale"></i>
                            </div>
                            <div class="objetivo-contenido">
                                <h3>Defensa de derechos</h3>
                                <p>Defender los derechos laborales, constitucionales y legales de los asociados,
                                    brindándoles asesoría administrativa y legal.</p>
                            </div>
                        </div>
                        <div class="objetivo-card">
                            <div class="objetivo-icono">
                                <i class="fas fa-handshake"></i>
                            </div>
                            <div class="objetivo-contenido">
                                <h3>Cooperativas y servicios</h3>
                                <p>Crear cooperativas y servicios de asistencia para el beneficio de los miembros de la
                                    Asociación.</p>
                            </div>
                        </div>
                        <div class="objetivo-card">
                            <div class="objetivo-icono">
                                <i class="fas fa-cogs"></i>
                            </div>
                            <div class="objetivo-contenido">
                                <h3>Colaboración académica y administrativa</h3>
                                <p>Colaborar con la gestión académica y administrativa de la UFA-ESPE Sede Latacunga a
                                    través de la interacción directa con sus autoridades y presentación de proyectos.</p>
                            </div>
                        </div>
                        <div class="objetivo-card">
                            <div class="objetivo-icono">
                                <i class="fas fa-users-cog"></i>
                            </div>
                            <div class="objetivo-contenido">
                                <h3>Participación activa</h3>
                                <p>Participar activamente en eventos académicos, culturales, deportivos y de vinculación
                                    organizados por la Universidad o por la Asociación.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <section class="beneficios-modernos">
                    <h2 class="titulo-beneficios">Beneficios</h2>
                    <div class="grid-beneficios">

                        <div class="beneficio-box">
                            <i class="fas fa-gavel icono-beneficio"></i>
                            <h3>Asistencia Legal y Administrativa</h3>
                            <p>Asesoría en temas laborales, administrativos y legales para nuestros miembros.</p>
                        </div>

                        <div class="beneficio-box">
                            <i class="fas fa-users icono-beneficio"></i>
                            <h3>Defensa de los Derechos Laborales</h3>
                            <p>Defensa activa de los derechos laborales de nuestros miembros ante las autoridades.</p>
                        </div>

                        <div class="beneficio-box">
                            <i class="fas fa-chart-line icono-beneficio"></i>
                            <h3>Asesoría Financiera y Económica</h3>
                            <p>Asesoría y apoyo económico en la gestión financiera, acceso a cooperativas y préstamos.</p>
                        </div>

                        <div class="beneficio-box">
                            <i class="fas fa-credit-card icono-beneficio"></i>
                            <h3>Acceso a Créditos y Préstamos</h3>
                            <p>Condiciones preferenciales en préstamos personales y beneficios asociados.</p>
                        </div>

                        <div class="beneficio-box">
                            <i class="fas fa-users-cog icono-beneficio"></i>
                            <h3>Beneficios Sociales y Culturales</h3>
                            <p>Participación en eventos culturales, sociales y recreativos organizados por la asociación.</p>
                        </div>

                        <div class="beneficio-box">
                            <i class="fas fa-handshake icono-beneficio"></i>
                            <h3>Solidaridad y Apoyo entre Miembros</h3>
                            <p>Fomento de la colaboración, solidaridad y el espíritu de comunidad dentro de la asociación.</p>
                        </div>

                        <div class="beneficio-box">
                            <i class="fas fa-vote-yea icono-beneficio"></i>
                            <h3>Participación Activa en Decisiones</h3>
                            <p>Derecho a elegir y ser elegido para cargos directivos, participando en decisiones importantes.</p>
                        </div>

                        <div class="beneficio-box">
                            <i class="fas fa-money-bill-wave icono-beneficio"></i>
                            <h3>Acceso a Reembolsos y Viáticos</h3>
                            <p>Reembolsos de gastos para miembros de la directiva y comisiones al realizar actividades institucionales.</p>
                        </div>

                    </div>
                </section>


                <div class="carrusel">
                    <h2>Galería de la Asociación</h2>
                    <div class="carrusel-contenedor">
                        <div class="slide"><img src="img/Img carrusel/carrusel1.jpeg" alt="Foto 1" /></div>
                        <div class="slide"><img src="img/Img carrusel/carrusel2.jpeg" alt="Foto 2" /></div>
                        <div class="slide"><img src="img/Img carrusel/carrusel4.jpeg" alt="Foto 3" /></div>
                        <div class="slide"><img src="img/Img carrusel/carrusel5.jpeg" alt="Foto 3" /></div>
                    </div>
                    <div class="carrusel-botones">
                        <button id="prev">⬅️</button>
                        <button id="next">➡️</button>
                    </div>
                </div>
            </div>
        </section>

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

<script>
    let index = 0;
    const slides = document.querySelectorAll('.slide');
    const carrusel = document.querySelector('.carrusel-contenedor');

    function showSlide(i) {
        index = (i + slides.length) % slides.length;
        carrusel.style.transform = `translateX(-${index * 100}%)`;
    }

    document.querySelector('#prev').addEventListener('click', () => showSlide(index - 1));
    document.querySelector('#next').addEventListener('click', () => showSlide(index + 1));
</script>


</html>