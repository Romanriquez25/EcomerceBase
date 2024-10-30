// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';

const CarritoItem = ({ producto }) => {
  const precioFinal = (producto.precio * producto.cantidad).toFixed(2);

  return (
    <div className="border p-4 m-2">
      <img src={producto.imagen} alt={producto.nombre} className="w-full h-32 object-cover mb-2" />
      <h3 className="text-lg font-bold">{producto.nombre}</h3>
      <p>Cantidad: {producto.cantidad}</p>
      <p>Precio unitario: ${producto.precio}</p>
      <p className="text-green-500">Precio final: ${precioFinal}</p>
    </div>
  );
};

CarritoItem.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    imagen: PropTypes.string.isRequired,
    cantidad: PropTypes.number.isRequired,
  }).isRequired,
};

export default CarritoItem;