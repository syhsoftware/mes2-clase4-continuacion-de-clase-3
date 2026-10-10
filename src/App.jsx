import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Inicio from './pages/Inicio';
import Footer from './components/Footer';
import Laptop from './pages/Laptop';
import Movil from './pages/Movil';
import Beauty from './pages/Beauty';
import Tablet from './pages/Tablet';
import Error404 from './pages/Error404';
import Vehicle from './pages/vehicle';
import Motorcycle from './pages/Motorcycle';
import  Categoria from './pages/Categoria';
import Detalle from './pages/Detalle';



// 🟢 FASE 1: Maqueta base limpia sin dependencias de router. Cero errores.
const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        {/* 1. Barra de navegación fija */}
        <Header />

        {/* 2. Contenido principal: Pantalla de Bienvenida */}
        <main className="flex">
          <Routes>

            <Route path='/' element={<Inicio />} />
            <Route path='/Laptop' element={<Laptop />} />
            <Route path='/Movil' element={<Movil />} />
            <Route path='/Beauty' element={<Beauty />} />
            <Route path='/Tablet' element={<Tablet />} />
            <Route path='/Vehicle' element={<Vehicle />} />
            <Route path='/Motorcycle' element={<Motorcycle />} />
           


            <Route path='*' element={<Error404 />} />
            {/* 🚀 RUTA DINÁMICA: Categoría universal */}
            {/* :slug atiende laptops, smartphones, fragrances... ¡sin duplicar archivos! */}
            <Route path="/categoria/:slug" element={< Categoria />} />

              {/* 🚀 NUEVA RUTA DINÁMICA: Ficha de producto individual (:id) */}
            <Route path="/detalle/:id" element={<Detallegit init />} />


          </Routes>

        </main>

        {/* 3. Pie de página comercial */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;