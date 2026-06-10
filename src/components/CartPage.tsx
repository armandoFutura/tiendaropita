import React from 'react';
import { useCarrito, CarritoProvider } from '../lib/carrito-context';
import { calcularCarrito, formatPrecio } from '../lib/utils';

function CartContent() {
  const { state, dispatch } = useCarrito();
  const { items, subtotal, descuento, total } = calcularCarrito(state.items);

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-6">🛒</p>
        <h2 className="text-xl font-semibold text-secondary-700 mb-2">Tu carrito está vacío</h2>
        <p className="text-secondary-500 mb-6">Agrega productos para empezar tu compra</p>
        <a href="/catalogo" className="btn-primary inline-block">Ver catálogo</a>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="card p-4 flex gap-4">
            <img
              src={item.producto.imagenes[0]}
              alt={item.producto.nombre}
              className="w-24 h-24 object-cover rounded-xl"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{item.producto.nombre}</h3>
              <p className="text-sm text-secondary-500">
                Talla: {item.talla} · Color: {item.color}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => dispatch({ type: 'ACTUALIZAR_CANTIDAD', payload: { index, cantidad: item.cantidad - 1 } })}
                  className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center hover:bg-secondary-200"
                >
                  -
                </button>
                <span className="font-medium w-8 text-center">{item.cantidad}</span>
                <button
                  onClick={() => dispatch({ type: 'ACTUALIZAR_CANTIDAD', payload: { index, cantidad: item.cantidad + 1 } })}
                  className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center hover:bg-secondary-200"
                >
                  +
                </button>
              </div>
              {item.cantidad >= 3 && (
                <span className="badge bg-green-100 text-green-700 mt-1">Precio mayorista</span>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold">{formatPrecio(item.subtotal)}</p>
              <p className="text-xs text-secondary-400">{formatPrecio(item.precioUnitario)} c/u</p>
              <button
                onClick={() => dispatch({ type: 'ELIMINAR', payload: { index } })}
                className="text-red-500 text-sm mt-2 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => dispatch({ type: 'VACIAR' })}
          className="text-secondary-500 text-sm hover:text-red-500"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="card p-6 h-fit sticky top-24">
        <h3 className="font-bold text-lg mb-4">Resumen</h3>
        <div className="space-y-2 text-sm">
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
          <div className="flex justify-between font-bold text-lg pt-3 border-t">
            <span>Total</span>
            <span>{formatPrecio(total)}</span>
          </div>
        </div>
        <a href="/checkout" className="btn-primary w-full text-center mt-6 block">
          Proceder al pago
        </a>
        <a href="/catalogo" className="btn-secondary w-full text-center mt-2 block text-sm">
          Seguir comprando
        </a>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <CarritoProvider>
      <CartContent />
    </CarritoProvider>
  );
}
