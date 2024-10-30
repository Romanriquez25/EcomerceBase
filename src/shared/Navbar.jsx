// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductoContext } from '../Context/ProductoContext';

const Navbar = () => {
  const { carrito } = useContext(ProductoContext);
  const totalProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white hover:text-gray-400">Inicio</Link>
        </li>
        <li>
          <Link to="/galeria" className="text-white hover:text-gray-400">Galería de Productos</Link>
        </li>
        <li>
          <Link to="/carrito" className="text-white hover:text-gray-400">
            Carrito ({totalProductos})
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;