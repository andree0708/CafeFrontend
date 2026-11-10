# CafeFrontend

Interfaz React del sistema CaféIA. Permite registrar fincas y lotes, capturar variables de producción, evaluar catas SCA, ejecutar análisis de IA, ver factores SHAP, comparar mercados y consultar el estado del modelo.

## Stack

- React 18
- Vite 5
- React Router 6
- React Hook Form
- Tailwind CSS
- Recharts
- Lucide React

## Inicio

```powershell
npm install
npm run dev
```

Abre <http://localhost:5173>.

El backend debe estar en `http://localhost:3000`. Si usas otra URL:

```powershell
Copy-Item .env.example .env
# edita VITE_API_URL
```

## Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualiza el build |

## Páginas

### Productor

| Ruta | Página |
| --- | --- |
| `/dashboard` | Resumen |
| `/farms` | Fincas |
| `/farms/:id` | Detalle de finca |
| `/batches` | Lotes |
| `/batches/:id` | Detalle, variables, cata, predicción, SHAP, mercados e historial |
| `/predictions` | Análisis rápido |
| `/compare` | Comparación de lotes |
| `/model` | Estado y métricas del modelo |
| `/settings` | Cuenta |

### Administración

| Ruta | Página |
| --- | --- |
| `/admin` | Resumen |
| `/admin/producers` | Productores |
| `/admin/farms` | Fincas |
| `/admin/batches` | Lotes |
| `/admin/predictions` | Análisis |
| `/admin/reports` | Reportes |

## Estructura

```text
src/
├── components/
│   ├── layout/        # Sidebar y layout
│   └── ui/            # Badge, Modal, Toast, FactorBars, MarketBars, ...
├── context/
│   ├── AuthContext.jsx
│   └── DataContext.jsx
├── lib/
│   ├── api.js         # Cliente HTTP + traducción de errores
│   └── labels.js      # Etiquetas, parseo y mapeo de datos
└── pages/
    ├── auth/
    ├── producer/
    └── admin/
```

## Variables de entorno

| Variable | Default | Descripción |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000` | URL del backend |

## Build

```powershell
npm run build
```

El resultado queda en `dist/`. Para desplegar con Nginx se incluye `nginx.conf` con fallback SPA.

## Docker

```powershell
docker build --build-arg VITE_API_URL=http://localhost:3000 -t cafeia-frontend .
docker run -p 5173:80 cafeia-frontend
```

## Documentación

- [`../docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)
- [`../docs/API.md`](../docs/API.md)
- [`../docs/DEPLOYMENT.md`](../docs/DEPLOYMENT.md)
