# REMARK — Agencia de Mercadeo (Venezuela)

Landing page premium para **REMARK**, una agencia de marketing creativo.
_"Let's make something remarkable."_

Sitio de una sola página con fondo negro, tipografía de marca, animaciones de
entrada por sección y elementos decorativos (blobs de color) que reaccionan al
movimiento del mouse para dar una sensación moderna, sofisticada e interactiva.

---

## ✨ Características

- **Tema oscuro global** unificado (`#0D0D0D`) sin costuras entre secciones.
- **Hero interactivo**: los blobs de color flotan en idle y hacen _parallax_
  suave siguiendo el mouse (con profundidad por capa).
- **Statement** con efecto _typing_, texto en blanco y subrayado rojo de marca.
- **Servicios** en acordeón, con blobs reactivos al color del servicio activo.
- **Preloader** con flashes de color de marca que funde a negro hacia el Hero.
- **Cursor personalizado**, barra de progreso de scroll y navbar flotante.
- **Accesibilidad y performance**: respeta `prefers-reduced-motion`, los
  listeners de mouse solo se activan en desktop con puntero fino, y el motion
  usa `transform` + `will-change` para mantenerse en el compositor (GPU).

---

## 🧱 Stack

| Capa             | Tecnología                          |
| ---------------- | ----------------------------------- |
| Framework        | [Next.js 14](https://nextjs.org/) (App Router) |
| UI               | [React 18](https://react.dev/) + TypeScript |
| Estilos          | [Tailwind CSS 3](https://tailwindcss.com/) + CSS custom properties |
| Animación        | [Framer Motion 12](https://www.framer.com/motion/) |
| Íconos           | [lucide-react](https://lucide.dev/) |
| Tipografías      | Nimora (display) + Poppins (texto), self-hosted |

---

## 📁 Estructura del proyecto

```
.
├── app/
│   ├── components/
│   │   ├── Hero.tsx          # Hero + blobs con parallax de mouse
│   │   ├── Statement.tsx     # Frase con typing + subrayado rojo
│   │   ├── Services.tsx      # Acordeón de servicios + blobs reactivos
│   │   ├── Navbar.tsx        # Navbar flotante + overlay móvil
│   │   ├── Preloader.tsx     # Intro de flashes de color → negro
│   │   ├── SiteChrome.tsx    # Client boundary (preloader/nav/cursor)
│   │   ├── ScrollProgress.tsx
│   │   └── CustomCursor.tsx
│   ├── globals.css           # Tokens, @font-face, resets, helpers
│   ├── layout.tsx            # Metadata + RootLayout (Server Component)
│   └── page.tsx              # Composición de la home
├── lib/
│   └── design-tokens.ts      # Tokens de diseño tipados para JS/Framer Motion
├── public/
│   ├── assets/               # logos, brushstrokes, mascots, mascot-skate.webm
│   └── fonts/                # Nimora + Poppins
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Requisitos

- **Node.js 18.18+** (recomendado Node 20/22)
- **npm** (incluido con Node)

## 📦 Instalación

```bash
git clone https://github.com/danielacohengarber-star/remark-agenciamercadeo-venezuela.git
cd remark-agenciamercadeo-venezuela
npm install
```

## 💻 Correr en local (desarrollo)

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El servidor recarga en
caliente al guardar cambios.

## 🏗️ Build de producción

```bash
npm run build   # compila y verifica tipos
npm run start   # sirve el build optimizado (por defecto en :3000)
```

## 🧰 Scripts disponibles

| Script          | Descripción                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Servidor de desarrollo (hot reload)  |
| `npm run build` | Build de producción + type-check     |
| `npm run start` | Sirve el build de producción         |
| `npm run lint`  | Linter de Next.js                    |

---

## 🎨 Notas de diseño

- **Fondo negro como base.** Un único token (`--bg-base: #0D0D0D`) gobierna
  todas las secciones para evitar inconsistencias tonales. El sistema de color
  es _dark-first_; los tokens de superficie clara solo los usa el navbar
  flotante.
- **Paleta de marca exacta** (sin sustituciones): rojo `#D6272E`, amarillo
  `#FFB719`, azul `#72C3D7`, naranja `#DE5829`, rosa `#EBB2BB`.
- **Blobs (bulbs) en dos capas.** El movimiento se compone anidando dos
  `motion.div`: la capa externa aplica el _parallax_ del mouse (spring suave) y
  la interna la flotación en idle. Así ambos transforms se suman en vez de
  pisarse. Cada blob tiene un factor de `depth` distinto para crear profundidad.
- **Statement.** Texto en blanco con subrayados de color en las palabras clave;
  la frase de cierre se escribe en blanco y recibe el _subrayado en rojo_ —el
  gesto de marca ("re-mark" = subrayar/destacar)—.
- **Servicios.** Los blobs se mantienen pero se integran con una vignette radial
  que los asienta sobre el negro, mejora el _layering_ y protege la legibilidad;
  además adoptan el color del servicio en hover/activo.
- **Motion responsable.** Todo respeta `prefers-reduced-motion`; en mobile/touch
  no se registran listeners de mouse (solo flotación ligera o estado estático).

---

## 📝 Licencia

Proyecto privado de REMARK. Todos los derechos reservados.
