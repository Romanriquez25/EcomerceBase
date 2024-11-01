import React, { useContext } from 'react';
import { ProductoContext } from '../Context/ProductoContext';

const Carrito = () => {
  const { carrito } = useContext(ProductoContext);

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + producto.price * producto.cantidad, 0);
  };

  // eslint-disable-next-line no-unused-vars
  const calcularCantidadTotal = () => {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:3000/create_preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: carrito.map(producto => ({
            title: producto.title,
            unit_price: Math.round(producto.price * 100), // Convertir price a centavos y redondear a entero
            quantity: producto.cantidad,
            currency_id: 'CLP',
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const preferenceId = data.id;

      const mp = new window.MercadoPago('TEST-3c431d56-2fc2-4685-8fdf-36b2f40d9940', {
        locale: 'es-CL',
      });

      mp.checkout({
        preference: {
          id: preferenceId,
        },
      }).open();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
      <div className="grid grid-cols-5 gap-4">
        <div className="font-bold">Producto</div>
        <div className="font-bold">Cantidad</div>
        <div className="font-bold">Precio Unitario</div>
        <div className="font-bold">Total</div>
        <div className="font-bold">Descripción</div>
        <div className="font-bold">Imagen</div>
        
        {carrito.map((producto) => (
          <React.Fragment key={producto.id}>
            <div>{producto.title}</div>
            <div>{producto.cantidad}</div>
            <div>
              {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(producto.price)}
            </div>
            <div>
              {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(producto.price * producto.cantidad)}
            </div>
            <div>{producto.description}</div>
            <div><img src={producto.image} alt={producto.title} className="w-full h-32 object-cover mb-2" /></div>
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <div className="font-bold">Total Final: ${calcularTotal()}</div>
      </div>
      <div className="flex justify-end mt-4">
        <button onClick={handlePayment} className="bg-blue-500 text-white px-4 py-2 rounded">
          Pagar con Mercado Pago
        </button>
      </div>
    </div>
  );
};

export default Carrito;