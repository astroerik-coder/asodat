<?php
// Configuración conexión a la base de datos MySQL
$host = 'localhost';
$dbname = 'asodat_db';
$user = 'root';  // Cambia si usas otro usuario
$pass = '';      // Cambia si tienes contraseña

$cedula = '';
$nombre = '';
$cupo = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cedula = trim($_POST['cedula'] ?? '');

    if ($cedula === '') {
        $error = 'Por favor ingrese una cédula.';
    } else {
        try {
            $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);

            $stmt = $pdo->prepare("SELECT nombrecompleto, cupo FROM cupossocios WHERE cedula = ?");
            $stmt->execute([$cedula]);
            $socio = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($socio) {
                $nombre = $socio['nombrecompleto'];
                $cupo = $socio['cupo'];
            } else {
                $error = "No se encontró un socio con la cédula '$cedula'.";
            }
        } catch (PDOException $e) {
            $error = "Error de base de datos: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Buscar Cupo Socio - Multisa</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: url('img/fondomultisa.avif') no-repeat center center fixed;
            background-size: cover;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .contenedor {
            background-color: rgba(0,0,0,0.65);
            padding: 2rem 3rem;
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(0,0,0,0.7);
            max-width: 400px;
            width: 90%;
            text-align: center;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
            font-weight: 600;
        }
        input[type="text"] {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            border: none;
            margin-bottom: 1rem;
            font-size: 1rem;
        }
        button {
            padding: 0.6rem 1.5rem;
            border: none;
            border-radius: 6px;
            background-color: #007bff;
            color: white;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            margin-right: 1rem;
            transition: background-color 0.3s ease;
        }
        button:hover {
            background-color: #0056b3;
        }
        .resultado {
            margin-top: 1.5rem;
            font-size: 1.2rem;
        }
        .error {
            margin-top: 1rem;
            color: #ff6b6b;
            font-weight: 700;
        }
        .btn-regresar {
            margin-top: 2rem;
            background-color: #28a745;
            padding: 0.6rem 2rem;
            border-radius: 6px;
            font-weight: 700;
            font-size: 1rem;
            color: white;
            text-decoration: none;
            display: inline-block;
            transition: background-color 0.3s ease;
        }
        .btn-regresar:hover {
            background-color: #1e7e34;
        }
    </style>
</head>
<body>
    <div class="contenedor">
        <form method="post" action="multisa.php">
            <label for="cedula">Ingrese la cédula</label>
            <input type="text" id="cedula" name="cedula" value="<?= htmlspecialchars($cedula) ?>" required />

            <button type="submit" name="buscar">Buscar</button>
            <button type="button" onclick="window.location.href='multisa.php'">Refrescar</button>
        </form>

        <?php if ($error): ?>
            <div class="error"><?= htmlspecialchars($error) ?></div>
        <?php elseif ($nombre !== ''): ?>
            <div class="resultado">
                <p><strong>Nombre:</strong> <?= htmlspecialchars($nombre) ?></p>
                <p><strong>Cupo disponible:</strong> $<?= number_format($cupo, 2) ?></p>
            </div>
        <?php endif; ?>

        <a href="convenios.php" class="btn-regresar">Regresar a Convenios</a>
    </div>
</body>
</html>
