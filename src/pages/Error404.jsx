import React from 'react';

const Error404 = ({ onVolverInicio }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 text-center bg-slate-950">
      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Detalle visual decorativo de fondo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Código de error destacado */}
        <span className="px-3.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-6">
          Error 404
        </span>

        {/* Icono animado */}
        <div className="text-6xl mb-4 animate-bounce">
          🔍
        </div>

        {/* Título */}
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
          Página no <span className="text-emerald-400">encontrada</span>
        </h1>

        {/* Descripción */}
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          Lo sentimos, la página que buscas no existe, ha sido movida o la URL es incorrecta.
        </p>

        {/* Botón de acción para regresar */}
        <button
          onClick={onVolverInicio}
          className="w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>←</span> Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default Error404;