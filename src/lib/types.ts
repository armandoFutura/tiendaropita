export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_minorista: number;
  precio_mayorista: number;
  imagenes: string[];
  tallas: string[];
  colores: string[];
  categoria: string;
  activo: boolean;
  created_at: string;
}

export interface Stock {
  id: number;
  producto_id: number;
  talla: string;
  color: string;
  cantidad_disponible: number;
}

export interface Orden {
  id: number;
  orden_id: string;
  cliente_nombre: string;
  cliente_apellido: string;
  cliente_rut: string;
  cliente_telefono: string;
  cliente_email: string;
  cliente_direccion: string;
  productos: CarritoItem[];
  subtotal: number;
  descuento: number;
  total: number;
  metodo_pago: string;
  estado: 'pendiente_pago' | 'pagado' | 'despachado' | 'entregado';
  created_at: string;
}

export interface CarritoItem {
  producto: Producto;
  talla: string;
  color: string;
  cantidad: number;
}

export interface Database {
  public: {
    Tables: {
      productos: {
        Row: Producto;
        Insert: Omit<Producto, 'id' | 'created_at'>;
        Update: Partial<Omit<Producto, 'id' | 'created_at'>>;
      };
      stock: {
        Row: Stock;
        Insert: Omit<Stock, 'id'>;
        Update: Partial<Omit<Stock, 'id'>>;
      };
      ordenes: {
        Row: Orden;
        Insert: Omit<Orden, 'id' | 'created_at'>;
        Update: Partial<Omit<Orden, 'id' | 'created_at'>>;
      };
    };
  };
}
