# 📄 Generación de PDF con Dompdf en Proyecto ASODAT

Este repositorio forma parte del sistema desarrollado para ASODAT, e incluye la funcionalidad de generar documentos PDF usando la biblioteca **Dompdf**. A continuación se detallan **dos métodos de instalación** según las necesidades del entorno.

---

## ✅ Requisitos

- PHP >= 7.1
- Extensiones habilitadas: `mbstring`, `dom`, `gd`
- Servidor local como XAMPP, WAMP o PHP CLI

---

## Opción 1: Instalación con Composer (Por Consola)

> ⚠️ Para este método necesitas tener instalado [Composer](https://getcomposer.org/), el gestor de dependencias para PHP.

### 🔹 Si no tienes Composer instalado:

Puedes descargarlo desde:  
👉 [https://getcomposer.org/download/](https://getcomposer.org/download/)

Una vez instalado composer poner la siguiente linea de codigo en la consola:

```bash
composer require dompdf/dompdf
```

Luego en tu archivo PHP:

```bash
require 'vendor/autoload.php';
```

```bash
use Dompdf\Dompdf;

$dompdf = new Dompdf();
$dompdf->loadHtml('<h1>Hola mundo</h1>');
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream('documento.pdf', ["Attachment" => false]);
```

## Opción 2: Instalación manual (ZIP)

Si Composer no está disponible, puedes usar Dompdf manualmente así:

1. Descargar el archivo

Puedes descargar el paquete desde su [sitio oficial en GitHub](https://github.com/dompdf/dompdf/releases) 

2. Extraer en tu proyecto

Extrae el ZIP en una carpeta dompdf/ dentro de tu proyecto, quedando así:

```bash
Proyecto-ASODAT/
├── dompdf/
│   ├── dompdf.php
│   └── src/
├── generar_pdf.php
```

3. Ejemplo de Dompdf manualmente

```bash
require_once 'dompdf/autoload.inc.php';

use Dompdf\Dompdf;

$dompdf = new Dompdf();
$dompdf->loadHtml('<h2>Hola desde ZIP</h2>');
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream('archivo_manual.pdf', ["Attachment" => false]);
```
