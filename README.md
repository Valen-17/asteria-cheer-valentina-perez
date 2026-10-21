# Asteria Cheer

> Cada sueño es una estrella que nos impulsa a avanzar.

Portal web de **Asteria Cheer**, club de porrismo ficticio en Medellín. Proyecto académico de la asignatura Herramientas de Programación 3 (I.U. Pascual Bravo).

- **Sitio publicado:** https://valen-17.github.io/asteria-cheer-valentina-perez/
- **Autora:** Valentina Pérez

## Tecnologías

- HTML5 semántico
- CSS3 propio (`css/style.css`) con variables en `:root`, Flexbox y Grid
- Bootstrap 5.3 y Bootstrap Icons (CDN)
- JavaScript puro con módulos ES, organizado con el patrón MVC

## Estructura

```
asteria-cheer/
├── index.html          Inicio: hero, categorías, próxima competencia
├── informacion.html    El porrismo: qué es, niveles, seguridad
├── galeria.html        Galería de fotos y video
├── tabla.html          Equipos, edades, niveles y horarios
├── contacto.html       Formulario de inscripción con validación
├── css/style.css       Estilos propios y tokens de diseño
├── js/
│   ├── script.js       Punto de entrada
│   ├── model/          Datos y reglas de validación
│   ├── view/           Mensajes y estados en el DOM
│   └── controller/     Eventos que unen modelo y vista
├── parciales/          Menú, pie de página y recursos del <head> comunes a las 5 páginas
├── img/                Imágenes optimizadas (WebP/JPG) que usa el sitio
├── originales/         Archivos fuente sin optimizar (no se suben al repositorio)
├── tests/              Pruebas unitarias del modelo
└── scripts/            Verificación automática de la rúbrica
```

## Identidad visual

| Token | Color | Uso |
|---|---|---|
| `--color-morado` | `#4c007d` | Hero, títulos, enlaces |
| `--color-dorado` | `#d4af37` | Botones, bordes y detalles sobre fondo oscuro |
| `--color-negro` | `#121212` | Navegación y pie de página |
| `--color-fondo` | `#f7f5fa` | Fondo general |

Tipografías: Montserrat (títulos) y Nunito (texto). El dorado nunca se usa como texto sobre fondo claro (contraste insuficiente); para eso existe `--color-dorado-oscuro`.

## Cómo trabajar en local

Requisitos: Node.js 22 o superior y Git.

```bash
npm install
```

Abrir el sitio con la extensión Live Server de VS Code (los módulos de JavaScript no funcionan abriendo el archivo con doble clic).

| Comando | Qué hace |
|---|---|
| `npm run lint` | Valida HTML, CSS y JavaScript |
| `npm run check:rubrica` | Revisa la estructura que exige la rúbrica en cada página |
| `npm run check:rubrica:final` | Además exige los mínimos de contenido (galería, tabla, cards, formulario) |
| `npm run parciales` | Copia `parciales/menu.html`, `pie.html` y `recursos.html` dentro de las 5 páginas y marca la página activa del menú |
| `npm run check:parciales` | Verifica que las páginas estén sincronizadas con `parciales/` (también corre antes de cada commit y en el pipeline) |
| `npm test` | Pruebas unitarias |
| `npm run imagenes -- originales/galeria/*.jpg` | Genera versiones AVIF y WebP (480, 800 y 1200 px) en `img/`, sin metadatos EXIF, e imprime el `<picture>` listo para copiar. Con `--anchos 320,480,640` se eligen otros anchos |
| `npm run validate` | Todo lo anterior (excepto el chequeo final) |

## Bloques comunes (parciales)

El menú, el pie de página y los enlaces comunes del `<head>` se escriben **una sola vez** en `parciales/`. Para cambiarlos:

1. Edita el archivo en `parciales/`.
2. Ejecuta `npm run parciales`.
3. Las 5 páginas se actualizan; cada una sigue teniendo su HTML completo (lo que exige la rúbrica).

No edites a mano lo que está entre `<!-- parcial:… -->` y `<!-- /parcial:… -->` en las páginas: se sobrescribe.

## Flujo de trabajo

1. Crear una rama desde `main`: `feature/<pagina>` o `fix/<descripcion>`.
2. Hacer commits pequeños con mensajes convencionales (`feat:`, `fix:`, `style:`, `docs:`, `test:`).
   Antes de cada commit se ejecutan automáticamente los validadores (Husky + lint-staged).
3. Abrir un pull request hacia `main` y completar el checklist de la plantilla.
4. El pipeline de GitHub Actions valida HTML, CSS, JavaScript, la rúbrica, las pruebas, el validador oficial W3C y Lighthouse.
5. Con el pipeline en verde se fusiona; GitHub Pages publica el sitio automáticamente.

## Créditos de imágenes

- Logo e isotipo: generados con IA para este proyecto.
- Uniforme 2026 (frente, espalda y moño en la galería): diseño conceptual generado con IA.

- Fotos de categorías (Mini, Junior, Senior, Open), campeonas en el podio (y su recorte de detalle), pirámide en el gimnasio, lanzamiento, gimnasia, moño y uniforme completo: generadas con IA para este proyecto.
