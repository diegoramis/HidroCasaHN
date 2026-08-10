HIDRO CASA HN — SITIO WEB ESTÁTICO
===================================

Archivos principales
--------------------
- index.html: contenido del sitio.
- styles.css: diseño y adaptación a móviles.
- app.js: menú, detalles de producto y cotización por correo.
- config.js: datos fáciles de personalizar.
- assets/: logo e imágenes de productos.

Antes de publicar
-----------------
1. El correo de cotizaciones está configurado en config.js como:
   email: "ventas@hicrocasahn.com"

2. En index.html puede cambiar textos, cobertura, políticas, garantía,
   precios y disponibilidad.

3. Las imágenes y especificaciones de LetPot provienen de sus fichas
   oficiales. Antes de usar el sitio comercialmente, confirme que cuenta
   con autorización para distribuir la marca y reutilizar sus imágenes.
   El sitio no afirma ser distribuidor oficial.

Cómo verlo
----------
Abra index.html en un navegador. Para publicarlo puede subir toda la
carpeta a un hosting estático, cPanel, Netlify, Cloudflare Pages o GitHub Pages.

La cotización no requiere servidor: prepara un correo con los productos seleccionados
y abre la aplicación de correo del visitante para que revise y envíe el mensaje.

HTTPS
-----
Se incluye un archivo .htaccess para redirigir HTTP a HTTPS cuando el sitio se aloja
en Apache/cPanel. El hosting debe tener primero un certificado SSL/TLS válido instalado.
En servicios como Cloudflare Pages, Netlify o GitHub Pages, active HTTPS desde la
configuración del proveedor si corresponde.
