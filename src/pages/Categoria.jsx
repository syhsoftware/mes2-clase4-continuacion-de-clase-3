import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cardpro from '../components/Cardpro';

// 🌐 1. Endpoint base declarado arriba y fuera del componente
const API = 'https://dummyjson.com/products/category/';

const Categoria = () => {
  // 1. Capturamos el slug de la categoría desde la URL (/categoria/:slug)
  const { slug } = useParams();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect reactivo: se dispara cada vez que el alumno pulsa otra categoría
  useEffect(() => {
    const controller = new AbortController();

    const fetchCategoria = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🎯 2. Composición limpia de la URI con el parámetro dinámico
        const URI = `${API}${slug}`;

        const res = await fetch(URI, {
          signal: controller.signal
        });

        if (!res.ok) throw new Error(`No se pudo cargar la categoría: ${slug}`);

        const data = await res.json();
        setProductos(data.products || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error de red');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoria();
    return () => controller.abort();
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
      {/* Encabezado dinámico con el nombre de la categoría actual */}
      <div className="mb-10 text-center">
        <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-3">
          Catálogo Dinámico Universal
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white capitalize tracking-tight">
          {slug.replaceAll('-', ' ')}
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2">
          Productos consultados en tiempo real mediante la ruta dinámica <code className="text-emerald-400">/categoria/{slug}</code>
        </p>
      </div>

      {/* Estados Asíncronos */}
      {loading && (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-bold text-xs">Cargando productos de {slug}...</p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl max-w-lg mx-auto text-center text-rose-300 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((item) => (
            <Cardpro key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Categoria;