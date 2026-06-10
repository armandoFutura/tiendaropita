import React, { useState } from 'react';
import type { Producto } from '../lib/types';
import { formatPrecio, calcularPrecioItem } from '../lib/utils';
import { useCarrito, CarritoProvider } from '../lib/carrito-context';
import { MAYORISTA_MIN } from '../lib/config';

interface Props {
  producto: Producto;
}

function ProductDetailInner({ producto }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedTalla, setSelectedTalla] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [added, setAdded] = useState(false);
  const { dispatch } = useCarrito();

  const handleAdd = () => {
    if (!selectedTalla || !selectedColor) return;
    dispatch({
      type: 'AGREGAR',
      payload: { producto, talla: selectedTalla, color: selectedColor, cantidad },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const mockItem = { producto, talla: selectedTalla, color: selectedColor, cantidad };
  const { precioUnitario, subtotal } = calcularPrecioItem(mockItem);
  const esMayorista = cantidad >= MAYORISTA_MIN;

  const canAdd = selectedTalla && selectedColor;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-secondary-50 mb-4">
          <img
            src={producto.imagenes[selectedImage]}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-3">
          {producto.imagenes.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                i === selectedImage ? 'border-primary-500' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
          {producto.categoria}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold mt-1">{producto.nombre}</h1>
        <p className="text-secondary-500 mt-3 leading-relaxed">{producto.descripcion}</p>

        <div className="mt-6 p-4 bg-secondary-50 rounded-xl">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-secondary-900">
              {formatPrecio(producto.precio_minorista)}
            </span>
            <span className="text-sm text-secondary-400">c/u</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="badge bg-primary-100 text-primary-700 font-medium">
              Mayorista: {formatPrecio(producto.precio_mayorista)} c/u
            </span>
            <span className="text-secondary-400">(desde {MAYORISTA_MIN} unidades)</span>
          </div>
        </div>

        {esMayorista && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-700 text-sm font-medium">
              🎉 Descuento mayorista aplicado: {formatPrecio(producto.precio_minorista - producto.precio_mayorista)} de ahorro por unidad
            </p>
          </div>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-secondary-700 mb-2">Talla</label>
          <div className="flex flex-wrap gap-2">
            {producto.tallas.map((talla) => (
              <button
                key={talla}
                onClick={() => setSelectedTalla(talla)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedTalla === talla
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-200 text-secondary-600 hover:border-secondary-400'
                }`}
              >
                {talla}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-secondary-700 mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {producto.colores.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedColor === color
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-200 text-secondary-600 hover:border-secondary-400'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-secondary-700 mb-2">Cantidad</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center font-medium hover:bg-secondary-200"
              aria-label="Reducir"
            >
              -
            </button>
            <span className="text-xl font-semibold w-8 text-center">{cantidad}</span>
            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center font-medium hover:bg-secondary-200"
              aria-label="Aumentar"
            >
              +
            </button>
          </div>
        </div>

        {canAdd && (
          <div className="mt-4 p-3 bg-secondary-50 rounded-xl">
            <div className="flex justify-between text-sm">
              <span>Precio unitario:</span>
              <span className="font-medium">{formatPrecio(precioUnitario)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-1">
              <span>Subtotal:</span>
              <span>{formatPrecio(subtotal)}</span>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="btn-primary w-full text-lg flex items-center justify-center gap-2"
          >
            {added ? (
              <>✅ Agregado al carrito</>
            ) : (
              <>Agregar al carrito</>
            )}
          </button>
          <a
            href={canAdd ? `/checkout?quick=${producto.id}&talla=${selectedTalla}&color=${selectedColor}&cantidad=${cantidad}` : '#'}
            className={`btn-outline w-full text-center block ${!canAdd ? 'opacity-50 pointer-events-none' : ''}`}
          >
            Comprar ahora
          </a>
        </div>

        {!canAdd && (
          <p className="text-xs text-secondary-400 mt-2 text-center">
            Selecciona talla y color para agregar al carrito
          </p>
        )}
      </div>
    </div>
  );
}

export default function ProductDetailClient(props: Props) {
  return (
    <CarritoProvider>
      <ProductDetailInner {...props} />
    </CarritoProvider>
  );
}
