// =====================================================================
// ARCHIVO: src/pages/Carrito.jsx (VERSIÓN FINAL)
// ---------------------------------------------------------------------
// QUÉ HACE:
//   - Lista los productos del carrito con su precio final y en Bs.
//   - Muestra descuento, ahorro, envío y total con envío.
//   - Permite subir/bajar cantidades respetando el stock.
//   - Pide confirmación con ModalConfirmacion antes de eliminar o vaciar.
//   - Lleva a /checkout para cerrar la compra.
//
// IMPORTANTE:
//   Esta página NO calcula totales por su cuenta. Todos los números
//   vienen del Context para que coincidan con el checkout.
// =====================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import ModalConfirmacion from '../components/ModalConfirmacion';

// ---------------------------------------------------------------------
// 1) FORMATEO DE PRECIOS EN DÓLARES
// Los montos en Bs se formatean con formatearBs() del Context.
// ---------------------------------------------------------------------
const formatoPrecio = (monto) =>
  '$ ' +
  Number(monto).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Carrito = () => {
  // -------------------------------------------------------------------
  // 2) TODO LO QUE NECESITA LA VISTA VIENE DEL CONTEXT
  // Métodos, totales, cálculo de precio, envío y formateo en Bs.
  // -------------------------------------------------------------------
  const {
    carrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    totalArticulos,
    totalPrecio,
    totalAhorro,
    calcularPrecio,
    formatearBs,
    envio,
    totalConEnvio,
    faltanteEnvio,
    progresoEnvio,
    minimoEnvioGratis,
  } = useCarrito();

  // -------------------------------------------------------------------
  // 3) ESTADO LOCAL PARA EL MODAL
  // null = cerrado; { tipo, id, nombre } = acción pendiente.
  // -------------------------------------------------------------------
  const [confirmacion, setConfirmacion] = useState(null);

  const pedirEliminar = (item) => {
    setConfirmacion({ tipo: 'eliminar', id: item.id, nombre: item.title });
  };

  const pedirVaciar = () => setConfirmacion({ tipo: 'vaciar' });

  // Ejecuta la acción solo después de confirmar en el modal.
  const confirmarAccion = () => {
    if (!confirmacion) return;

    if (confirmacion.tipo === 'eliminar') {
      eliminarDelCarrito(confirmacion.id);
    } else {
      vaciarCarrito();
    }
  };

  // -------------------------------------------------------------------
  // 4) ESTADO VACÍO
  // Si no hay productos, mostramos un mensaje y un enlace a la tienda.
  // -------------------------------------------------------------------
  if (carrito.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-black text-white mb-2">
          Tu carrito está vacío
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Explora el catálogo y agrega tus productos favoritos.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all no-underline"
        >
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-black text-white mb-8">
        Carrito de Compras ({totalArticulos}{' '}
        {totalArticulos === 1 ? 'artículo' : 'artículos'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* -------------------------------------------------------------
            LISTA DE PRODUCTOS
        ------------------------------------------------------------- */}
        <div className="lg:col-span-2 space-y-3">
          {carrito.map((item) => {
            // Valores derivados de cada línea del carrito.
            const precioUnitario = calcularPrecio(item);
            const tieneDescuento = Number(item.discountPercentage) > 0;
            const enElMaximo = item.cantidad >= Number(item.stock);

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-20 h-20 object-contain bg-black/40 rounded-xl p-2 border border-slate-800 shrink-0"
                />

                <div className="flex-grow min-w-0">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <Link
                    to={'/detalle/' + item.id}
                    className="font-bold text-white text-sm hover:text-emerald-400 transition-colors line-clamp-1 no-underline"
                  >
                    {item.title}
                  </Link>

                  {/* Precio final, precio original y badge de descuento. */}
                  <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                    <span className="text-slate-300 text-xs font-semibold">
                      {formatoPrecio(precioUnitario)} c/u
                    </span>
                    {tieneDescuento && (
                      <span className="text-slate-600 text-[10px] line-through">
                        {formatoPrecio(item.price)}
                      </span>
                    )}
                    {tieneDescuento && (
                      <span className="text-[9px] font-black text-rose-300 bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 rounded">
                        -{Math.round(Number(item.discountPercentage))}%
                      </span>
                    )}
                  </div>

                  {/* Precio unitario en bolívares. */}
                  <span className="text-[10px] text-cyan-300 block mt-0.5">
                    {formatearBs(precioUnitario)} c/u
                  </span>
                </div>

                {/* Controles de cantidad. El + se desactiva en el stock máximo. */}
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      item.cantidad === 1
                        ? pedirEliminar(item)
                        : actualizarCantidad(item.id, item.cantidad - 1)
                    }
                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-bold transition-all cursor-pointer"
                    title="Disminuir"
                  >
                    −
                  </button>
                  <span className="w-9 text-center font-bold text-white text-sm">
                    {item.cantidad}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      actualizarCantidad(item.id, item.cantidad + 1)
                    }
                    disabled={enElMaximo}
                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title={enElMaximo ? 'Stock máximo alcanzado' : 'Aumentar'}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal de la línea en USD y Bs. */}
                <div className="text-right shrink-0">
                  <div className="font-black text-white">
                    {formatoPrecio(precioUnitario * item.cantidad)}
                  </div>
                  <div className="text-[10px] text-cyan-300">
                    {formatearBs(precioUnitario * item.cantidad)}
                  </div>
                  <button
                    type="button"
                    onClick={() => pedirEliminar(item)}
                    className="text-rose-400 hover:text-rose-300 text-[11px] font-bold cursor-pointer"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={pedirVaciar}
            className="text-slate-400 hover:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
          >
            Vaciar todo el carrito
          </button>
        </div>

        {/* -------------------------------------------------------------
            RESUMEN DEL PEDIDO
            Todos los montos vienen del Context, no se recalculan aquí.
        ------------------------------------------------------------- */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
            Resumen del pedido
          </h2>

          <div className="flex justify-between text-sm text-slate-400">
            <span>Artículos</span>
            <span className="font-semibold text-white">{totalArticulos}</span>
          </div>

          <div className="flex justify-between text-sm text-slate-400">
            <span>Subtotal</span>
            <span className="font-semibold text-white">
              {formatoPrecio(totalPrecio)}
            </span>
          </div>

          {/* Solo mostramos la fila de ahorro si realmente hay descuento. */}
          {totalAhorro > 0 && (
            <div className="flex justify-between text-sm text-emerald-400">
              <span>Ahorras</span>
              <span className="font-semibold">
                -{formatoPrecio(totalAhorro)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm text-slate-400">
            <span>Envío</span>
            <span
              className={
                envio === 0
                  ? 'font-semibold text-emerald-400'
                  : 'font-semibold text-white'
              }
            >
              {envio === 0 ? 'Gratis' : formatoPrecio(envio)}
            </span>
          </div>

          {/* Barra de progreso hacia el envío gratis. */}
          {envio > 0 && (
            <div className="space-y-1.5">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: progresoEnvio + '%' }}
                />
              </div>
              <p className="text-[10px] text-slate-500">
                Te faltan {formatoPrecio(faltanteEnvio)} para el envío gratis
                (mínimo {formatoPrecio(minimoEnvioGratis)}).
              </p>
            </div>
          )}

          <div className="border-t border-slate-800 pt-4 flex justify-between items-baseline">
            <span className="font-bold text-white">Total</span>
            <div className="text-right">
              <span className="block text-3xl font-black text-emerald-400">
                {formatoPrecio(totalConEnvio)}
              </span>
              <span className="block text-xs font-bold text-cyan-300">
                {formatearBs(totalConEnvio)}
              </span>
            </div>
          </div>

          {/* El checkout se construye en el Bloque 4. */}
          <Link
            to="/checkout"
            className="block text-center w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all no-underline"
          >
            Finalizar compra
          </Link>

          <Link
            to="/"
            className="block text-center text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors no-underline"
          >
            ← Seguir comprando
          </Link>
        </div>
      </div>

      {/* ---------------------------------------------------------------
          MODAL DE CONFIRMACIÓN
          Reutiliza el componente del Bloque 2.
      --------------------------------------------------------------- */}
      <ModalConfirmacion
        abierto={Boolean(confirmacion)}
        titulo={
          confirmacion?.tipo === 'vaciar'
            ? '¿Vaciar todo el carrito?'
            : '¿Eliminar este producto?'
        }
        mensaje={
          confirmacion?.tipo === 'vaciar'
            ? 'Se quitarán todos los productos. Esta acción no se puede deshacer.'
            : 'Se quitará "' +
              (confirmacion?.nombre || 'este producto') +
              '" del carrito.'
        }
        textoConfirmar={
          confirmacion?.tipo === 'vaciar' ? 'Sí, vaciar' : 'Sí, eliminar'
        }
        tipo={confirmacion?.tipo === 'vaciar' ? 'advertencia' : 'peligro'}
        onConfirmar={confirmarAccion}
        onCerrar={() => setConfirmacion(null)}
      />
    </div>
  );
};

export default Carrito;