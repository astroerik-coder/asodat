<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../conexion.php';

// Obtener la ruta de la URL
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path_parts = explode('/', trim($path, '/'));
$api_path = array_slice($path_parts, -2); // Obtener los últimos 2 segmentos

// Determinar el endpoint
$endpoint = end($api_path);
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($endpoint) {
        case 'login':
            if ($method === 'POST') {
                require_once 'auth/login.php';
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
            }
            break;
            
        case 'socios':
            if ($method === 'GET') {
                require_once 'socios/get_socios.php';
            } elseif ($method === 'POST') {
                require_once 'socios/create_socio.php';
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
            }
            break;
            
        case 'socio':
            if ($method === 'GET') {
                require_once 'socios/get_socio.php';
            } elseif ($method === 'PUT') {
                require_once 'socios/update_socio.php';
            } elseif ($method === 'DELETE') {
                require_once 'socios/delete_socio.php';
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
            }
            break;
            
        case 'aportes':
            if ($method === 'GET') {
                require_once 'aportes/get_aportes.php';
            } elseif ($method === 'POST') {
                require_once 'aportes/create_aporte.php';
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
            }
            break;
            
        case 'noticias':
            if ($method === 'GET') {
                require_once 'noticias/get_noticias.php';
            } elseif ($method === 'POST') {
                require_once 'noticias/create_noticia.php';
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
            }
            break;
            
        case 'noticia':
            if ($method === 'GET') {
                require_once 'noticias/get_noticia.php';
            } elseif ($method === 'PUT') {
                require_once 'noticias/update_noticia.php';
            } elseif ($method === 'DELETE') {
                require_once 'noticias/delete_noticia.php';
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
            }
            break;
            
        case 'reportes':
            if ($method === 'GET') {
                require_once 'reportes/get_reportes.php';
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint no encontrado']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>
