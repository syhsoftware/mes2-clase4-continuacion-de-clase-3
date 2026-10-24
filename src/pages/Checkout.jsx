// =====================================================================
// ARCHIVO: src/pages/Checkout.jsx
// ---------------------------------------------------------------------
// QUÉ HACE:
//   - Muestra el resumen del pedido con los totales del Context.
//   - Recoge los datos de entrega en un formulario controlado.
//   - Al confirmar: genera un número de pedido, guarda el resumen
//     y vacía el carrito.
//   - Muestra una pantalla de éxito con el número y el total.
//
// IMPORTANTE:
//   Es una SIMULACIÓN. No hay cobro real, backend ni descuento de stock.
//   En producción faltarían pasarela de pago, autenticación y API.
// =====================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

// ---------------------------------------------------------------------
// 1) FORMATEO DE PRECIOS EN DÓLARES
// ---------------------------------------------------------------------
const formatoPrecio = (monto) =>
  '$ ' +
  Number(monto).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Checkout = () => {
  // -------------------------------------------------------------------
  // 2) DATOS DEL CARRITO DESDE EL CONTEXT
  // No recalculamos totales aquí: usamos los mismos del carrito.
  // -------------------------------------------------------------------
  const {
    carrito,
    totalArticulos,
    totalPrecio,
    totalAhorro,
    envio,
    totalConEnvio,
    formatearBs,
    calcularPrecio,
    vaciarCarrito,
  } = useCarrito();

  // -------------------------------------------------------------------
  // 3) ESTADO DEL FORMULARIO
  // Un solo objeto para los cinco campos. Se actualiza con cambiar().
  // -------------------------------------------------------------------
  const [datos, setDatos] = useState({
    cedula: '',
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
    direccion: '',
  });

  // -------------------------------------------------------------------
  // 4) ESTADO DEL PEDIDO CONFIRMADO
  // null = todavía no se confirmó. Con datos = mostrar pantalla de éxito.
  // -------------------------------------------------------------------
  const [pedido, setPedido] = useState(null);

  // Actualiza el campo que cambió usando su atributo name.
  const cambiar = (event) => {
    const { name, value } = event.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------------------------------------------------
  // 5) CONFIRMAR EL PEDIDO
  // Pasos:
  //   a. Evitar que el formulario recargue la página.
  //   b. Generar un número de pedido.
  //   c. Guardar el resumen en el estado local.
  //   d. Vaciar el carrito del Context.
  // -------------------------------------------------------------------
  const confirmarPedido = (event) => {
    event.preventDefault();

    const numero = 'ORD-' + Date.now().toString().slice(-6);

    setPedido({
      numero,
      cliente: datos.nombre,
      articulos: totalArticulos,
      total: totalConEnvio,
      cedula:datos.cedula,
    });

    vaciarCarrito();
  };

  // -------------------------------------------------------------------
  // 6) PANTALLA DE ÉXITO
  // Se muestra cuando pedido tiene datos.
  // -------------------------------------------------------------------
  if (pedido) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
          ✓
        </div>

        <h1 className="text-3xl font-black text-white mb-2">
          ¡Gracias por tu compra!
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          {pedido.cliente} cedula:{pedido.cedula},  tu pedido fue registrado correctamente.
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-left space-y-3 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Número de pedido</span>
            <span className="font-mono font-bold text-emerald-400">
              {pedido.numero}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Artículos</span>
            <span className="font-bold text-white">{pedido.articulos}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-slate-800 pt-3">
            <span className="text-slate-400">Total pagado</span>
            <span className="text-right">
              <span className="block text-xl font-black text-white">
                {formatoPrecio(pedido.total)}
              </span>
              <span className="block text-xs font-bold text-cyan-300">
                {formatearBs(pedido.total)}
              </span>
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mb-6">
          Simulación académica: no se realizó ningún cobro real.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all no-underline"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 7) CARRITO VACÍO
  // No tiene sentido mostrar el formulario sin productos.
  // -------------------------------------------------------------------
  if (carrito.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🧾</div>
        <h1 className="text-2xl font-black text-white mb-2">
          No hay nada para pagar
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Agrega productos al carrito antes de entrar al checkout.
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

  // -------------------------------------------------------------------
  // 8) FORMULARIO + RESUMEN
  // -------------------------------------------------------------------
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
        Finalizar compra
      </h1>
      <p className="text-sm text-slate-400 mb-8">
        Revisa tus datos y confirma el pedido. Es una simulación, no se cobra nada.
      </p>

      <form
        onSubmit={confirmarPedido}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
      >
        {/* -------------------------------------------------------------
            DATOS DE ENTREGA
            Cada input es controlado: value + onChange.
        ------------------------------------------------------------- */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
            Datos de entrega
          </h2> 

          <label className="block">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                cedula
              </span>
              <input
                type="text"
                name="cedula"
                value={datos.cedula}
                onChange={cambiar}
                required
                placeholder="v-12345678"
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </label>
            
            
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Nombre completo
              </span>
              <input
                type="text"
                name="nombre"
                value={datos.nombre}
                onChange={cambiar}
                required
                placeholder="Ana Pérez"
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Correo electrónico
              </span>
              <input
                type="email"
                name="email"
                value={datos.email}
                onChange={cambiar}
                required
                placeholder="ana@correo.com"
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Teléfono
              </span>
              <input
                type="tel"
                name="telefono"
                value={datos.telefono}
                onChange={cambiar}
                required
                placeholder="0414-1234567"
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Ciudad
              </span>
              <input
                type="text"
                name="ciudad"
                value={datos.ciudad}
                onChange={cambiar}
                required
                placeholder="Caracas"
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Dirección de entrega
            </span>
            <textarea
              name="direccion"
              value={datos.direccion}
              onChange={cambiar}
              required
              rows={3}
              placeholder="Av. Principal, edificio, apartamento..."
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </label>

          <p className="text-[10px] text-slate-500">
            Estos datos solo viven en el estado del formulario. No se envían a
            ningún servidor.
          </p>
        </div>

        {/* -------------------------------------------------------------
            RESUMEN DEL PEDIDO
            Usa los mismos totales del Context que la página del carrito.
        ------------------------------------------------------------- */}
        <aside className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
            Tu pedido
          </h2>

          <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
            {carrito.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-10 h-10 object-contain bg-black/40 rounded-lg p-1 border border-slate-800 shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <p className="text-[11px] font-bold text-white line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {item.cantidad} × {formatoPrecio(calcularPrecio(item))}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-white shrink-0">
                  {formatoPrecio(calcularPrecio(item) * item.cantidad)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="font-semibold text-white">
                {formatoPrecio(totalPrecio)}
              </span>
            </div>

            {totalAhorro > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Ahorras</span>
                <span className="font-semibold">
                  -{formatoPrecio(totalAhorro)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-slate-400">
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
          </div>

          <div className="border-t border-slate-800 pt-4 flex justify-between items-baseline">
            <span className="font-bold text-white">Total</span>
            <div className="text-right">
              <span className="block text-2xl font-black text-emerald-400">
                {formatoPrecio(totalConEnvio)}
              </span>
              <span className="block text-xs font-bold text-cyan-300">
                {formatearBs(totalConEnvio)}
              </span>
            </div>
          </div>

          {/* El submit dispara confirmarPedido. */}
          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all cursor-pointer"
          >
            Confirmar pedido
          </button>

          <Link
            to="/carrito"
            className="block text-center text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors no-underline"
          >
            ← Volver al carrito
          </Link>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;