# BeServices WordPress — Context Document

> **Para cualquier sesión nueva** (Claude Code u otro agente): lee este archivo antes de tocar nada. Contiene todo lo que se ha investigado, los errores encontrados y las soluciones para operar la web sin romper cosas ni gastar tokens en reruns.

---

## 📌 Estado del proyecto (última actualización: 14 abril 2026)

| Página | Estado | Notas |
|--------|--------|-------|
| `/contacto/` (ID=104) | ✅ Restaurada al original | Ver nota crítica abajo |
| `/bepartner/` (ID=106) | ✅ Actualizada | Textos BeCloud → BeCenter actualizados |
| Casos de éxito (6 posts) | ✅ Actualizados | BeCloud→BeCenter, BeCloud Datacenter→BeDataCenter |
| Ficha BeDataCenter (ID=6957) | ✅ Actualizada | Título cambiado |
| `/contacto2/` (ID=7899) | ⚠️ Descartada | Prueba antigua de Antigravity, ignorar |
| Resto del sitio | 🔄 Pendiente rediseño masivo | Ver sección "Plan futuro" abajo |

> ⚠️ **NOTA /contacto/ (14 abril 2026)**: La página fue dañada en múltiples intentos de edición via MCP. Restaurada desde backup del 13/04. El hero usa imagen de `pruebas.beservices.es` (staging) — no carga la imagen pero la página funciona. El rediseño del contacto se hará en Web Interna primero.

### Terminología de producto (ya aplicado)
- `BeCloud` / `Becloud` → **BeCenter**
- `Becloud Datacenter` / `Becloud datacenter` → **BeDataCenter**
- ⚠️ URLs (slugs) conservan "becloud" intencionadamente para no romper enlaces

---

## 🔌 Conexión MCP WordPress

```
URL:   https://beservices.es/wp-json/mcp/v1/http
Token: beservices-claude-2026-token-seguro
Plugin: AI Engine (Meow) — habilitar en Settings > MCP Server
```

**Desde Claude Code:** usar el skill `/beservices-wp` al inicio de cada sesión.

**Llamada curl directa:**
```bash
curl -s -X POST https://beservices.es/wp-json/mcp/v1/http \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer beservices-claude-2026-token-seguro" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"TOOL","arguments":{}}}'
```

---

## 🚨 REGLAS CRÍTICAS — Leer antes de cualquier edición

### 1. El MCP aplica `stripslashes()` a los meta values
**Este es el error más importante descubierto.**

El plugin AI Engine llama internamente a `wp_unslash()` / `stripslashes()` sobre los valores que se guardan vía `wp_update_post_meta` o `wp_update_post`. Esto significa que los backslashes en los valores se eliminan al guardar:

