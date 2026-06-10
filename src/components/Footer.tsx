import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
              <span className="text-2xl">🧸</span> Ropa Unicolor
            </h3>
            <p className="text-secondary-400 text-sm leading-relaxed">
              Ropa infantil de calidad, cómoda y moderna. Precios justos con descuentos por volumen.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm text-secondary-400">
              <li><a href="/como-comprar" className="hover:text-white transition-colors">Cómo Comprar</a></li>
              <li><a href="/preguntas-frecuentes" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="/politica-devoluciones" className="hover:text-white transition-colors">Política de Devoluciones</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-secondary-400">
              <li>📱 +56 9 XXXX XXXX</li>
              <li>📧 contacto@ropaunicolor.cl</li>
              <li>📍 Santiago, Chile</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary-700 mt-8 pt-8 text-center text-sm text-secondary-500">
          &copy; {new Date().getFullYear()} Ropa Unicolor. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
