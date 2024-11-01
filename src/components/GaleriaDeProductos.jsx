import { useState, useEffect } from 'react';
import ProductCard from '../shared/ProductCard';

const GaleriaDeProductos = () => {
  const [productos, setProductos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
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

  const handleBusquedaChange = (event) => {
    setTerminoBusqueda(event.target.value);
    setPaginaActual(1); // Resetear a la primera página cuando se realiza una búsqueda
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.title && producto.title.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosActuales = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={terminoBusqueda}
        onChange={handleBusquedaChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <div className="grid grid-cols-4 gap-4">
        {productosActuales.map((producto) => (
          <ProductCard
            key={producto.id}
            producto={{
              ...producto,
              price: Number(producto.price), // Convertir price a número
            }}
          />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPaginaActual(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        >
          Anterior
        </button>
        <button
          onClick={() => setPaginaActual(paginaActual + 1)}
          disabled={indiceUltimoProducto >= productosFiltrados.length}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default GaleriaDeProductos;