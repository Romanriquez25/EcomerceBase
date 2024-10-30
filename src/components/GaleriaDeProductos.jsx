import React, { useState, useEffect } from 'react';
import ProductCard from '../shared/ProductCard';

const GaleriaDeProductos = () => {
  const [productos, setProductos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 20;

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3000/productos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosActuales = productos.slice(indicePrimerProducto, indiceUltimoProducto);

  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Galería de Productos</h2>
      <div className="grid grid-cols-5 gap-4">
        {productosActuales.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPaginas }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setPaginaActual(index + 1)}
            className={`px-4 py-2 mx-1 ${paginaActual === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GaleriaDeProductos;