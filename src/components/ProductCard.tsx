import React from 'react';
import type { Producto } from '../lib/types';
import { formatPrecio } from '../lib/utils';

interface Props {
  producto: Producto;
}

export default function ProductCard({ producto }: Props) {
  return (
    <a href={`/producto/${producto.id}`} className="card group">
      <div className="aspect-[4/5] overflow-hidden bg-secondary-50">
        <img
          src={producto.imagenes[0]}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
          {producto.categoria}
        </span>
        <h3 className="font-semibold text-secondary-800 mt-1 group-hover:text-primary-600 transition-colors">
          {producto.nombre}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-secondary-900">
            {formatPrecio(producto.precio_minorista)}
          </span>
          <span className="text-xs text-secondary-400">
            · Mayorista: {formatPrecio(producto.precio_mayorista)} (3+)
          </span>
        </div>
      </div>
    </a>
  );
}
