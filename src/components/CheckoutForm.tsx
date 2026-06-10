import React, { useState } from 'react';
import { useCarrito, CarritoProvider } from '../lib/carrito-context';
import { calcularCarrito, formatPrecio, openWhatsApp, generateWhatsAppMessage, generateOrdenId, validateRut, validatePhone, validateEmail } from '../lib/utils';
import { WHATSAPP_NUMBER, METODOS_PAGO } from '../lib/config';
import { supabase } from '../lib/supabase';

function CheckoutContent() {
  const { state, dispatch } = useCarrito();
  const { items, subtotal, descuento, total } = calcularCarrito(state.items);

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    telefono: '',
    email: '',
    direccion: '',
  });
  const [metodoPago, setMetodoPago] = useState('transferencia');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [ordenId, setOrdenId] = useState('');

  if (items.length === 0 && !completed) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-6">🛒</p>
        <h2 className="text-xl font-semibold text-secondary-700 mb-2">Tu carrito está vacío</h2>
        <p className="text-secondary-500 mb-6">Agrega productos antes de comprar</p>
        <a href="/catalogo" className="btn-primary inline-block">Ver catálogo</a>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.nombre.trim()) errs.nombre = 'Requerido';
    if (!form.apellido.trim()) errs.apellido = 'Requerido';
    if (!form.rut.trim()) errs.rut = 'Requerido';
    else if (!validateRut(form.rut)) errs.rut = 'RUT inválido';
    if (!form.telefono.trim()) errs.telefono = 'Requerido';
    else if (!validatePhone(form.telefono)) errs.telefono = 'Formato: +56 9XXXXXXXX';
    if (!form.email.trim()) errs.email = 'Requerido';
    else if (!validateEmail(form.email)) errs.email = 'Email inválido';
    if (!form.direccion.trim()) errs.direccion = 'Requerido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const id = generateOrdenId();
    setOrdenId(id);

    const whatsAppData = {
      nombre: form.nombre,
      apellido: form.apellido,
      rut: form.rut,
      telefono: form.telefono,
      email: form.email,
      direccion: form.direccion,
      items: items.map((item) => ({
        producto: item.producto.nombre,
        talla: item.talla,
        color: item.color,
        cantidad: item.cantidad,
        subtotal: item.subtotal,
      })),
      subtotal,
      descuento,
      total,
      metodoPago: METODOS_PAGO.find(m => m.id === metodoPago)?.label || metodoPago,
      ordenId: id,
    };

    const message = generateWhatsAppMessage(whatsAppData);
    const waUrl = openWhatsApp(WHATSAPP_NUMBER, message);

    try {
      await supabase.from('ordenes').insert({
        orden_id: id,
        cliente_nombre: form.nombre,
        cliente_apellido: form.apellido,
        cliente_rut: form.rut,
        cliente_telefono: form.telefono,
        cliente_email: form.email,
        cliente_direccion: form.direccion,
        productos: items,
        subtotal,
        descuento,
        total,
        metodo_pago: metodoPago,
        estado: 'pendiente_pago',
      });
    } catch (e) {
      console.warn('Error guardando orden en BD:', e);
    }

    setCompleted(true);
    setSubmitting(false);
    dispatch({ type: 'VACIAR' });

    window.open(waUrl, '_blank');
  };

  if (completed) {
    return (
      <div className="max-w-lg mx-auto text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">¡Pedido Listo!</h2>
        <p className="text-secondary-500 mb-4">
          Orden <strong>{ordenId}</strong>
        </p>
        <p className="text-secondary-600 mb-6">
          Se ha abierto WhatsApp con tu pedido pre-rellenado. Solo envía el mensaje para confirmar.
        </p>
        <div className="bg-secondary-50 rounded-xl p-4 text-left text-sm font-mono whitespace-pre-wrap mb-6">
          {generateWhatsAppMessage({
            nombre: form.nombre,
            apellido: form.apellido,
            rut: form.rut,
            telefono: form.telefono,
            email: form.email,
            direccion: form.direccion,
            items: items.map((item) => ({
              producto: item.producto.nombre,
              talla: item.talla,
              color: item.color,
              cantidad: item.cantidad,
              subtotal: item.subtotal,
            })),
            subtotal,
            descuento,
            total,
            metodoPago: METODOS_PAGO.find(m => m.id === metodoPago)?.label || metodoPago,
            ordenId,
          })}
        </div>
        <button
          onClick={() => {
            const msg = generateWhatsAppMessage({
              nombre: form.nombre,
              apellido: form.apellido,
              rut: form.rut,
              telefono: form.telefono,
              email: form.email,
              direccion: form.direccion,
              items: items.map((item) => ({
                producto: item.producto.nombre,
                talla: item.talla,
                color: item.color,
                cantidad: item.cantidad,
                subtotal: item.subtotal,
              })),
              subtotal,
              descuento,
              total,
              metodoPago: METODOS_PAGO.find(m => m.id === metodoPago)?.label || metodoPago,
              ordenId,
            });
            navigator.clipboard.writeText(msg);
          }}
          className="btn-secondary mb-3 w-full"
        >
          📋 Copiar mensaje
        </button>
        <a href="/catalogo" className="btn-outline block text-center">
          Seguir comprando
        </a>
      </div>
    );
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="grid md:grid-cols-5 gap-8">
      <div className="md:col-span-3">
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-6">Datos del Cliente</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Nombre *</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => updateField('nombre', e.target.value)}
                className={`input-field ${errors.nombre ? 'ring-2 ring-red-500' : ''}`}
                placeholder="Nombre"
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Apellido *</label>
              <input
                type="text"
                value={form.apellido}
                onChange={(e) => updateField('apellido', e.target.value)}
                className={`input-field ${errors.apellido ? 'ring-2 ring-red-500' : ''}`}
                placeholder="Apellido"
              />
              {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-secondary-700 mb-1">RUT *</label>
            <input
              type="text"
              value={form.rut}
              onChange={(e) => updateField('rut', e.target.value)}
              className={`input-field ${errors.rut ? 'ring-2 ring-red-500' : ''}`}
              placeholder="12.345.678-9"
            />
            {errors.rut && <p className="text-red-500 text-xs mt-1">{errors.rut}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Teléfono *</label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => updateField('telefono', e.target.value)}
                className={`input-field ${errors.telefono ? 'ring-2 ring-red-500' : ''}`}
                placeholder="+56 9XXXXXXXX"
              />
              {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`input-field ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                placeholder="correo@ejemplo.cl"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Dirección completa * <span className="text-secondary-400 font-normal">(calle, número, depto, ciudad, región)</span>
            </label>
            <textarea
              value={form.direccion}
              onChange={(e) => updateField('direccion', e.target.value)}
              className={`input-field resize-none ${errors.direccion ? 'ring-2 ring-red-500' : ''}`}
              rows={3}
              placeholder="Av. Siempre Viva 123, Depto 42, Santiago, Región Metropolitana"
            />
            {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>}
          </div>
        </div>

        <div className="card p-6 mt-6">
          <h2 className="text-lg font-bold mb-4">Método de Pago</h2>
          <div className="space-y-3">
            {METODOS_PAGO.map((mp) => (
              <label
                key={mp.id}
                className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  metodoPago === mp.id ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-400'
                }`}
              >
                <input
                  type="radio"
                  name="metodoPago"
                  value={mp.id}
                  checked={metodoPago === mp.id}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    metodoPago === mp.id ? 'border-primary-500' : 'border-secondary-400'
                  }`}>
                    {metodoPago === mp.id && <div className="w-3 h-3 rounded-full bg-primary-500" />}
                  </div>
                  <div>
                    <p className="font-medium">{mp.label}</p>
                    <p className="text-sm text-secondary-500">{mp.desc}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="card p-6 sticky top-24">
          <h3 className="font-bold text-lg mb-4">Resumen de Pedido</h3>
          <div className="space-y-3 mb-6">
            {items.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <img src={item.producto.imagenes[0]} alt="" className="w-14 h-14 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.producto.nombre}</p>
                  <p className="text-xs text-secondary-400">
                    {item.talla} · {item.color} · ×{item.cantidad}
                  </p>
                  <p className="font-medium">{formatPrecio(item.subtotal)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between">
              <span className="text-secondary-500">Subtotal</span>
              <span>{formatPrecio(subtotal)}</span>
            </div>
            {descuento > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento mayorista</span>
                <span>-{formatPrecio(descuento)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{formatPrecio(total)}</span>
            </div>
          </div>

          <div className="mt-6 p-3 bg-amber-50 rounded-xl text-sm text-amber-700">
            <p>⚠️ El pago se gestiona por WhatsApp. Te enviaremos los datos para transferir o un link de pago.</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>Procesando...</>
            ) : (
              <>
                💬 Finalizar compra por WhatsApp
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutForm() {
  return (
    <CarritoProvider>
      <CheckoutContent />
    </CarritoProvider>
  );
}
