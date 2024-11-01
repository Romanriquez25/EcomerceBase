import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';

const CargarProductos = ({ token }) => {
  const [productos, setProductos] = useState([]);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    stock: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/productos', {
          headers: { 'x-access-token': token },
        });
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProductos();
  }, [token]);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleCargarProductos = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const productosConId = [];
      for (const producto of json) {
        try {
          const response = await axios.post('http://localhost:3000/productos', {
            title: producto.title,
            description: producto.description,
            price: producto.price,
            image: producto.image,
            stock: producto.stock,
          }, {
            headers: { 'x-access-token': token },
          });
          productosConId.push(response.data);
        } catch (error) {
          console.error('Error al agregar producto:', error);
        }
      }

      setProductos([...productos, ...productosConId]);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      // Editar producto existente
      try {
        const response = await axios.put(`http://localhost:3000/productos/${editId}`, formData, {
          headers: { 'x-access-token': token },
        });
        setProductos(productos.map(producto => (producto.id === editId ? response.data : producto)));
        setEditId(null);
      } catch (error) {
        console.error('Error al editar producto:', error);
      }
    } else {
      // Agregar nuevo producto
      try {
        const response = await axios.post('http://localhost:3000/productos', formData, {
          headers: { 'x-access-token': token },
        });
        setProductos([...productos, response.data]);
      } catch (error) {
        console.error('Error al agregar producto:', error);
      }
    }
    setFormData({
      title: '',
      description: '',
      price: '',
      image: '',
      stock: '',
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/productos/${id}`, {
        headers: { 'x-access-token': token },
      });
      setProductos(productos.filter(producto => producto.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const handleEdit = (producto) => {
    setFormData({
      title: producto.title,
      description: producto.description,
      price: producto.price,
      image: producto.image,
      stock: producto.stock,
    });
    setEditId(producto.id);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{editId ? 'Editar Producto' : 'Agregar Producto Manualmente'}</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleInputChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="image"
          placeholder="URL de la Imagen"
          value={formData.image}
          onChange={handleInputChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleInputChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          {editId ? 'Guardar Cambios' : 'Agregar Producto'}
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Cargar Productos desde CSV o Excel</h2>
      <div className="flex items-center">
        <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileUpload} className="mr-4" />
        <button onClick={handleCargarProductos} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Cargar Productos
        </button>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Listado de Productos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {productos.map((producto) => (
          <div key={producto.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">{producto.title}</h3>
            <p className="text-gray-600">{producto.description}</p>
            <p className="text-gray-800 font-bold">Precio: ${producto.price}</p>
            <p className="text-gray-600">Stock: {producto.stock}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEdit(producto)}
                className="bg-yellow-500 text-white py-1 px-4 rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(producto.id)}
                className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

CargarProductos.propTypes = {
  token: PropTypes.string.isRequired,
};

export default CargarProductos;