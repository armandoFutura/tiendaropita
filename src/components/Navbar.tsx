import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem('tiendaropita_carrito');
        if (stored) {
          const items = JSON.parse(stored);
          setItemCount(items.reduce((sum: number, item: { cantidad: number }) => sum + item.cantidad, 0));
        }
      } catch { /* ignore */ }
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('cart-update', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cart-update', updateCount);
    };
  }, []);

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/como-comprar', label: 'Cómo Comprar' },
    { href: '/preguntas-frecuentes', label: 'FAQ' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-secondary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧸</span>
            <span className="font-bold text-xl text-secondary-900">Ropa Unicolor</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/carrito"
              className="relative btn-primary !py-2 !px-4 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              Carrito
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary-100"
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-secondary-100 pt-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-secondary-600 hover:text-primary-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/carrito"
              className="block mt-2 btn-primary text-center"
              onClick={() => setMenuOpen(false)}
            >
              Carrito ({itemCount})
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
