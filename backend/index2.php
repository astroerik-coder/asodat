<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>Fondo con Imagen y Botones</title>
    <style>
        html,
        body {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: url('img/Fondo2.jpg') no-repeat center center fixed;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
        }

        .contenedor {
            background-color: rgba(0, 0, 0, 0.55);
            padding: 2rem 3rem;
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
            max-width: 600px;
            text-align: center;
        }

        h1 {
            margin-bottom: 1rem;
            font-size: 2.5rem;
            font-weight: 700;
        }

        p {
            font-size: 1.25rem;
            line-height: 1.5;
            margin-bottom: 2rem;
        }

        /* Logo */
        .logo {
            max-width: 200px;
            height: auto;
            margin-bottom: 2rem;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        /* Botones */
        .botones {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            flex-wrap: wrap;
        }

        .botones a {
            background-color: #007bff;
            color: white;
            text-decoration: none;
            padding: 0.75rem 2rem;
            border-radius: 6px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: background-color 0.3s ease;
            box-shadow: 0 3px 6px rgba(0, 123, 255, 0.4);
            min-width: 120px;
        }

        .botones a:hover {
            background-color: #0056b3;
            box-shadow: 0 5px 12px rgba(0, 86, 179, 0.6);
        }

        @media (max-width: 640px) {
            .contenedor {
                padding: 1.5rem 2rem;
                max-width: 90%;
            }

            h1 {
                font-size: 1.75rem;
            }

            p {
                font-size: 1rem;
            }

            .botones {
                flex-direction: column;
                gap: 1rem;
            }

            .botones a {
                min-width: 100%;
                font-size: 1rem;
            }
        }
    </style>
</head>

<body>
    <div class="contenedor">
        <img src="img/Logo Asociación.jpeg" alt="Logo Asociación" class="logo" />
        <div class="botones">
            <a href="login.php">Socios</a>
            <a href="convenios.php">Convenios</a>
        </div>
    </div>
</body>

</html>