- `\"` (comilla escapada en JSON) → `"` (comilla sin escapar) → **JSON roto**
- `\\` (backslash literal) → `\` → puede romper rutas o expresiones

**SOLUCIÓN OBLIGATORIA para guardar `_elementor_data` o cualquier JSON con backslashes:**
```python
BACKSLASH = chr(92)
# 1. Generar el JSON correcto
ed_correct = json.dumps(data, ensure_ascii=False, separators=(',',':'))
# 2. Doblar todos los backslashes antes de enviar al MCP
ed_for_mcp = ed_correct.replace(BACKSLASH, BACKSLASH + BACKSLASH)
# 3. Enviar ed_for_mcp — después de stripslashes queda ed_correct ✅
```

Sin este paso, el JSON se corrompe silenciosamente y Elementor no puede renderizar la página (500 error).

### 2. Elementor vs post_content
- Páginas con Elementor: contenido en meta `_elementor_data`, NO en `post_content`
- `_elementor_edit_mode` debe ser `"builder"` para que Elementor renderice
- Para desactivar Elementor en una página: poner `_elementor_edit_mode` a `""`
- Elementor guarda `_elementor_page_settings` como PHP serializado — si se corrompe, la página da 500

### 3. WP Rocket — comportamiento y peligros
- WP Rocket cachea las respuestas 200. Si la página estaba en cache antes de un error, el cache oculta el 500
- Al tocar un post (`wp_alter_post` en el título), WP Rocket purga el cache de esa URL
- Si el cache se purga y la página tiene Elementor data corrupta → 500 visible
- Para verificar sin cache: añadir `?nowprocket=1` a la URL
- WP Rocket NO se puede configurar fácilmente via MCP (opción `wp_rocket_settings` no accesible con `wp_get_option`)
- WP Rocket versión instalada: **3.20.3**

### 4. Tailwind CDN NO funciona en WordPress
WP Rocket bloquea el procesamiento de Tailwind CDN. Nunca usar clases Tailwind en páginas WordPress.

✅ Usar: inline styles + `<style>` block scoped bajo ID único  
❌ No usar: `class="grid lg:grid-cols-2 gap-8"` (no procesará)

### 5. Paginación MCP
`wp_get_posts` devuelve **máximo 10 resultados** aunque se pida `posts_per_page: -1`. Usar `offset` para paginar:
```json
{"post_type": "casos-de-exito", "posts_per_page": 10, "offset": 0}
{"post_type": "casos-de-exito", "posts_per_page": 10, "offset": 10}
```

### 6. Parámetros MCP en mayúsculas
Usar `ID` (mayúsculas), nunca `id`, `post_id` ni `postId`.

### 7. Blog = HubSpot, no editar desde WP
Los posts del blog están sincronizados desde HubSpot. Editarlos desde WordPress no persiste.

### 8. NO modificar páginas de producción sin prueba previa
Siempre crear una página de prueba (draft) y validar antes de tocar producción. El incidente del 14 abril 2026 ocurrió por editar `/contacto/` (ID=104) directamente.

### 9. Herramienta de restauración de emergencia
Si se rompe una página, restaurar desde:
1. **Backup JSON local**: `Desktop/Web Beservices/Wordpress Beservices 2026/backup-completo-beservices-20260413.json`
2. **WP Umbrella**: `app.wp-umbrella.com` — backups automáticos del servidor completo

---

## 🔄 Workflow correcto para cambios en la web

### Flujo a seguir SIEMPRE:
```
1. DISEÑAR en Web Interna (local)
   └─ Crear/editar: Desktop/Web Beservices/Web Interna/nombre-pagina.html
   └─ Previsualizar en browser local antes de tocar WordPress

2. VALIDAR el diseño
   └─ Revisar en distintos tamaños de pantalla
   └─ Aprobar con Victor

3. CREAR PÁGINA DE PRUEBA en WordPress (nunca tocar prod directamente)
   └─ create_pages con status: "draft"
   └─ Subir contenido con update_pages

4. REVISAR EN WP
   └─ Limpiar cache WP Rocket manualmente
   └─ Verificar en incógnito (no en sesión logueada)

5. APROBAR y pasar a PRODUCCIÓN
   └─ update_pages en el ID de producción
   └─ Limpiar cache
```

### Estructura de carpetas locales:
```
Desktop/Web Beservices/
├── Web Interna/              ← AQUÍ se diseña todo antes de subir a WP
│   ├── index.html            ← Homepage referencia (sistema de diseño completo)
│   ├── linea-grafica.html    ← Brand book / guía visual
│   ├── contacto.html         ← Diseño referencia /contacto/ (con Tailwind)
│   ├── contacto-wp.html      ← Versión adaptada para WP (inline styles)
│   └── [nombre-pagina].html  ← Crear aquí nuevos diseños
│
└── Wordpress Beservices 2026/
    ├── Context.md            ← Este archivo — leer siempre al inicio
    ├── backup-completo-beservices-20260413.json  ← Backup JSON (8.6MB)
    └── mcp.json              ← Config MCP (también en ~/.claude/mcp.json)
```

---

## 🗺️ Plan futuro: Rediseño masivo de la web

### Contexto
La web actual está construida íntegramente con Elementor Pro. Hacer cambios via MCP en páginas Elementor es muy costoso en tokens, propenso a errores (JSON corruption, cache), y difícil de mantener. Después de las sesiones de prueba del 13-14 abril, se concluye:

**Elementor via MCP = muy complicado para cambios masivos.**

### Estrategia para el rediseño masivo
Cuando se decida hacer el rediseño completo, las opciones son:

**Opción A — Páginas nuevas sin Elementor (RECOMENDADA)**
- Crear páginas nuevas en WordPress usando solo `post_content` (HTML puro + inline styles)
- Desactivar Elementor por página: `_elementor_edit_mode = ""`
- Ventajas: control total, sin dependencias de Elementor, editable via MCP sin problemas de JSON corruption
- Workflow: diseñar en Web Interna → subir con `update_pages` + `content` → sin Elementor
- ⚠️ Nota: el tema Hello Elementor renderiza estilos básicos del tema aunque no use Elementor

**Opción B — Reemplazar Elementor con otro page builder**
- Migrar a Gutenberg (bloques nativos de WP) o Bricks Builder
- Más alineado con el estándar WordPress moderno
- Gutenberg se puede manipular más fácilmente via WP REST API

**Opción C — Editar Elementor con el truco del doble-backslash**
- Usar el workaround descubierto (doblar backslashes antes de enviar al MCP)
- Viable para cambios puntuales pero muy costoso en tokens para rediseño masivo
- NO recomendado para refactoring completo

### Para el diseño previo (Web Interna)
Todo el rediseño se diseña primero en `Web Interna/` usando el sistema de diseño BeServices:
- Sistema de diseño: `linea-grafica.html` y `index.html`
- Tipografía: Space Grotesk (titulares) + Inter (body)
- Colores: Navy `#001A41`, Cyan `#50cabf`
- Sin Tailwind CDN — usar inline styles o `<style>` scoped

---

## 🛠️ Herramientas MCP disponibles

| Tool | Para qué | Notas |
|------|----------|-------|
| `update_pages` | Actualizar `post_content` de una página | Params: `id`, `content`, `status` |
| `wp_update_post` | Actualizar campos + meta en una llamada | Params: `ID`, `post_content`, `meta_input` |
| `wp_update_post_meta` | Actualizar meta fields | Usar `meta: {}` object, no `meta_key`/`meta_value` |
| `wp_get_post_snapshot` | Ver todo el contenido + meta de un post | Más completo que `wp_get_post` |
| `wp_get_posts` | Listar posts. OJO: max 10 — usar `offset` | |
| `wp_alter_post` | Search & replace en `post_content`/`title`/`excerpt` | Solo campos de post, NO meta |
| `wp_upload_request` | Subir archivo local a Media Library | Genera URL temporal, usar con `curl -F` |
| `wp_get_option` | Leer opción de WordPress | OJO: no funciona con opciones serializadas (devuelve `false`) |

---

## 🎨 Sistema de diseño BeServices

### Tipografía
| Uso | Fuente | Peso | Tamaño |
|-----|--------|------|--------|
| Titulares display | Space Grotesk | 500 | `clamp(3.2rem, 5.5vw, 5.8rem)` |
| Titulares sección | Space Grotesk | 700 | `clamp(2rem, 3vw, 3rem)` |
| Body | Inter | 400 | `0.875rem – 1rem` |
| Overlines | Inter | 700 | `10px`, uppercase, `letter-spacing: 0.2em` |

**⚠️ NUNCA font-weight 900 ni 800. El estilo es editorial/ligero.**

### Colores
```css
--navy:    #001A41;  /* Principal, textos, fondos dark */
--cyan:    #50cabf;  /* Acento, overlines, iconos */
--blue:    #0075f2;  /* CTAs hover */
--gray:    #9CA3AF;  /* Textos secundarios */
--surface: #f3f4f5;  /* Fondos inputs */
--white:   #ffffff;
```

### CDN a incluir
```html
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css"/>
```

