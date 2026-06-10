# 🧸 Ropa Unicolor - Tienda Online

Sistema de e-commerce para tienda de ropa infantil con descuentos por cantidad mayorista y finalización de compra por WhatsApp.

## Stack Tecnológico

- **Frontend:** Astro + React + Tailwind CSS
- **Base de datos:** Supabase (PostgreSQL)
- **Hosting:** Vercel / Netlify (frontend estático)

## Estructura del Proyecto

```
src/
├── components/       # Componentes React
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductDetailClient.tsx
│   ├── CartPage.tsx
│   ├── CartDrawer.tsx
│   ├── CheckoutForm.tsx
│   └── AdminDashboard.tsx
├── layouts/
│   └── BaseLayout.astro
├── lib/
│   ├── types.ts           # Tipos TypeScript
│   ├── config.ts          # Configuración (WhatsApp, etc.)
│   ├── utils.ts           # Utilidades (precios, validación, WhatsApp)
│   ├── supabase.ts        # Cliente Supabase
│   ├── carrito-context.tsx # Contexto del carrito
│   └── productos-data.ts  # Datos locales de productos
├── pages/
│   ├── index.astro               # Inicio
│   ├── catalogo.astro            # Catálogo
│   ├── carrito.astro             # Carrito
│   ├── checkout.astro            # Checkout
│   ├── como-comprar.astro        # Cómo comprar
│   ├── preguntas-frecuentes.astro # FAQ
│   ├── politica-devoluciones.astro # Política devoluciones
│   ├── producto/[id].astro       # Detalle producto
│   └── admin/index.astro         # Panel admin
├── styles/
│   └── global.css
├── supabase-schema.sql    # Esquema BD
├── supabase-seed.sql      # Datos de ejemplo
└── blueexpress-ejemplo.csv # CSV para BlueExpress
```

## Funcionalidades

### Catálogo de Productos
- Grid responsivo (2, 3, 4 columnas según dispositivo)
- Filtro por categorías
- Precios minorista y mayorista visibles siempre

### Carrito de Compras
- Selección de talla, color y cantidad
- Descuento mayorista automático (3+ unidades del mismo modelo)
- Editar cantidad, eliminar línea, vaciar carrito
- Persistencia en localStorage

### Checkout
- Formulario con validación de datos (RUT chileno, teléfono, email)
- Selección de método de pago
- Integración con WhatsApp (mensaje pre-rellenado)
- Opción de copiar mensaje al portapapeles

### Panel Administrativo
- Gestión de productos (CRUD)
- Vista de órdenes (preparada para Supabase)
- Control de stock

## Instalación y Desarrollo

```bash
npm install
npm run dev      # Inicia servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Vista previa del build
```

## Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env`:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
PUBLIC_WHATSAPP_NUMBER=+569XXXXXXXX
```

### 2. WhatsApp

El número de WhatsApp se configura en `src/lib/config.ts` o mediante la variable de entorno `PUBLIC_WHATSAPP_NUMBER`.

### 3. Supabase (Opcional)

Para habilitar la persistencia de órdenes:

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta `supabase-schema.sql` en el SQL Editor
3. (Opcional) Ejecuta `supabase-seed.sql` para datos de ejemplo
4. Configura las variables de entorno

Sin Supabase, el sitio funciona completo con datos locales. Las órdenes solo se envían por WhatsApp.

### 4. BlueExpress

El archivo `blueexpress-ejemplo.csv` muestra el formato para despachos.

## Despliegue en Vercel

```bash
npm i -g vercel
vercel
```

O conecta el repositorio directamente desde [vercel.com](https://vercel.com).

## Panel Administrativo

Accede a `/admin` para gestionar productos y órdenes.

### Gestión de Productos
- **Agregar:** Click en "+ Nuevo Producto", llenar el formulario
- **Editar:** Click en "Editar" en la tabla
- **Eliminar:** Click en "Eliminar" (desactiva, no borra)

### Órdenes
- Se muestran cuando Supabase está configurado
- Estados: Pendiente pago → Pagado → Despachado → Entregado

## Rutas del Sitio

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio con destacados |
| `/catalogo` | Todos los productos |
| `/catalogo?categoria=poleras` | Filtro por categoría |
| `/producto/1` | Detalle de producto |
| `/carrito` | Carrito de compras |
| `/checkout` | Finalizar compra |
| `/como-comprar` | Instrucciones |
| `/preguntas-frecuentes` | FAQ |
| `/politica-devoluciones` | Política de cambios |
| `/admin` | Panel administrativo |
