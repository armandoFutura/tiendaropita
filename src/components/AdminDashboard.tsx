import React, { useState } from 'react';
import { productos as initialProductos, categorias } from '../lib/productos-data';
import type { Producto, TipoTalla } from '../lib/types';
import { formatPrecio, getTipoTallaLabel } from '../lib/utils';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'productos' | 'ordenes' | 'stock'>('productos');
  const [productos, setProductos] = useState<Producto[]>(initialProductos);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [showForm, setShowForm] = useState(false);

  const tabs = [
    { id: 'productos' as const, label: 'Productos', icon: '👕' },
    { id: 'ordenes' as const, label: 'Órdenes', icon: '📋' },
    { id: 'stock' as const, label: 'Stock', icon: '📦' },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-8 border-b pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
                : 'text-secondary-500 hover:text-secondary-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'productos' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Gestión de Productos</h2>
            <button
              onClick={() => { setEditingProduct(null); setShowForm(true); }}
              className="btn-primary !py-2 !px-4 text-sm"
            >
              + Nuevo Producto
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">{editingProduct ? 'Editar' : 'Nuevo'} Producto</h3>
                  <button onClick={() => setShowForm(false)} className="p-2 hover:bg-secondary-100 rounded-lg">✕</button>
                </div>
                <ProductForm
                  producto={editingProduct}
                  onSave={(p) => {
                    if (editingProduct) {
                      setProductos(productos.map(prod => prod.id === p.id ? p : prod));
                    } else {
                      setProductos([...productos, { ...p, id: Date.now(), created_at: new Date().toISOString() }]);
                    }
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-secondary-500">
                  <th className="pb-3 font-medium">Producto</th>
                  <th className="pb-3 font-medium">Categoría</th>
                  <th className="pb-3 font-medium">Precio Minorista</th>
                  <th className="pb-3 font-medium">Precio Mayorista</th>
                  <th className="pb-3 font-medium">Tallas</th>
                  <th className="pb-3 font-medium">Colores</th>
                  <th className="pb-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.filter(p => p.activo).map((prod) => (
                  <tr key={prod.id} className="border-b hover:bg-secondary-50">
                    <td className="py-3 font-medium">{prod.nombre}</td>
                    <td className="py-3 text-secondary-500 capitalize">{prod.categoria}</td>
                    <td className="py-3">{formatPrecio(prod.precio_minorista)}</td>
                    <td className="py-3">{formatPrecio(prod.precio_mayorista)}</td>
                    <td className="py-3">{prod.tallas.join(', ')} <span className="text-xs text-secondary-400">({getTipoTallaLabel(prod.tipoTalla)})</span></td>
                    <td className="py-3">{prod.colores.join(', ')}</td>
                    <td className="py-3">
                      <button
                        onClick={() => { setEditingProduct(prod); setShowForm(true); }}
                        className="text-primary-600 hover:underline mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setProductos(productos.map(p => p.id === prod.id ? { ...p, activo: false } : p))}
                        className="text-red-500 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ordenes' && (
        <div>
          <h2 className="text-xl font-bold mb-6">Gestión de Órdenes</h2>
          <div className="bg-secondary-50 rounded-xl p-8 text-center">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-secondary-500 mb-2">Las órdenes se cargarán desde Supabase cuando esté configurado.</p>
            <p className="text-sm text-secondary-400">Conecta tu base de datos Supabase para ver y gestionar las órdenes recibidas.</p>
          </div>
        </div>
      )}

      {activeTab === 'stock' && (
        <div>
          <h2 className="text-xl font-bold mb-6">Gestión de Stock</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-secondary-500">
                  <th className="pb-3 font-medium">Producto</th>
                  <th className="pb-3 font-medium">Talla</th>
                  <th className="pb-3 font-medium">Color</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos.filter(p => p.activo).flatMap(prod =>
                  prod.tallas.flatMap(talla =>
                    prod.colores.map(color => ({
                      producto: prod.nombre,
                      talla,
                      color,
                      cantidad: 50,
                    }))
                  )
                ).slice(0, 20).map((item, i) => (
                  <tr key={i} className="border-b hover:bg-secondary-50">
                    <td className="py-3 font-medium">{item.producto}</td>
                    <td className="py-3">{item.talla}</td>
                    <td className="py-3">{item.color}</td>
                    <td className="py-3">
                      <span className={`badge ${item.cantidad > 10 ? 'bg-green-100 text-green-700' : item.cantidad > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {item.cantidad} unid.
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-primary-600 hover:underline text-sm">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductForm({
  producto,
  onSave,
  onCancel,
}: {
  producto: Producto | null;
  onSave: (p: Producto) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio_minorista: producto?.precio_minorista || 0,
    precio_mayorista: producto?.precio_mayorista || 0,
    categoria: producto?.categoria || 'poleras',
    tipoTalla: producto?.tipoTalla || 'letras',
    tallas: producto?.tallas.join(', ') || '',
    colores: producto?.colores.join(', ') || '',
    imagenes: producto?.imagenes.join('\n') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: producto?.id || 0,
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio_minorista: form.precio_minorista,
      precio_mayorista: form.precio_mayorista,
      categoria: form.categoria,
      tipoTalla: form.tipoTalla as TipoTalla,
      tallas: form.tallas.split(',').map(s => s.trim()).filter(Boolean),
      colores: form.colores.split(',').map(s => s.trim()).filter(Boolean),
      imagenes: form.imagenes.split('\n').map(s => s.trim()).filter(Boolean),
      activo: true,
      created_at: producto?.created_at || new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre del producto</label>
        <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="input-field" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="input-field" rows={3} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Precio Minorista ($)</label>
          <input type="number" value={form.precio_minorista} onChange={e => setForm({ ...form, precio_minorista: Number(e.target.value) })} className="input-field" required min={0} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Precio Mayorista ($)</label>
          <input type="number" value={form.precio_mayorista} onChange={e => setForm({ ...form, precio_mayorista: Number(e.target.value) })} className="input-field" required min={0} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Categoría</label>
        <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className="input-field">
          {categorias.filter(c => c.id !== 'todas').map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Formato de Talla</label>
        <select value={form.tipoTalla} onChange={e => setForm({ ...form, tipoTalla: e.target.value })} className="input-field">
          <option value="letras">Letras (S-M-L-XL) — Adulto</option>
          <option value="numeros">Números (2-4-6-8-10-12) — Niño</option>
          <option value="cm">Centímetros (90-100-110) — Bebé</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tallas (separadas por coma)</label>
        <input type="text" value={form.tallas} onChange={e => setForm({ ...form, tallas: e.target.value })} className="input-field" placeholder={
          form.tipoTalla === 'letras' ? 'XS, S, M, L, XL' :
          form.tipoTalla === 'numeros' ? '2, 4, 6, 8, 10, 12' :
          '90, 100, 110, 120, 130'
        } />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Colores (separados por coma)</label>
        <input type="text" value={form.colores} onChange={e => setForm({ ...form, colores: e.target.value })} className="input-field" placeholder="Blanco, Negro, Gris" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">URLs de imágenes (una por línea)</label>
        <textarea value={form.imagenes} onChange={e => setForm({ ...form, imagenes: e.target.value })} className="input-field" rows={3} placeholder="https://..." />
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" className="btn-primary flex-1">
          {producto ? 'Guardar cambios' : 'Crear producto'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancelar</button>
      </div>
    </form>
  );
}
