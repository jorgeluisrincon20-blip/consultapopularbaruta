# Dashboard CIE · Baruta

Proyecto React (Vite + Tailwind) listo para publicar en Netlify.

## Opción A — La más fácil (arrastrar y soltar, sin instalar nada más que Node)

1. Instala [Node.js](https://nodejs.org) (versión 18 o superior) si no lo tienes.
2. Abre una terminal dentro de esta carpeta y ejecuta:
   ```bash
   npm install
   npm run build
   ```
   Esto crea una carpeta `dist/` con la web ya lista (HTML, CSS y JS compilados).
3. Ve a [app.netlify.com/drop](https://app.netlify.com/drop)
4. Arrastra la carpeta `dist` a la zona de "drop"
5. Netlify te da al instante una URL pública (algo como `https://nombre-al-azar.netlify.app`). Desde el panel puedes cambiarle el nombre o conectar un dominio propio.

## Opción B — Con Git (recomendado si vas a seguir editando)

1. Sube esta carpeta completa a un repositorio de GitHub (puedes arrastrarla directo en github.com > "Add file" > "Upload files", o usar `git`).
2. En [app.netlify.com](https://app.netlify.com) → **"Add new site" → "Import an existing project"** → conecta tu cuenta de GitHub y elige el repositorio.
3. Netlify detecta automáticamente el archivo `netlify.toml` incluido aquí, que ya trae configurado:
   - Comando de build: `npm run build`
   - Carpeta a publicar: `dist`
4. Dale a **"Deploy site"**. Cada vez que subas cambios al repositorio, Netlify vuelve a publicar automáticamente.

## Estructura del proyecto

```
baruta-netlify/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── netlify.toml
└── src/
    ├── main.jsx
    ├── index.css
    └── App.jsx      ← aquí está todo el dashboard
```

## Editar el dashboard

Todo el código (datos, componentes, pestañas) vive en `src/App.jsx`. Para editar cifras, metas o agregar unidades, busca los arreglos `RAW_UNITS` y `RAW_MESAS` al inicio del archivo.
