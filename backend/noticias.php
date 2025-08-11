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

        .acciones-noticia {
            margin-top: 10px;
        }

        .btn-editar,
        .btn-eliminar {
            margin-right: 10px;
            padding: 6px 12px;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.85rem;
        }

        .btn-editar {
            background-color: #ffc107;
            color: #000;
        }

        .btn-eliminar {
            background-color: #dc3545;
            color: #fff;
        }

        .grid-noticias {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .noticia-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            transition: transform 0.2s ease;
        }

        .noticia-card img {
            width: 100%;
            height: 180px;
            object-fit: cover;
        }

        .noticia-card .contenido-noticia {
            padding: 15px;
        }

        .noticia-card:hover {
            transform: translateY(-5px);
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

    <main class="container noticias-section">
        <h2>Noticias y Comunicados</h2>

        <div class="filtros-noticias">
            <button class="filtro-btn activo" data-filtro="todo">Todas</button>
            <button class="filtro-btn" data-filtro="eventos">Eventos</button>
            <button class="filtro-btn" data-filtro="comunicados">Comunicados</button>
            <button class="filtro-btn" data-filtro="asamblea">Asambleas</button>
        </div>

        <div class="grid-noticias">
            <?php
            include 'conexion.php';
            $resultado = $conn->query("SELECT * FROM noticias ORDER BY fecha DESC");

            while ($row = $resultado->fetch_assoc()):
            ?>
                <article class="noticia-card" data-categoria="<?= htmlspecialchars($row['categoria']) ?>">
                    <img src="<?= htmlspecialchars($row['imagen']) ?>" alt="<?= htmlspecialchars($row['titulo']) ?>">
                    <div class="contenido-noticia">
                        <span class="fecha-noticia"><?= date("d M Y", strtotime($row['fecha'])) ?></span>
                        <h3><?= htmlspecialchars($row['titulo']) ?></h3>
                        <p><?= htmlspecialchars($row['contenido']) ?></p>

                        <?php if (isset($_SESSION['rol']) && $_SESSION['rol'] === 'presidente'): ?>
                            <div class="acciones-noticia">
                                <a href="editar_noticia.php?id=<?= $row['id'] ?>" class="btn-editar">✏️ Editar</a>
                                <a href="eliminar_noticia.php?id=<?= $row['id'] ?>" class="btn-eliminar" onclick="return confirm('¿Eliminar esta noticia?')">🗑️ Eliminar</a>

                            </div>
                        <?php endif; ?>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>

        <?php if (isset($_SESSION['rol']) && $_SESSION['rol'] === 'presidente'): ?>
            <a href="agregar_noticia.php" class="btn-agregar-noticia">➕ Agregar Noticia</a>
        <?php endif; ?>

    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ASODAT - Asociación de Docentes, Personal Administrativo y Trabajadores de la ESPE sede
                Latacunga.</p>
        </div>
    </footer>

    <script>
        const botonesFiltro = document.querySelectorAll(".filtro-btn");
        const noticias = document.querySelectorAll(".noticia-card");

        botonesFiltro.forEach(boton => {
            boton.addEventListener("click", () => {
                botonesFiltro.forEach(b => b.classList.remove("activo"));
                boton.classList.add("activo");

                const filtro = boton.getAttribute("data-filtro");

                noticias.forEach(noticia => {
                    const categoria = noticia.getAttribute("data-categoria");

                    if (filtro === "todo" || filtro === categoria) {
                        noticia.style.display = "flex";
                    } else {
                        noticia.style.display = "none";
                    }
                });
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