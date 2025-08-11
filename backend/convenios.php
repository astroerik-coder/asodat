<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Convenios ASODAT</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: url('img/Fondo2.jpg') no-repeat center center fixed;
            background-size: cover;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .contenedor {
            display: flex;
            gap: 2rem;
            max-width: 900px;
            padding: 2rem;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0,0,0,0.7);
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            margin-bottom: 1.5rem;
        }

        .cuadro {
            flex: 1;
            cursor: pointer;
            overflow: hidden;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            text-align: center;
            background-color: #222;
        }

        .cuadro:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 20px rgba(0,0,0,0.5);
        }

        .cuadro img {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 12px;
        }

        .btn-inicio {
            background-color: #28a745;
            padding: 0.8rem 2.5rem;
            border-radius: 8px;
            font-weight: 700;
            font-size: 1.1rem;
            color: white;
            text-decoration: none;
            box-shadow: 0 4px 10px rgba(0,128,0,0.5);
            transition: background-color 0.3s ease;
        }

        .btn-inicio:hover {
            background-color: #1e7e34;
            box-shadow: 0 6px 14px rgba(0,110,0,0.7);
        }

        @media (max-width: 640px) {
            .contenedor {
                flex-direction: column;
                max-width: 95%;
                padding: 1rem;
            }

            .cuadro {
                margin-bottom: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="contenedor">
        <a href="multisa.php" class="cuadro" title="Multisa">
            <img src="img/multisa.jpg" alt="Convenio Multisa" />
        </a>
        <a href="sana.php" class="cuadro" title="Sana">
            <img src="img/sanasana.jpg" alt="Convenio Sana" />
        </a>
    </div>

    <a href="index2.php" class="btn-inicio">Regresar al Inicio</a>
</body>
</html>
