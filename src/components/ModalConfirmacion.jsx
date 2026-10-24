// =====================================================================
// ARCHIVO: src/components/ModalConfirmacion.jsx
// ---------------------------------------------------------------------
// QUÉ HACE:
//   - Muestra una pregunta de confirmación con diseño propio.
//   - Se monta fuera del árbol del carrito con createPortal.
//   - Cierra con la tecla Esc o con un clic en el fondo.
//   - Bloquea el scroll del body mientras está abierto.
//
// POR QUÉ NO USAMOS window.confirm:
//   - Bloquea el navegador.
//   - No se puede estilizar.
//   - Muestra el dominio en lugar de la tienda.
//
// CÓMO SE USA:
//   <ModalConfirmacion
//     abierto={Boolean(confirmacion)}
//     titulo="¿Eliminar este producto?"
//     mensaje="Se quitará del carrito."
//     onConfirmar={...}
//     onCerrar={...}
//   />
// =====================================================================

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

// ---------------------------------------------------------------------
// 1) ESTILOS POR TIPO DE AVISO
// Cada tipo cambia icono, colores y botón de confirmación.
// ---------------------------------------------------------------------
const estilos = {
  peligro: {
    icono: '🗑️',
    iconoBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    boton: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25',
  },
  advertencia: {
    icono: '⚠️',
    iconoBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    boton: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25',
  },
  info: {
    icono: 'ℹ️',
    iconoBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    boton: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25',
  },
};

// ---------------------------------------------------------------------
// 2) PROPS DEL MODAL
// Todas tienen valor por defecto para poder reutilizarlo en cualquier caso.
// ---------------------------------------------------------------------
const ModalConfirmacion = ({
  abierto,
  titulo = '¿Estás seguro?',
  mensaje = 'Esta acción no se puede deshacer.',
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  tipo = 'peligro',
  onConfirmar,
  onCerrar,
}) => {
  // -------------------------------------------------------------------
  // 3) EFECTOS SECUNDARIOS
  // Solo se ejecutan cuando el modal está abierto.
  // - Esc cierra el modal.
  // - Bloquea el scroll del fondo.
  // - Limpia todo al cerrar o desmontar el componente.
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!abierto) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCerrar();
    };

    // Guardamos el valor previo para restaurarlo al cerrar.
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Función de limpieza: se ejecuta al cerrar o desmontar.
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflowPrevio;
    };
  }, [abierto, onCerrar]);

  // Si está cerrado, no renderizamos nada.
  if (!abierto) return null;

  const estilo = estilos[tipo] || estilos.peligro;

  // -------------------------------------------------------------------
  // 4) PORTAL
  // createPortal(contenido, destino) monta el modal en document.body.
  // Así ningún contenedor con overflow o z-index lo recorta.
  // -------------------------------------------------------------------
  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
      onClick={onCerrar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-confirmacion"
        className="relative w-full max-w-md bg-[#111620] border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Icono según el tipo: peligro, advertencia o info. */}
        <div className={'w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl mx-auto mb-5 ' + estilo.iconoBg}>
          {estilo.icono}
        </div>

        {/* Título y mensaje que recibe la página. */}
        <h3 id="titulo-modal-confirmacion" className="text-xl font-black text-white mb-2">
          {titulo}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-8">{mensaje}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Cancelar recibe el foco al abrir: opción segura por defecto. */}
          <button
            type="button"
            autoFocus
            onClick={onCerrar}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-colors cursor-pointer text-sm"
          >
            {textoCancelar}
          </button>

          {/* Confirmar ejecuta la acción y luego cierra el modal. */}
          <button
            type="button"
            onClick={() => {
              onConfirmar();
              onCerrar();
            }}
            className={'w-full sm:w-1/2 py-3 px-4 rounded-xl text-white font-bold transition-all shadow-lg cursor-pointer text-sm ' + estilo.boton}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalConfirmacion;