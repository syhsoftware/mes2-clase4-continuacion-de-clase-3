// =====================================================================
// ARCHIVO: src/context/CarritoContext.jsx (VERSIÓN FINAL)
// ---------------------------------------------------------------------
// QUÉ AGREGA ESTA VERSIÓN respecto a la persistencia básica:
//   - Precio final con descuento (calcularPrecio).
//   - Cuánto ahorra el cliente (totalAhorro).
//   - Tasa BCV centralizada y formateo en bolívares.
//   - Envío con umbral de envío gratis.
//   - Límite de cantidad según el stock real de DummyJSON.
//
// REGLA DE ORO:
//   Todos los cálculos viven aquí para que la vista del carrito y el
//   checkout usen exactamente los mismos números.
// =====================================================================

import { createContext, useContext, useEffect, useReducer } from 'react';

// ---------------------------------------------------------------------
// 1) CAJA GLOBAL Y CLAVE DE PERSISTENCIA
// ---------------------------------------------------------------------
const CarritoContext = createContext();
const CLAVE_CARRITO = 'tienda_carrito_v1';

// ---------------------------------------------------------------------
// 2) REGLAS DE NEGOCIO CENTRALIZADAS
// Si mañana cambia la tasa o el envío, se cambia AQUÍ y en ningún otro lado.
// ---------------------------------------------------------------------
export const TASA_BCV = 1000;        // Bolívares por dólar (ejemplo académico).
export const ENVIO = 5;            // Costo de envío en dólares.
export const MINIMO_ENVIO_GRATIS = 120; // Desde este subtotal, envío gratis.

const estadoInicial = { carrito: [] };

// ---------------------------------------------------------------------
// 3) PRECIO FINAL CON DESCUENTO
// DummyJSON entrega price (precio base) y discountPercentage (0 a 100).
// Ejemplo: price = 10 y descuento = 20 => 10 * (1 - 0.20) = 8.
// toFixed(2) redondea a dos decimales y Number lo vuelve número.
// ---------------------------------------------------------------------
export const calcularPrecio = (producto) => {
  const descuento = Number(producto.discountPercentage) || 0;
  return Number((producto.price * (1 - descuento / 100)).toFixed(2));
};

// ---------------------------------------------------------------------
// 4) LÍMITE DE STOCK
// Si el producto no trae un stock numérico, devolvemos Infinity para
// no limitar la cantidad. Si trae stock, devolvemos ese número.
// ---------------------------------------------------------------------
const limiteStock = (producto) => {
  const stock = Number(producto.stock);
  return Number.isFinite(stock) ? stock : Infinity;
};

// ---------------------------------------------------------------------
// 5) REDUCER
// Recibe (estadoActual, accion) y devuelve un estado NUEVO.
// Nunca modifica el estado anterior.
// ---------------------------------------------------------------------
export const carritoReducer = (state, action) => {
  switch (action.type) {
    // -----------------------------------------------------------------
    // 5.1 AGREGAR
    // Si el producto ya existe, suma cantidad.
    // Si no existe, lo agrega al final.
    // En ambos casos respeta el stock máximo.
    // -----------------------------------------------------------------
    case 'AGREGAR': {
      const { producto, cantidad = 1 } = action;
      const tope = limiteStock(producto);

      // Sin stock: no se agrega nada.
      if (tope <= 0) return state;

      const existe = state.carrito.find((item) => item.id === producto.id);

      if (existe) {
        // Math.min evita superar el stock disponible.
        return {
          ...state,
          carrito: state.carrito.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: Math.min(item.cantidad + cantidad, tope) }
              : item
          ),
        };
      }

      return {
        ...state,
        carrito: [
          ...state.carrito,
          { ...producto, cantidad: Math.min(cantidad, tope) },
        ],
      };
    }

    // -----------------------------------------------------------------
    // 5.2 ELIMINAR
    // filter devuelve un arreglo nuevo sin el producto indicado.
    // -----------------------------------------------------------------
    case 'ELIMINAR':
      return {
        ...state,
        carrito: state.carrito.filter((item) => item.id !== action.id),
      };

    // -----------------------------------------------------------------
    // 5.3 ACTUALIZAR_CANTIDAD
    // Si la cantidad es 0 o negativa, elimina el producto.
    // Si es positiva, la limita al stock y descarta cantidades en 0.
    // -----------------------------------------------------------------
    case 'ACTUALIZAR_CANTIDAD': {
      if (action.cantidad <= 0) {
        return {
          ...state,
          carrito: state.carrito.filter((item) => item.id !== action.id),
        };
      }

      return {
        ...state,
        carrito: state.carrito
          .map((item) =>
            item.id === action.id
              ? { ...item, cantidad: Math.min(action.cantidad, limiteStock(item)) }
              : item
          )
          .filter((item) => item.cantidad > 0),
      };
    }

    // -----------------------------------------------------------------
    // 5.4 VACIAR
    // -----------------------------------------------------------------
    case 'VACIAR':
      return estadoInicial;

    default:
      return state;
  }
};

// ---------------------------------------------------------------------
// 6) REHIDRATACIÓN
// Lee el carrito guardado al arrancar. localStorage solo guarda texto:
// JSON.parse convierte el texto en arreglo.
// try/catch protege de datos corruptos o del modo privado.
// ---------------------------------------------------------------------
const leerCarrito = () => {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    if (!guardado) return estadoInicial;

    const carrito = JSON.parse(guardado);

    // Validación mínima: si no es un arreglo, empezamos vacío.
    return { carrito: Array.isArray(carrito) ? carrito : [] };
  } catch (error) {
    console.error('No se pudo leer el carrito guardado:', error);
    return estadoInicial;
  }
};

