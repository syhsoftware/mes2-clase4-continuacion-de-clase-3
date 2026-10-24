
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const Carrito = () => {
    const {

        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        totalArticulos,
        totalPrecio,
        totalPrecioBs,
        modalConfirmacion,
        setModalConfirmacion,
    } = useCarrito();

    // La confirmación vive en el Contexto (eliminarDelCarrito y vaciarCarrito),
    // por eso aquí llamamos a los métodos directamente.

    // Estado vacío
    if (carrito.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h1 className="text-2xl font-black text-white mb-2">Tu carrito está vacío</h1>
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
                Carrito de Compras ({totalArticulos} {totalArticulos === 1 ? 'artículo' : 'artículos'})
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Lista de productos */}
                <div className="lg:col-span-2 space-y-3">
                    {carrito.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
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
                                    to={`/detalle/${item.id}`}
                                    className="font-bold text-white text-sm hover:text-emerald-400 transition-colors line-clamp-1 no-underline"
                                >
                                    {item.title}
                                </Link>
                                <span className="text-slate-400 text-xs">$ {item.price} c/u</span>
                                <p className='text-slate-400 text-xs'>porcentaje de descuento: {item.discountPercentage}% </p>
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Existencia: {item.stock}</p>
                            </div>


                            {/* Controles de cantidad */}
                            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-bold transition-all cursor-pointer"
                                    title="Disminuir"
                                >
                                    −
                                </button>
                                <span className="w-9 text-center font-bold text-white text-sm">{item.cantidad}</span>
                                <button
                                    type="button"
                                    onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-bold transition-all cursor-pointer"
                                    title="Aumentar"
                                >
                                    +
                                </button>
                            </div>

                            {/* Subtotal + eliminar */}
                            <div className="text-right shrink-0">
                                <div className="font-black text-white">$ {(item.price * item.cantidad).toFixed(2)}</div>
                                <button
                                    type="button"
                                    onClick={() => eliminarDelCarrito(item.id)}
                                    className="text-rose-400 hover:text-rose-300 text-[11px] font-bold cursor-pointer"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className='flex justify-end '>
                        <button
                            type="button"
                            onClick={vaciarCarrito}
                            className="text-slate-400 hover:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
                        >
                            Vaciar todo el carrito
                        </button>
                    </div>
                </div>

                {/* Resumen del pedido */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 lg:sticky lg:top-24">
                    <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                        Resumen del pedido
                    </h2>
                    <div className="flex justify-between text-sm text-slate-400">
                        <span>Artículos</span>
                        <span className="font-semibold text-white">{totalArticulos}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400">
                        <span>Envío</span>
                        <span className="font-semibold text-emerald-400">Gratis</span>
                    </div>
                    <div className="border-t border-slate-800 pt-4 flex flex-col gap-2">
                        {/* Total en Dólares */}
                        <div className="flex justify-between items-baseline">
                            <span className="font-bold text-white">Total</span>
                            <span className="text-xl font-black text-emerald-400">$ {totalPrecio.toFixed(2)}</span>
                        </div>

                        {/* Total en Bolívares */}
                        <div className="flex justify-between items-baseline">
                            <span className="font-bold text-white">Total Bs</span>
                            <span className="text-xl font-black text-emerald-400">{totalPrecioBs.toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => alert('¡Compra simulada! Cerraremos el flujo completo en la próxima clase.')}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all cursor-pointer"
                    >
                        Finalizar compra
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Carrito;