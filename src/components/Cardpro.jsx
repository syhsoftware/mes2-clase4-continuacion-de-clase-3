// =====================================================================
// ARCHIVO: src/components/Cardpro.jsx (CAMBIOS DE LA CLASE 2)
// ---------------------------------------------------------------------
// QUÉ HACE:
//   - Muestra el precio final con descuento.
//   - Si hay descuento, muestra el precio original tachado y el badge -%.
//   - Bloquea el botón Agregar cuando el producto no tiene stock.
//   - Mantiene el modal de vista rápida y el feedback "✓ Agregado".
//
// DATOS QUE USA DE DUMMYJSON:
//   price, discountPercentage, stock, thumbnail, category, rating, ...
// =====================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalConfirmacion from './ModalConfirmacion';
import { useCarrito } from '../context/CarritoContext';
import ModalPro from './ModalPro_old';

// ---------------------------------------------------------------------
// 1) FORMATEO DE PRECIOS EN DÓLARES
// Se usa para el precio final y para el precio original tachado.
// ---------------------------------------------------------------------
const formatoPrecio = (monto) =>
  '$ ' +
  Number(monto).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Cardpro = ({ item }) => {
  // -------------------------------------------------------------------
  // 2) DEL CONTEXTO SOLO NECESITAMOS DOS COSAS
  // - agregarAlCarrito: para el botón.
  // - calcularPrecio: para aplicar el descuento de DummyJSON.
  // -------------------------------------------------------------------
  const { agregarAlCarrito, calcularPrecio } = useCarrito();

  // Estado local para la vista rápida y el feedback del botón.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [added, setAdded] = useState(false);

  // -------------------------------------------------------------------
  // 3) VALORES DERIVADOS DE LA TARJETA
  // No se guardan con useState: se calculan a partir de item.
  // -------------------------------------------------------------------
  const precioFinal = calcularPrecio(item);
  const tieneDescuento = Number(item.discountPercentage) > 0;
  const agotado = Number(item.stock) <= 0;

  // -------------------------------------------------------------------
  // 4) AGREGAR AL CARRITO
  // El Context actualiza el estado global; added solo da feedback visual.
  // -------------------------------------------------------------------
  const handleAgregar = () => {
    agregarAlCarrito(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <>
      <div className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1.5 hover:border-emerald-500/40 transition-all duration-300 flex flex-col min-w-0">
        <div className="relative overflow-hidden aspect-video bg-black/40">
          {/* Imagen del producto */}
          <img
            src={item.thumbnail}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Rating de DummyJSON */}
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-slate-950/80 backdrop-blur-md text-amber-300 border border-slate-700/60 px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
              ⭐ {item.rating}
            </span>
          </div>

          {/* Badge de descuento: solo si discountPercentage es mayor que 0. */}
          {tieneDescuento && (
            <span className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[11px] font-black px-2 py-1 rounded-lg shadow-lg">
              -{Math.round(Number(item.discountPercentage))}%
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
            {item.category}
          </span>

          {/* El título lleva al detalle del producto. */}
          <Link
            to={'/detalle/' + item.id}
            className="font-bold text-white text-base mb-2 line-clamp-1 group-hover:text-emerald-300 transition-colors no-underline"
          >
            {item.title}
          </Link>

          <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed flex-grow">
            {item.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-auto gap-2">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Precio
              </span>

              {/* Precio final con descuento. */}
              <span className="text-lg font-black text-white">
                {formatoPrecio(precioFinal)}
              </span>

              {/* Precio original tachado, solo si hay descuento. */}
              {tieneDescuento && (
                <span className="block text-[11px] text-slate-500 line-through">
                  {formatoPrecio(item.price)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Vista rápida: abre ModalPro. */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
                title="Vista rápida"
              >
                👁️
              </button>

              {/* Ir al detalle completo. */}
              <Link
                to={'/detalle/' + item.id}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 no-underline"
              >
                Detalle
              </Link>

              {/* Agregar al carrito: se desactiva si no hay stock. */}
              <button
                type="button"
                onClick={handleAgregar}
                disabled={agotado}
                className={'px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md flex items-center gap-1 ' + (agotado
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : added
                    ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 cursor-pointer'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 cursor-pointer')}
                title={agotado ? 'Sin stock' : 'Agregar al carrito'}
              >
                {agotado ? 'Agotado' : added ? '✓ Agregado' : '🛒 Agregar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de vista rápida (el mismo de la Clase 1). */}
      {isModalOpen && (
        <ModalPro item={item} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default Cardpro;