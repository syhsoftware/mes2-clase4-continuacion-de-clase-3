import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalPro from './ModalPro';

// Función utilitaria para dar formato de moneda profesional
const formatoPrecio = (monto) => {
  return `$ ${Number(monto).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const Cardpro = ({ item }) => {
  // Estado local para controlar la visibilidad del modal de vista rápida
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1.5 hover:border-emerald-500/40 transition-all duration-300 flex flex-col min-w-0">
        {/* Imagen con Aspect Ratio, zoom al hover y badge de rating */}
        <div className="relative overflow-hidden aspect-video bg-black/40">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-slate-950/80 backdrop-blur-md text-amber-300 border border-slate-700/60 px-2.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {item.rating}
            </span>
          </div>
        </div>

        {/* Contenido de la Tarjeta */}
        <div className="p-5 flex flex-col flex-grow">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
            {item.category}
          </span>

          {/* Título enlazado a la página de Detalle */}
          <Link
            to={`/detalle/${item.id}`}
            className="font-bold text-white text-base mb-2 line-clamp-1 group-hover:text-emerald-300 transition-colors no-underline"
          >
            {item.title}
          </Link>

          <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed flex-grow">
            {item.description}
          </p>

          {/* Precio y Botones de Acción Dual (Vista Rápida + Ir a Detalle) */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-auto gap-2">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Precio</span>
              <span className="text-lg font-black text-white">{formatoPrecio(item.price)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Botón 1: Abre el Modal de Vista Rápida en la misma pantalla */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-1 cursor-pointer"
                title="Vista rápida del producto"
              >
                <span>👁️</span>
                <span className="hidden sm:inline">Rápida</span>
              </button>

              {/* Botón 2: Navega a la página completa con useParams */}
              <Link
                to={`/detalle/${item.id}`}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 no-underline"
              >
                Detalle
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Renderizado condicional del modal: solo existe si isModalOpen es true */}
      {isModalOpen && (
        <ModalPro item={item} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default Cardpro;