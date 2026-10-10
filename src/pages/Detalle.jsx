import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// 🌐 1. Endpoint base declarado arriba y fuera del componente
const API = 'https://dummyjson.com/products/';

const Detalle = () => {
    // 1. Capturamos el parámetro dinámico definido en la ruta: <Route path="/detalle/:id" />
    const { id } = useParams();

    // 2. La Tríada Asíncrona de Estados
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Estado local para la miniatura activa en la galería
    const [fotoActiva, setFotoActiva] = useState(null);

    // 4. useEffect con dependencia [id]: si el usuario pasa al producto 5 y luego al 8, se refresca
    useEffect(() => {
        const controller = new AbortController();

        const fetchProducto = async () => {
            try {
                setLoading(true);
                setError(null);

                // 🎯 2. Composición limpia de la URI con el parámetro dinámico
                const URI = `${API}${id}`;

                const res = await fetch(URI, {
                    signal: controller.signal
                });

                if (!res.ok) throw new Error(`Producto con ID #${id} no encontrado en el servidor.`);

                const data = await res.json();
                setProducto(data);
                // Si el producto tiene galería, mostramos la primera foto por defecto
                setFotoActiva(data.images?.[0] || data.thumbnail);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message || 'Error al conectar con la API');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();
        return () => controller.abort();
    }, [id]);

    // Pantalla de Carga (Spinner)
    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400 font-bold text-sm">Consultando ficha técnica del producto #{id}...</p>
            </div>
        );
    }

    // Pantalla de Error
    if (error || !producto) {
        return (
            <div className="max-w-xl mx-auto my-16 p-8 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center">
                <span className="text-4xl mb-3 block">⚠️</span>
                <h2 className="text-white font-bold text-xl mb-2">No pudimos cargar el producto</h2>
                <p className="text-slate-400 text-xs mb-6">{error}</p>
                <Link
                    to="/"
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold inline-block"
                >
                    Volver a la Tienda
                </Link>
            </div>
        );
    }



    //bolivares 
    const tasa = 980;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
            {/* Botón de Retorno */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-6 text-xs font-bold no-underline"
            >
                <span>←</span> Volver al Catálogo Principal
            </Link>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2">

                    {/* Columna Izquierda: Galería Interactiva con Miniaturas */}
                    <div className="p-6 md:p-8 bg-black/40 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
                        <div className="aspect-square bg-slate-950/60 rounded-2xl flex items-center justify-center p-6 mb-4 border border-slate-800">
                            <img
                                src={fotoActiva}
                                alt={producto.title}
                                className="w-full h-full max-h-96 object-contain drop-shadow-2xl transition-all duration-300"
                            />
                        </div>

                        {/* Carrusel de fotos secundarias (Thumbnails) */}
                        {producto.images && producto.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {producto.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setFotoActiva(img)}
                                        className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all bg-slate-950 p-1 ${fotoActiva === img ? 'border-emerald-500 scale-105 shadow-md' : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Columna Derecha: Especificaciones Técnicas */}
                    <div className="p-6 md:p-10 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                                    {producto.category}
                                </span>
                                <span className="text-xs text-slate-500 font-mono">ID: #{producto.id}</span>
                                <span className="text-xs text-slate-500 font-mono">ID: #{producto.sku}</span>

                            </div>

                            <h1 className="text-2xl sm:text-4xl font-black text-white mb-4 leading-tight">
                                {producto.title}
                            </h1>

                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                {producto.description}

                            </p>
                            <span className="text-xs text-slate-500 font-mono">disponible :{producto.availabystatus}</span>
                            {/* Atributos Clave */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Marca</span>
                                    <span className="text-xs font-bold text-white">{producto.brand || 'Genérica'}</span>
                                </div>
                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Calificación</span>
                                    <span className="text-xs font-bold text-amber-300">⭐ {producto.rating} / 5</span>
                                </div>
                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Stock Disponible</span>
                                    <span className="text-xs font-bold text-emerald-400">{producto.stock} unidades</span>
                                </div>
                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Garantía</span>
                                    <span className="text-xs font-bold text-slate-300">{producto.warrantyInformation || '1 Año de Garantía'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Caja de Precio y Botón de Compra */}
                        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                            <div>
                                <span className="text-xs text-slate-400 block font-medium">Precio Oficial</span>
                                <span className="text-3xl font-black text-white">$ {producto.price}</span>
                                <span className="text-xs text-slate-400 block font-medium">Precio Bs</span>
                                <span className="text-3xl font-black text-white">$ {(producto.price * tasa).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} bs</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => alert(`¡Compraste ${producto.title}!`)}
                                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
                            >
                                Añadir al Carrito
                            </button>
                        </div>
                        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">

                            <span className="text-xs font-bold text-slate-300">Ancho: {producto.dimensions.width}</span>
                            <span className="text-xs font-bold text-slate-300">Alto: {producto.dimensions.height}</span>
                            <span className="text-xs font-bold text-slate-300">Profundida: {producto.dimensions.depth}</span>

                        </div>
                        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                            <div className="w-full space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                {producto.reviews?.map((review, index) => (
                                    <div key={index} className="text-xs text-slate-300 flex flex-col border-b border-slate-700/50 pb-2 gap-0.5">
                                        <div className="flex justify-between items-center font-bold">
                                            <span className="truncate pr-2">{review.reviewerName}</span>
                                            <span className="text-slate-500 font-mono text-[10px] shrink-0">
                                                {new Date(review.date).toLocaleDateString('es-VE')}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 italic break-words">"{review.comment}"</p>
                                        <span className="text-[10px] text-emerald-400 font-semibold">{review.rating} ★</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Detalle;