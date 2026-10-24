import { createContext, useContext, useState } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    // El carrito es un arreglo de productos; cada producto lleva su 'cantidad'.
    const [carrito, setCarrito] = useState([]);

    const [modalConfirmacion, setModalConfirmacion] = useState({
        isOpen: false,
        titulo: '',
        mensaje: '',
        onConfirmar: null,
    });

    // 1) AGREGAR: si el producto ya existe, solo sube la cantidad.
    const agregarAlCarrito = (producto, cantidad = 1) => {
        setCarrito((prev) => {
            const existe = prev.find((item) => item.id === producto.id);

            if (existe) {
                return prev.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        : item
                );
            }

            return [...prev, { ...producto, cantidad }];
        });
    };

    // 2) ELIMINAR: saca el producto por completo del carrito (pide confirmación).
    const eliminarDelCarrito = (id) => {
        const producto = carrito.find((item) => item.id === id);
        const nombre = producto ? `"${producto.title}"` : 'este producto';

        setModalConfirmacion({
            isOpen: true,
            titulo: 'Eliminar producto',
            mensaje: `¿Seguro que deseas eliminar ${nombre} del carrito?`,
            onConfirmar: () => {
                setCarrito((prev) => prev.filter((item) => item.id !== id));
                setModalConfirmacion((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    // 3) ACTUALIZAR CANTIDAD: cambia el número exacto. Si llega a 0, elimina.
    const actualizarCantidad = (id, cantidad) => {
        if (cantidad <= 0) {
            eliminarDelCarrito(id);
            return;
        }
        setCarrito((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, cantidad } : item
            )
        );
    };

    // 4) VACIAR: deja el carrito en cero (pide confirmación).
    const vaciarCarrito = () => {
        setModalConfirmacion({
            isOpen: true,
            titulo: 'Vaciar carrito',
            mensaje: '¿Seguro que deseas vaciar todo el carrito?',
            onConfirmar: () => {
                setCarrito([]);
                setModalConfirmacion((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    // VALORES DERIVADOS: se recalculan solos cuando el carrito cambia.
    const totalArticulos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    const totalPrecio = carrito.reduce(
        (acc, item) => acc + item.price * item.cantidad,
        0 // <-- Corregido: se agregó el 0 inicial que faltaba
    ); 

    // Define la tasa de cambio (ajustala según el valor actual)
    const tasaCambio = 1000;
    
    // Nueva constante con el total en bolívares
    const totalPrecioBs = totalPrecio * tasaCambio;

    return (
        <CarritoContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
                eliminarDelCarrito,
                actualizarCantidad,
                vaciarCarrito,
                totalArticulos,
                totalPrecio,
                totalPrecioBs,
                modalConfirmacion,
                setModalConfirmacion,
            }}
        >
            {children}
        </CarritoContext.Provider>
    );
};

export const useCarrito = () => {
    const context = useContext(CarritoContext);
    if (!context) {
        throw new Error('useCarrito debe usarse dentro de un <CarritoProvider>');
    }
    return context;
};