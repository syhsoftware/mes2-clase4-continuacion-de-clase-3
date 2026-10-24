import React, { useEffect } from 'react';

const ModalPro = ({ item, onClose }) => {
  // 1. Hook al inicio (cumple con las Reglas de Hooks de React)
  // Cerrar el modal con la tecla Escape (Buena práctica de accesibilidad)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 2. Early return después de todos los hooks
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* 1. Backdrop oscuro desenfocado: al hacer clic afuera, se cierra */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 2. Contenedor principal del Modal */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col md:flex-row z-10">
        
        {/* Botón de cierre en la esquina superior */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full p-2 transition-colors cursor-pointer"
          title="Cerrar ventana"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Sección Izquierda: Imagen destacada */}
        <div className="w-full md:w-1/2 bg-black/40 flex items-center justify-center p-6 relative">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full max-h-72 object-contain drop-shadow-2xl"
          />
          <span className="absolute bottom-4 left-4 bg-slate-950/90 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-800 uppercase tracking-widest">
            {item.category}
          </span>
        </div>

        {/* Sección Derecha: Información y atributos */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-black text-white mb-2 leading-tight pr-6">
              {item.title}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              {item.description}
            </p>

            {/* Badges de Atributos */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                ⭐ {item.rating}
              </span>
              {item.brand && (
                <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full text-xs font-medium">
                  Marca: {item.brand}
                </span>
              )}
              {item.stock > 0 && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-medium">
                  En Stock ({item.stock})
                </span>
              )}
            </div>
          </div>

          {/* Precio y Botón de Acción */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Precio Final</span>
              <span className="text-3xl font-black text-emerald-400">$ {item.price}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                alert(`¡Excelente elección! Agregado: ${item.title}`);
                onClose();
              }}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              Comprar Ahora
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModalPro;