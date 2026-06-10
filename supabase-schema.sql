-- Esquema de Base de Datos para Ropa Unicolor
-- Ejecutar en SQL Editor de Supabase

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  precio_minorista INTEGER NOT NULL,
  precio_mayorista INTEGER NOT NULL,
  imagenes TEXT[] NOT NULL DEFAULT '{}',
  tallas TEXT[] NOT NULL DEFAULT '{}',
  colores TEXT[] NOT NULL DEFAULT '{}',
  categoria TEXT NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de stock
CREATE TABLE IF NOT EXISTS stock (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  producto_id BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  talla TEXT NOT NULL,
  color TEXT NOT NULL,
  cantidad_disponible INTEGER NOT NULL DEFAULT 0
);

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS ordenes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  orden_id TEXT NOT NULL UNIQUE,
  cliente_nombre TEXT NOT NULL,
  cliente_apellido TEXT NOT NULL,
  cliente_rut TEXT NOT NULL,
  cliente_telefono TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  cliente_direccion TEXT NOT NULL,
  productos JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  descuento INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  metodo_pago TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente_pago' CHECK (estado IN ('pendiente_pago', 'pagado', 'despachado', 'entregado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_stock_producto ON stock(producto_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_orden_id ON ordenes(orden_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_estado ON ordenes(estado);

-- Configurar Row Level Security
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (público puede leer productos y stock)
CREATE POLICY "Productos públicos lectura" ON productos FOR SELECT USING (true);
CREATE POLICY "Stock público lectura" ON stock FOR SELECT USING (true);
CREATE POLICY "Órdenes insert público" ON ordenes FOR INSERT WITH CHECK (true);

-- Políticas de administración (solo service_role puede escribir)
CREATE POLICY "Admin productos escritura" ON productos FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin stock escritura" ON stock FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin ordenes lectura" ON ordenes FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Admin ordenes update" ON ordenes FOR UPDATE USING (auth.role() = 'service_role');
