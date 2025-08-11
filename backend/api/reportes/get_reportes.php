<?php
// Parámetros de consulta
$tipo_reporte = isset($_GET['tipo']) ? $_GET['tipo'] : 'general';
$fecha_inicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : date('Y-m-01'); // Primer día del mes actual
$fecha_fin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : date('Y-m-d'); // Hoy

try {
    switch ($tipo_reporte) {
        case 'aportes_mensuales':
            // Reporte de aportes mensuales
            $sql = "SELECT 
                        DATE_FORMAT(fecha, '%Y-%m') as mes,
                        COUNT(*) as total_aportes,
                        SUM(monto) as total_monto,
                        AVG(monto) as promedio_monto
                    FROM aportes 
                    WHERE fecha BETWEEN ? AND ?
                    GROUP BY DATE_FORMAT(fecha, '%Y-%m')
                    ORDER BY mes DESC";
            
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ss", $fecha_inicio, $fecha_fin);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $datos = [];
            while ($row = $result->fetch_assoc()) {
                $datos[] = [
                    'mes' => $row['mes'],
                    'total_aportes' => (int)$row['total_aportes'],
                    'total_monto' => (float)$row['total_monto'],
                    'promedio_monto' => (float)$row['promedio_monto']
                ];
            }
            $stmt->close();
            break;
            
        case 'aportes_por_socio':
            // Reporte de aportes por socio
            $sql = "SELECT 
                        s.cedula,
                        s.apellidos_nombres,
                        COUNT(a.id) as total_aportes,
                        SUM(a.monto) as total_monto,
                        MAX(a.fecha) as ultimo_aporte
                    FROM socios s
                    LEFT JOIN aportes a ON s.cedula = a.cedula 
                        AND a.fecha BETWEEN ? AND ?
                    GROUP BY s.cedula, s.apellidos_nombres
                    ORDER BY total_monto DESC";
            
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ss", $fecha_inicio, $fecha_fin);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $datos = [];
            while ($row = $result->fetch_assoc()) {
                $datos[] = [
                    'cedula' => $row['cedula'],
                    'nombre' => $row['apellidos_nombres'],
                    'total_aportes' => (int)$row['total_aportes'],
                    'total_monto' => (float)$row['total_monto'],
                    'ultimo_aporte' => $row['ultimo_aporte']
                ];
            }
            $stmt->close();
            break;
            
        case 'estadisticas_generales':
            // Estadísticas generales
            // Total de socios
            $sql_socios = "SELECT 
                            COUNT(*) as total_socios,
                            COUNT(CASE WHEN estado = 'activo' THEN 1 END) as socios_activos,
                            COUNT(CASE WHEN estado = 'inactivo' THEN 1 END) as socios_inactivos
                          FROM socios";
            $result_socios = $conn->query($sql_socios);
            $stats_socios = $result_socios->fetch_assoc();
            
            // Total de aportes
            $sql_aportes = "SELECT 
                              COUNT(*) as total_aportes,
                              SUM(monto) as total_monto,
                              AVG(monto) as promedio_monto
                            FROM aportes 
                            WHERE fecha BETWEEN ? AND ?";
            $stmt_aportes = $conn->prepare($sql_aportes);
            $stmt_aportes->bind_param("ss", $fecha_inicio, $fecha_fin);
            $stmt_aportes->execute();
            $result_aportes = $stmt_aportes->get_result();
            $stats_aportes = $result_aportes->fetch_assoc();
            $stmt_aportes->close();
            
            $datos = [
                'socios' => [
                    'total' => (int)$stats_socios['total_socios'],
                    'activos' => (int)$stats_socios['socios_activos'],
                    'inactivos' => (int)$stats_socios['socios_inactivos']
                ],
                'aportes' => [
                    'total' => (int)$stats_aportes['total_aportes'],
                    'monto_total' => (float)$stats_aportes['total_monto'],
                    'promedio' => (float)$stats_aportes['promedio_monto']
                ],
                'periodo' => [
                    'fecha_inicio' => $fecha_inicio,
                    'fecha_fin' => $fecha_fin
                ]
            ];
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Tipo de reporte no válido']);
            exit();
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => [
            'tipo_reporte' => $tipo_reporte,
            'fecha_inicio' => $fecha_inicio,
            'fecha_fin' => $fecha_fin,
            'resultados' => $datos
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al generar el reporte: ' . $e->getMessage()]);
}
?>
