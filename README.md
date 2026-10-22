# Asteria Cheer

> Cada sueño es una estrella que nos impulsa a avanzar.

Portal web desarrollado para la Guía de Laboratorio 4 de la asignatura Herramientas de Programación 3 de la I.U. Pascual Bravo. Seleccioné la temática deportiva y la enfoqué en el porrismo, disciplina en la que tengo experiencia como deportista. Para el proyecto diseñé Asteria Cheer, un club ficticio ubicado en Medellín, con identidad visual, categorías, horarios y uniforme propios.

- **Sitio publicado:** https://valen-17.github.io/asteria-cheer-valentina-perez/
- **Autora:** Valentina Alejandra Pérez Cardona

## Tecnologías

- **HTML5 semántico:** las cinco páginas utilizan las etiquetas `header`, `nav`, `main`, `section`, `article`, `aside` y `footer`.
- **CSS3:** hoja de estilos propia (`css/style.css`) con variables en `:root` para colores y tipografías, y distribución con Flexbox y CSS Grid.
- **Bootstrap 5.3 y Bootstrap Icons:** incorporados desde CDN y adaptados a la paleta del proyecto.
- **JavaScript:** desarrollado sin librerías adicionales, con módulos ES y organizado bajo el patrón MVC. Los modelos contienen los datos y las reglas de validación, las vistas actualizan la página y los controladores gestionan los eventos que conectan ambas capas.

## Estructura del proyecto

```
asteria-cheer/
├── index.html          Inicio: portada con cuenta regresiva, cifras, categorías y carrusel
├── informacion.html    El porrismo: definición, niveles de dificultad, seguridad y glosario
├── galeria.html        Galería: carrusel, fotografías con filtros y visor, uniforme y video con subtítulos
├── tabla.html          Equipos: categorías, tabla de horarios y niveles, sede de entrenamiento
├── contacto.html       Inscripción: formulario con validación en tiempo real
├── css/style.css       Hoja de estilos y variables de diseño
├── js/
│   ├── script.js       Punto de entrada; carga cada controlador solo en la página que lo requiere
│   ├── model/          Datos y reglas de validación
│   ├── view/           Presentación en la página (errores, mensajes y fotografías)
│   └── controller/     Gestión de eventos entre modelo y vista
├── parciales/          Menú, pie de página y recursos del <head> comunes a las cinco páginas
├── img/                Imágenes optimizadas en formatos AVIF y WebP
├── video/              Video de la rutina y archivo de subtítulos
├── originales/         Archivos fuente sin optimizar (excluidos del repositorio)
├── tests/              Pruebas unitarias
└── scripts/            Scripts de apoyo: verificación de la rúbrica, optimización de imágenes y parciales
```

## Identidad visual

La paleta se compone de morado, negro y dorado.

| Variable | Color | Uso |
|---|---|---|
| `--color-morado` | `#4c007d` | Títulos, enlaces y fondos destacados |
| `--color-dorado` | `#d4af37` | Botones, bordes y detalles sobre fondo oscuro |
| `--color-negro` | `#121212` | Menú, pie de página y secciones oscuras |
| `--color-fondo` | `#f7f5fa` | Fondo general |

Para los títulos utilicé Barlow Condensed en cursiva, inspirada en la tipografía de los uniformes deportivos. Montserrat se emplea en el menú y los botones, y Nunito en el texto. Verifiqué el contraste de las combinaciones de color según las pautas WCAG; por esta razón, el dorado no se usa como color de texto sobre fondos claros y, en esos casos, se emplea `--color-dorado-oscuro`.

## Ejecución en local

Requisitos: Node.js 22 o superior y Git.

Instalación de dependencias:

```bash
npm install
```

El sitio debe abrirse con la extensión Live Server de Visual Studio Code, ya que los módulos de JavaScript no se ejecutan al abrir los archivos directamente desde el explorador.

| Comando | Función |
|---|---|
| `npm run lint` | Valida el HTML, el CSS y el JavaScript |
| `npm run check:rubrica` | Verifica que cada página cumpla la estructura exigida en la rúbrica |
| `npm run check:rubrica:final` | Verifica, además, los mínimos de contenido (galería, tabla, cards y formulario) |
| `npm run parciales` | Copia el menú, el pie de página y los recursos de `parciales/` en las cinco páginas |
| `npm run check:parciales` | Comprueba que las cinco páginas estén sincronizadas con `parciales/` |
| `npm test` | Ejecuta las pruebas unitarias |
| `npm run imagenes -- originales/galeria/*.jpg` | Genera versiones AVIF y WebP (480, 800 y 1200 px) sin metadatos EXIF; con `--anchos 320,480,640` se definen otros tamaños |
| `npm run validate` | Ejecuta todas las verificaciones anteriores, excepto la final |

## Bloques comunes (parciales)

El menú, el pie de página y los recursos comunes del `<head>` se definen una sola vez en la carpeta `parciales/`. Para modificarlos:

1. Editar el archivo correspondiente en `parciales/`.
2. Ejecutar `npm run parciales`.
3. Las cinco páginas se actualizan automáticamente y el menú señala en cada una la página activa.

Cada página conserva su HTML completo, tal como lo exige la rúbrica. El contenido ubicado entre `<!-- parcial:… -->` y `<!-- /parcial:… -->` no debe editarse directamente en las páginas, ya que se sobrescribe.

## Metodología de trabajo

1. Durante las primeras etapas desarrollé cada funcionalidad en una rama independiente y la integré a `main` mediante pull requests; en la etapa final realicé los ajustes directamente sobre `main`.
2. Los mensajes de commit siguen la convención de prefijos (`feat:`, `fix:`, `style:`, `docs:`) para mantener un historial legible.
3. Antes de cada commit se ejecutan automáticamente los validadores y las pruebas mediante Husky y lint-staged; si alguna verificación falla, el commit no se registra.
4. En GitHub, un pipeline de GitHub Actions repite las verificaciones: HTML, CSS, JavaScript, rúbrica, pruebas unitarias, validador oficial de la W3C y Lighthouse (accesibilidad, buenas prácticas y SEO).
5. Una vez superadas las verificaciones, GitHub Pages publica el sitio.

## Créditos de imágenes

El club, sus deportistas y el uniforme son ficticios. Todo el material visual del sitio fue generado con inteligencia artificial para este proyecto:

- Logo e isotipo.
- Diseño conceptual del uniforme (frente, espalda, moño y uniforme completo).
- Fotografías de las categorías (Mini, Junior, Senior y Open), de las campeonas en el podio, de la pirámide en el gimnasio, del lanzamiento y de gimnasia.
- Video de la rutina.
