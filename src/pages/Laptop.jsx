import { useEffect, useState } from "react";
import Cardpro from "../components/Cardpro";

const API = 'https://dummyjson.com/products/category/laptops';

const Laptop = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const getDatos = async () => {
      try {
        setLoading(true);
        const response = await fetch(API, { signal: controller.signal });
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        setDatos(data.products);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error al conectar con la API');
        }
      } finally {
        setLoading(false);
      }
    };

    getDatos();
    return () => controller.abort(); // Cleanup para evitar fugas de memoria
  }, []);

  if (loading) {
    return (
      <div className="text-center py-24 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-emerald-400 font-semibold text-sm">Consultando laptops en DummyJSON...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 text-center text-rose-300 bg-rose-500/10 rounded-2xl border border-rose-500/30">
        <span className="text-2xl mb-2 block">⚠️</span>
        <p className="font-bold mb-1">Hubo un problema al cargar los datos</p>
        <p className="text-xs text-rose-400/80">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest font-black text-emerald-400 block mb-1">
          Catálogo Oficial
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          Laptops & Computación ({datos.length})
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Productos obtenidos en vivo desde /products/category/laptops.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {datos.map((item) => (
          <Cardpro key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Laptop;