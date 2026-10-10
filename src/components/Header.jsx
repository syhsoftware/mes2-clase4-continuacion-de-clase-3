import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import FiltroCategorias from './FiltroCategorias';

const Header = () => {
  // Estado local para abrir/cerrar el dropdown de categorías
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar el dropdown automáticamente al hacer clic en cualquier parte fuera de él
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl backdrop-blur-md bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logotipo */}
          <Link to="/" className="flex items-center gap-2 text-white no-underline group flex-shrink-0">
            <span className="text-2xl group-hover:scale-110 transition-transform">🛍️</span>
            <span className="text-base sm:text-lg font-black tracking-tight group-hover:text-emerald-400 transition-colors">
              Dummy<span className="text-emerald-400">JSON</span> Pro
            </span>
          </Link>

          {/* Menú de Navegación */}
          <nav className="flex items-center gap-2">
            {/* 1. Enlace Fijo: Inicio */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all no-underline ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <span>🏠</span>
              <span>Inicio</span>
            </NavLink>

            {/* 2. Submenú Desplegable: 24 Categorías en Vivo */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpenDropdown(!openDropdown)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  openDropdown
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700/80'
                }`}
              >
                <span>📂</span>
                <span>Todas las Categorías</span>
                <span className={`text-[10px] transition-transform duration-200 ${openDropdown ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Menú Flotante Vertical con Scroll */}
              {openDropdown && (
                <div className="absolute right-0 sm:left-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                      24 Categorías en Vivo
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">DummyJSON API</span>
                  </div>

                  {/* Componente que consume la API de categorías y cierra al seleccionar */}
                  <FiltroCategorias onSelect={() => setOpenDropdown(false)} />
                </div>
              )}
            </div>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;