// ---------------------------------------------------------------------
// 7) PROVIDER
// Publica el carrito, los métodos y todos los valores derivados.
// ---------------------------------------------------------------------
export const CarritoProvider = ({ children }) => {
  // El tercer argumento es la inicialización perezosa: React ejecuta
  // leerCarrito UNA sola vez, no en cada render.
  const [state, dispatch] = useReducer(carritoReducer, undefined, leerCarrito);

  // -------------------------------------------------------------------
  // 8) PERSISTENCIA
  // Cada vez que cambia state.carrito, guardamos el arreglo en texto.
  // -------------------------------------------------------------------
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(state.carrito));

      // Ayuda didáctica: muestra la clave y el valor guardado en consola.
      console.log(
        '%c[CARRITO] Guardado en localStorage',
        'color:#10b981;font-weight:bold',
        'Clave: ' + CLAVE_CARRITO,
        state.carrito
      );
    } catch (error) {
      console.error('No se pudo guardar el carrito:', error);
    }
  }, [state.carrito]);

  // Ayuda didáctica: instrucciones una sola vez al abrir la app.
  useEffect(() => {
    console.log(
      '%c[CARRITO] Cómo verificar localStorage',
      'background:#059669;color:#fff;font-weight:bold;padding:4px;border-radius:4px',
      '\nClave: ' + CLAVE_CARRITO +
      '\n1. Abre DevTools (F12) y ve a Application -> Local Storage.' +
      '\n2. Selecciona el origen del proyecto (localhost).' +
      '\n3. Busca la clave: ' + CLAVE_CARRITO +
      '\n4. Agrega un producto y recarga con F5.'
    );
  }, []);

  // -------------------------------------------------------------------
  // 9) MÉTODOS PÚBLICOS
  // La UI no usa dispatch directamente: usa estos métodos.
  // -------------------------------------------------------------------
  const agregarAlCarrito = (producto, cantidad = 1) =>
    dispatch({ type: 'AGREGAR', producto, cantidad });

  const eliminarDelCarrito = (id) =>
    dispatch({ type: 'ELIMINAR', id });

  const actualizarCantidad = (id, cantidad) =>
    dispatch({ type: 'ACTUALIZAR_CANTIDAD', id, cantidad });

  const vaciarCarrito = () => dispatch({ type: 'VACIAR' });

  // -------------------------------------------------------------------
  // 10) TOTALES DERIVADOS
  // No son estado: se recalculan en cada render a partir del carrito.
  // -------------------------------------------------------------------
  const totalArticulos = state.carrito.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  // Subtotal con descuento aplicado.
  const totalPrecio = Number(
    state.carrito
      .reduce((acc, item) => acc + calcularPrecio(item) * item.cantidad, 0)
      .toFixed(2)
  );

  // Diferencia entre el precio base y el precio con descuento.
  const totalAhorro = Number(
    state.carrito
      .reduce(
        (acc, item) =>
          acc + (item.price - calcularPrecio(item)) * item.cantidad,
        0
      )
      .toFixed(2)
  );

  // -------------------------------------------------------------------
  // 11) REGLAS DE ENVÍO
  // - Carrito vacío: envío 0.
  // - Subtotal mayor o igual al mínimo: envío gratis.
  // - En otro caso: se cobra ENVIO.
  // -------------------------------------------------------------------
  const envio =
    totalPrecio === 0 || totalPrecio >= MINIMO_ENVIO_GRATIS ? 0 : ENVIO;

  const totalConEnvio = Number((totalPrecio + envio).toFixed(2));

  // Cuánto falta para el envío gratis y qué porcentaje se lleva.
  const faltanteEnvio = Math.max(0, MINIMO_ENVIO_GRATIS - totalPrecio);
  const progresoEnvio = Math.min(
    100,
    (totalPrecio / MINIMO_ENVIO_GRATIS) * 100
  );

  // -------------------------------------------------------------------
  // 12) FORMATEO EN BOLÍVARES
  // Recibe un monto en DÓLARES y devuelve el texto en Bs.
  // La multiplicación por TASA_BCV ocurre UNA sola vez, aquí.
  // -------------------------------------------------------------------
  const formatearBs = (montoUsd) =>
    'Bs. ' +
    Number(montoUsd * TASA_BCV).toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // -------------------------------------------------------------------
  // 13) PUBLICACIÓN
  // Todo lo que esté aquí queda disponible con useCarrito().
  // -------------------------------------------------------------------
  return (
    <CarritoContext.Provider
      value={{
        carrito: state.carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        totalArticulos,
        totalPrecio,
        totalAhorro,
        calcularPrecio,
        tasa: TASA_BCV,
        formatearBs,
        envio,
        totalConEnvio,
        faltanteEnvio,
        progresoEnvio,
        minimoEnvioGratis: MINIMO_ENVIO_GRATIS,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

// ---------------------------------------------------------------------
// 14) HOOK PERSONALIZADO
// Forma segura de consumir el Context desde cualquier componente.
// ---------------------------------------------------------------------
export const useCarrito = () => {
  const context = useContext(CarritoContext);

  if (!context) {
    throw new Error('useCarrito debe usarse dentro de un <CarritoProvider>');
  }

  return context;
};