---

## 🏗️ Estructura WordPress

### CPTs
| Post Type | Descripción | Tiene Elementor |
|-----------|-------------|-----------------|
| `page` | Páginas estáticas | Sí (mayoría) |
| `casos-de-exito` | Casos de éxito | Sí |
| `fichas-de-productos` | Fichas técnicas | Sí |
| `servicios` | Páginas de servicios | Sí |
| `elementor_library` | Templates globales | N/A |
| `post` | Blog — ⚠️ SOLO DESDE HUBSPOT | No editar |

### Plugins clave
| Plugin | Función | Notas |
|--------|---------|-------|
| **Elementor Pro** | Page builder | La mayoría de páginas lo usan — complicado via MCP |
| **WP Rocket 3.20.3** | Caché | `wp_rocket_settings` no accesible via MCP |
| **AI Engine (Meow)** | Servidor MCP | Aplica `stripslashes()` a meta values |
| **WP Umbrella** | Backups | `app.wp-umbrella.com` |
| **HubSpot** | CRM + Blog | Blog sincronizado, no editar posts desde WP |

### Páginas clave (IDs)
| ID | URL | Estado |
|----|-----|--------|
| 104 | `/contacto/` | ✅ Original restaurado (14/04) |
| 1692 | `/` | Inicio — Elementor |
| 106 | `/bepartner/` | Textos actualizados |
| 108 | Template header | Logo blanco en header principal, color en sticky |
| 7899 | `/contacto2/` | ⚠️ Prueba antigua, ignorar |

### Header (template ID=108)
```
[2b707cd] header principal — sin background (transparente), logo blanco [fe318a9]
[bb3f281] header sticky — bg #F7F7F7E0, logo color [c230cdd]
```
El logo blanco es invisible en páginas con fondo blanco — la solución es un hero con imagen oscura al top.

---

## 📋 Historial de incidencias

| Fecha | Problema | Causa | Solución |
|-------|---------|-------|---------|
| 13/04/2026 | Tailwind CDN no procesa clases en WP | WP Rocket bloquea CDN | Reescribir con inline styles |
| 13/04/2026 | `wp_get_posts` devuelve max 10 | Limitación MCP | Usar `offset` para paginar |
| 13/04/2026 | Página /contacto/ con layout roto | `<style>` blocks corrompidos por wpautop | Todo inline styles en post_content |
| 13/04/2026 | Navbar invisible arriba del hero | Logo blanco sobre fondo blanco | Añadir imagen hero con fondo oscuro |
| 14/04/2026 | /contacto/ da 500 tras cambiar `_elementor_page_settings` | MCP aplicó stripslashes → PHP fatal al deserializar | Revertir a `a:0:{}` + restaurar desde backup |
| 14/04/2026 | `_elementor_data` siempre se guarda corrupto via MCP | AI Engine aplica `stripslashes()` a meta values | Pre-doblar backslashes antes de enviar al MCP |
| 14/04/2026 | WP Rocket daba 500 sin `?nowprocket=1` | Misma causa: Elementor data corrupta → PHP fatal dentro del buffer de WP Rocket | Restaurar `_elementor_data` válido |
| 14/04/2026 | `wp_get_option('wp_rocket_settings')` devuelve false | Opción PHP serializada no soportada por MCP | Configurar WP Rocket manualmente desde WP Admin |

---

## 🛡️ Skills disponibles (Claude Code)

| Skill | Cuándo usarla |
|-------|---------------|
| `/beservices-wp` | **Siempre al inicio** de sesiones con la web |
| `/stitch-design` | Para generar UI/componentes visuales |
| `/responsive-design` | Al diseñar cualquier página |
| `/web-quality-audit` | Antes de publicar en producción |
| `/seo` | Antes de publicar nueva página pública |
| `/enhance-prompt` | Para mejorar prompts complejos |
| `/caveman-compress` | Cuando el contexto de sesión esté lleno |

---

*Actualizado por Claude Code — 14 abril 2026*
