import React, { useContext } from 'react';
import { ProductoContext } from '../Context/ProductoContext';

const Carrito = () => {
  const { carrito } = useContext(ProductoContext);

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + producto.price * producto.cantidad, 0).toFixed(2);
  };

  // eslint-disable-next-line no-unused-vars
  const calcularCantidadTotal = () => {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="font-bold">Nombre del Producto</div>
        <div className="font-bold">Cantidad</div>
        <div className="font-bold">Valor Unitario</div>
        <div className="font-bold">Total</div>
        {carrito.map((producto) => (
          <React.Fragment key={producto.id}>
            <div>{producto.title}</div>
            <div>{producto.cantidad}</div>
            <div>${producto.price}</div>
            <div>${(producto.price * producto.cantidad).toFixed(2)}</div>
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <div className="font-bold">Total Final: ${calcularTotal()}</div>
      </div>
    </div>
  );
};

export default Carrito;