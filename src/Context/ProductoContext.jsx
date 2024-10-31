import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ProductoContext = createContext();

export const ProductoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find((item) => item.id === producto.id);
      if (productoExistente) {
        if (productoExistente.cantidad < producto.stock) {
          return prevCarrito.map((item) =>
            item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
          );
        } else {
          alert('No hay suficiente stock disponible');
          return prevCarrito;
        }
      } else {
        if (producto.stock > 0) {
          return [...prevCarrito, { ...producto, cantidad: 1 }];
        } else {
          alert('Producto sin stock');
          return prevCarrito;
        }
      }
    });
  };

  return (
    <ProductoContext.Provider value={{ carrito, agregarAlCarrito }}>
      {children}
    </ProductoContext.Provider>
  );
};

ProductoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};