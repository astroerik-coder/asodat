# API REST para ASODAT

Esta API proporciona endpoints RESTful para el sistema de gestión de la Asociación ASODAT.

## Base URL
```
http://localhost/asodat/backend/api
```

## Autenticación

### POST /login
Inicia sesión de un usuario.

**Body:**
```json
{
  "cedula": "1234567890",
  "contrasena": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "status": "success",
  "mensaje": "Login exitoso",
  "data": {
    "cedula": "1234567890",
    "nombre_completo": "Apellido Nombre",
    "rol": "socio",
    "token": "eyJjZWR1bGEiOiIxMjM0NTY3ODkwIiwicm9sIjoic29jaW8iLCJleHAiOjE2MzQ1Njc4OTB9"
  }
}
```

## Socios

### GET /socios
Obtiene la lista de socios con paginación y búsqueda.

**Query Parameters:**
- `buscar` (opcional): Buscar por cédula, nombre o teléfono
- `pagina` (opcional): Número de página (default: 1)
- `limite` (opcional): Elementos por página (default: 25)

**Respuesta:**
```json
{
  "status": "success",
  "data": {
    "socios": [
      {
        "id": 1,
        "cedula": "1234567890",
        "apellidos_nombres": "Apellido Nombre",
        "telefono": "0987654321",
        "email": "email@example.com",
        "rol": "socio",
        "fecha_afiliacion": "2023-01-01",
        "estado": "activo"
      }
    ],
    "paginacion": {
      "pagina_actual": 1,
      "total_paginas": 5,
      "total_socios": 120,
      "limite": 25
    }
  }
}
```

### POST /socios
Crea un nuevo socio.

**Body:**
```json
{
  "cedula": "1234567890",
  "apellidos_nombres": "Apellido Nombre",
  "telefono": "0987654321",
  "email": "email@example.com",
  "rol": "socio",
  "fecha_afiliacion": "2023-01-01",
  "estado": "activo"
}
```

**Respuesta:**
```json
{
  "status": "success",
  "mensaje": "Socio creado exitosamente",
  "data": {
    "id": 1,
    "cedula": "1234567890",
    "apellidos_nombres": "Apellido Nombre",
    "telefono": "0987654321",
    "email": "email@example.com",
    "rol": "socio",
    "fecha_afiliacion": "2023-01-01",
    "estado": "activo",
    "contrasena_temporal": "7890"
  }
}
```

## Aportes

### GET /aportes
Obtiene la lista de aportes con filtros y paginación.

**Query Parameters:**
- `cedula` (opcional): Filtrar por cédula de socio
- `fecha_inicio` (opcional): Fecha de inicio para filtrar
- `fecha_fin` (opcional): Fecha de fin para filtrar
- `pagina` (opcional): Número de página (default: 1)
- `limite` (opcional): Elementos por página (default: 25)

**Respuesta:**
```json
{
  "status": "success",
  "data": {
    "aportes": [
      {
        "id": 1,
        "cedula": "1234567890",
        "nombre_socio": "Apellido Nombre",
        "monto": 25.00,
        "fecha": "2023-01-15",
        "tipo_aporte": "mensual",
        "descripcion": "Aporte mensual enero 2023",
        "estado": "confirmado"
      }
    ],
    "paginacion": {
      "pagina_actual": 1,
      "total_paginas": 3,
      "total_aportes": 75,
      "limite": 25
    },
    "filtros": {
      "cedula": "",
      "fecha_inicio": "",
      "fecha_fin": ""
    }
  }
}
```

### POST /aportes
Registra un nuevo aporte.

**Body:**
```json
{
  "cedula": "1234567890",
  "monto": 25.00,
  "tipo_aporte": "mensual",
  "fecha": "2023-01-15",
  "descripcion": "Aporte mensual enero 2023",
  "estado": "pendiente"
}
```

## Noticias

### GET /noticias
Obtiene la lista de noticias con filtros y paginación.

**Query Parameters:**
- `buscar` (opcional): Buscar en título o contenido
- `categoria` (opcional): Filtrar por categoría
- `pagina` (opcional): Número de página (default: 1)
- `limite` (opcional): Elementos por página (default: 10)

## Reportes

### GET /reportes
Genera reportes de diferentes tipos.

**Query Parameters:**
- `tipo` (requerido): Tipo de reporte
  - `aportes_mensuales`: Aportes agrupados por mes
  - `aportes_por_socio`: Aportes agrupados por socio
  - `estadisticas_generales`: Estadísticas generales del sistema
- `fecha_inicio` (opcional): Fecha de inicio
- `fecha_fin` (opcional): Fecha de fin

**Ejemplo de respuesta para estadísticas generales:**
```json
{
  "status": "success",
  "data": {
    "tipo_reporte": "estadisticas_generales",
    "fecha_inicio": "2023-01-01",
    "fecha_fin": "2023-12-31",
    "resultados": {
      "socios": {
        "total": 120,
        "activos": 110,
        "inactivos": 10
      },
      "aportes": {
        "total": 1320,
        "monto_total": 33000.00,
        "promedio": 25.00
      },
      "periodo": {
        "fecha_inicio": "2023-01-01",
        "fecha_fin": "2023-12-31"
      }
    }
  }
}
```

## Códigos de Estado HTTP

- `200` - OK: Solicitud exitosa
- `201` - Created: Recurso creado exitosamente
- `400` - Bad Request: Datos de entrada inválidos
- `401` - Unauthorized: No autorizado
- `404` - Not Found: Recurso no encontrado
- `405` - Method Not Allowed: Método HTTP no permitido
- `409` - Conflict: Conflicto (ej: cédula duplicada)
- `500` - Internal Server Error: Error interno del servidor

## Seguridad

- Todas las consultas SQL utilizan prepared statements para prevenir inyección SQL
- Se valida el formato de entrada (cédula, email, etc.)
- Se verifica la existencia de registros relacionados antes de crear nuevos

## Notas de Implementación

- La API está diseñada para ser consumida por el frontend de Next.js
- Se incluye soporte para CORS para desarrollo local
- Los tokens de autenticación son simples (base64) - en producción se recomienda usar JWT reales
- La paginación está implementada en todos los endpoints de listado
- Se incluyen filtros de búsqueda en los endpoints principales
