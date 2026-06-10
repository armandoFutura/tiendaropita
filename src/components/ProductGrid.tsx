import React from 'react';
import type { Producto } from '../lib/types';
import ProductCard from './ProductCard';

interface Props {
  productos: Producto[];
  categoria: string;
  categorias: { id: string; label: string }[];
}

export default function ProductGrid({ productos, categoria, categorias }: Props) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {categorias.map((cat) => (
          <a
            key={cat.id}
            href={cat.id === 'todas' ? '/catalogo' : `/catalogo?categoria=${cat.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              (categoria === cat.id) || (categoria === 'todas' && cat.id === 'todas')
                ? 'bg-primary-500 text-white'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
          >
            {cat.label}
          </a>
        ))}
      </div>

      {productos.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-secondary-400 text-lg">No hay productos en esta categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
