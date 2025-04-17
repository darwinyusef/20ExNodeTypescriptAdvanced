import { HelmetOptions } from 'helmet';

export const helmetConfig: HelmetOptions = {
    // 🔐 Desactiva la política de seguridad de contenido (CSP), útil si usás scripts o estilos externos que darían conflicto con la política por defecto.
    // contentSecurityPolicy: false,

    // 🧬 Activa la política de aislamiento de origen para recursos embebidos (como `<iframe>` o `<video>`), mejora la protección contra ataques tipo Spectre.
    crossOriginEmbedderPolicy: true,

    // 🕵️‍♂️ Evita que el navegador envíe la cabecera Referer al hacer peticiones, lo que protege información de navegación del usuario.
    referrerPolicy: { policy: 'no-referrer' },

    // 🧱 Previene que tu sitio sea cargado dentro de un iframe, evitando ataques de clickjacking.
    frameguard: { action: 'deny' },

    // 📆 Activa HTTP Strict Transport Security (HSTS) por un año, obligando al navegador a usar HTTPS incluso si el usuario pone http://.
    hsts: {
        maxAge: 31536000, // Tiempo en segundos: 1 año
        includeSubDomains: true, // También aplica a subdominios
        preload: true, // Permite que tu dominio sea precargado en listas HSTS de navegadores
    },

    // 🧪 Evita que el navegador intente adivinar (sniff) el tipo MIME del contenido, lo que reduce el riesgo de ataques XSS.
    noSniff: true,

    // 🌐 Desactiva la resolución anticipada de DNS (dns-prefetch), lo cual puede usarse para mitigar ciertas fugas de información.
    dnsPrefetchControl: { allow: false },

    // 📜 Indica que no se permiten políticas de dominios cruzados (usadas en Flash o PDF antiguos). Protege de comportamientos no deseados.
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },

    // 🕶️ Elimina la cabecera `X-Powered-By: Express` para no revelar que usás Express, evitando que atacantes automaticen exploits conocidos.
    hidePoweredBy: true,
};