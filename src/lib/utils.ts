import { MAYORISTA_MIN } from './config';
import type { CarritoItem } from './types';

export function formatPrecio(precio: number): string {
  return `$${precio.toLocaleString('es-CL')}`;
}

export function calcularPrecioItem(item: CarritoItem): { precioUnitario: number; subtotal: number } {
  const precioUnitario = item.cantidad >= MAYORISTA_MIN
    ? item.producto.precio_mayorista
    : item.producto.precio_minorista;
  return { precioUnitario, subtotal: precioUnitario * item.cantidad };
}

export function calcularCarrito(items: CarritoItem[]): {
  items: (CarritoItem & { precioUnitario: number; subtotal: number })[];
  subtotal: number;
  descuento: number;
  total: number;
} {
  const itemsCalculados = items.map(item => {
    const { precioUnitario, subtotal } = calcularPrecioItem(item);
    const precioMinoristaTotal = item.producto.precio_minorista * item.cantidad;
    return {
      ...item,
      precioUnitario,
      subtotal,
      descuentoItem: Math.max(0, precioMinoristaTotal - subtotal),
    };
  });

  const subtotal = itemsCalculados.reduce((sum, item) => sum + item.producto.precio_minorista * item.cantidad, 0);
  const total = itemsCalculados.reduce((sum, item) => sum + item.subtotal, 0);
  const descuento = subtotal - total;

  return {
    items: itemsCalculados,
    subtotal,
    descuento,
    total,
  };
}

export function generateOrdenId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `RU-${date}-${rand}`;
}

export function validateRut(rut: string): boolean {
  const clean = rut.replace(/\./g, '').replace(/-/g, '');
  if (clean.length < 2) return false;
  const dv = clean.slice(-1).toUpperCase();
  const cuerpo = clean.slice(0, -1);
  if (!/^\d+$/.test(cuerpo)) return false;
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const dvEsperado = 11 - (suma % 11);
  const dvChar = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : String(dvEsperado);
  return dvChar === dv;
}

export function validatePhone(phone: string): boolean {
  return /^\+56\s?9\s?\d{4}\s?\d{4}$/.test(phone.trim());
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function generateWhatsAppMessage(data: {
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  email: string;
  direccion: string;
  items: { producto: string; talla: string; color: string; cantidad: number; subtotal: number }[];
  subtotal: number;
  descuento: number;
  total: number;
  metodoPago: string;
  ordenId: string;
}): string {
  const lines = [
    `🧸 *Resumen de Pedido - Ropa Unicolor*`,
    `━━━━━━━━━━━━━━━━━━`,
    ``,
    `*Orden:* ${data.ordenId}`,
    `*Cliente:* ${data.nombre} ${data.apellido}`,
    `*RUT:* ${data.rut}`,
    `*Teléfono:* ${data.telefono}`,
    `*Email:* ${data.email}`,
    ``,
    `*DIRECCIÓN DE ENVÍO:*`,
    `${data.direccion}`,
    ``,
    `*PRODUCTOS:*`,
    ...data.items.map(
      (item) => `• ${item.producto} - Talla ${item.talla} Color ${item.color} × ${item.cantidad} = $${item.subtotal.toLocaleString('es-CL')}`
    ),
    ``,
    `*Subtotal:* $${data.subtotal.toLocaleString('es-CL')}`,
    data.descuento > 0 ? `*Descuento aplicado:* -$${data.descuento.toLocaleString('es-CL')}` : '',
    `*TOTAL A PAGAR:* $${data.total.toLocaleString('es-CL')}`,
    ``,
    `*Método de pago:* ${data.metodoPago}`,
    ``,
    `¡Gracias por tu compra! 🎉`,
  ].filter(Boolean);

  return lines.join('\n');
}

export function openWhatsApp(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${phone.replace(/[^0-9]/g, '')}&text=${encoded}`;
}
