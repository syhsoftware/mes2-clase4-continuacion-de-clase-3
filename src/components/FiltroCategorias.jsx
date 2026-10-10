import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// 🌐 Endpoint oficial con la lista completa de categorías
const API = 'https://dummyjson.com/products/categories';

const FiltroCategorias = ({ onSelect }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategorias = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API, { signal: controller.signal });
        if (!res.ok) throw new Error('Error al cargar la lista de categorías');

        const data = await res.json();
        setCategorias(data || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error de conexión');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-[11px] text-slate-400 font-bold">Cargando categorías...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 text-xs text-rose-400 text-center">
        Error al cargar categorías
      </div>
    );
  }

  return (
   <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
    {/*{categorias.slice(0, 10).map((item, index) => (esto es para filtrar solo algunos grupos*/ }
      {categorias.map((item, index) => (
        <Link
          key={index}
          to={`/categoria/${item.slug}`}
          onClick={() => {
            if (typeof onSelect === 'function') onSelect();
          }}
          className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-emerald-500/10 hover:border-l-2 hover:border-emerald-500 rounded-lg transition-all no-underline capitalize"
        >
          <span>{item.name}</span>
          <span className="text-[10px] text-slate-500 font-mono">→</span>
        </Link>
      ))}
    </div>
  );
};
export default FiltroCategorias;