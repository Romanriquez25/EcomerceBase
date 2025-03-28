import { useContext } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { ProductoContext } from '../Context/ProductoContext';
import PropTypes from 'prop-types';

const ProductCard = ({ producto }) => {
  const { agregarAlCarrito } = useContext(ProductoContext);

  const handleAgregarAlCarrito = () => {
    if (producto.stock > 0) {
      agregarAlCarrito(producto);
    } else {
      alert('Producto sin stock');
    }
  };

  return (
    <div className="border p-4 m-2">
      <img src={producto.image} alt={producto.title} className="w-full h-32 object-cover mb-2" />
      <h3 className="text-lg font-bold">{producto.title}</h3>
      <p>{producto.description}</p>
      <p className="text-green-500">${producto.price}</p>
      <p className="text-red-500">Stock: {producto.stock}</p>
      <button
        className="text-green-500 hover:text-green-700"
        onClick={handleAgregarAlCarrito}
        disabled={producto.stock === 0}
      >
        <FaShoppingCart /> Agregar al Carrito
      </button>
    </div>
  );
};

ProductCard.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;