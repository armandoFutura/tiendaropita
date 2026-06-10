import React from 'react';
import { useCarrito } from '../lib/carrito-context';
import { calcularCarrito, formatPrecio } from '../lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { state, dispatch } = useCarrito();
  const { items, subtotal, descuento, total } = calcularCarrito(state.items);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-white h-full flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Carrito</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary-100 rounded-lg" aria-label="Cerrar">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-secondary-400">
              <p className="text-4xl mb-4">🛒</p>
              <p>Tu carrito está vacío</p>
              <a href="/catalogo" className="btn-primary inline-block mt-4" onClick={onClose}>
                Ver productos
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 p-3 bg-secondary-50 rounded-xl">
                  <img
                    src={item.producto.imagenes[0]}
                    alt={item.producto.nombre}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.producto.nombre}</h4>
                    <p className="text-xs text-secondary-500">
                      Talla: {item.talla} · Color: {item.color}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => dispatch({ type: 'ACTUALIZAR_CANTIDAD', payload: { index, cantidad: item.cantidad - 1 } })}
                        className="w-7 h-7 rounded-full bg-secondary-200 flex items-center justify-center text-sm font-medium hover:bg-secondary-300"
                        aria-label="Reducir cantidad"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => dispatch({ type: 'ACTUALIZAR_CANTIDAD', payload: { index, cantidad: item.cantidad + 1 } })}
                        className="w-7 h-7 rounded-full bg-secondary-200 flex items-center justify-center text-sm font-medium hover:bg-secondary-300"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold">
                        {formatPrecio(item.subtotal)}
                      </span>
                      {item.cantidad >= 3 && (
                        <span className="badge bg-green-100 text-green-700 text-[10px]">
                          Mayorista
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-secondary-400">
                      {formatPrecio(item.precioUnitario)} c/u
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'ELIMINAR', payload: { index } })}
                    className="text-secondary-400 hover:text-red-500 self-start p-1"
                    aria-label="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3">
            <div className="space-y-1 text-sm">
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
            <div className="flex gap-2">
              <button
                onClick={() => dispatch({ type: 'VACIAR' })}
                className="btn-secondary !py-2 text-sm flex-1"
              >
                Vaciar
              </button>
              <a href="/checkout" className="btn-primary text-center text-sm flex-1" onClick={onClose}>
                Ir a pagar
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
