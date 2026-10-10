import React from 'react';

const Inicio = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-4">
        Proyecto de tienda web
      </span>
      <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
        Bienvenido a nuestra <span className="text-emerald-400">Tienda virtual</span>
      </h1>
      <p className="text-base text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        Aprende a consumir APIs reales, gestionar estados asíncronos y construir navegación multipágina sin recargas usando React.
      </p>

      {/* Tarjetas de acceso rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto text-left">
        {/* Tarjeta 1: Laptops */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all">
          <span className="text-3xl mb-3 block">💻</span>
          <h3 className="text-white font-bold text-base mb-1">Catálogo Laptops</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Equipos de cómputo y portátiles consultados en vivo desde la API de DummyJSON.
          </p>
        </div>

        {/* Tarjeta 2: Smartphones */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all">
          <span className="text-3xl mb-3 block">📱</span>
          <h3 className="text-white font-bold text-base mb-1">Catálogo Smartphones</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Teléfonos inteligentes y dispositivos móviles de última generación.
          </p>
        </div>
        

        {/* Tarjeta 3: Accesorios (Nuevo) */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all">
          <span className="text-3xl mb-3 block">🎧</span>
          <h3 className="text-white font-bold text-base mb-1">Accesorios y Audio</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Auriculares, smartwatches y complementos ideales para tus dispositivos.
          </p>
        </div>

        {/* Tarjeta 4: Ofertas / Destacados (Nuevo) */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all">
          <span className="text-3xl mb-3 block">⚡</span>
          <h3 className="text-white font-bold text-base mb-1">Ofertas Especiales</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Descubre descuentos exclusivos y productos con envíos rápidos.
          </p>
        </div>
        {/* Tarjeta 4: Ofertas / Destacados (Nuevo) */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all">
          <span className="text-3xl mb-3 block">⚡</span>
          <h3 className="text-white font-bold text-base mb-1">Ofertas Especiales</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Descubre descuentos exclusivos y productos con envíos rápidos.
          </p>
        </div>
        {/* Tarjeta 4: Ofertas / Destacados (Nuevo) */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all">
          <span className="text-3xl mb-3 block">⚡</span>
          <h3 className="text-white font-bold text-base mb-1">Ofertas Especiales</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Descubre descuentos exclusivos y productos con envíos rápidos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inicio;