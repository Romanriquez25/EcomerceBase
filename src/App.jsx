// App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './components/Index';
import GaleriaDeProductos from './components/GaleriaDeProductos';
import Carrito from './components/Carrito';
import Navbar from './shared/Navbar';
import { ProductoProvider } from './Context/ProductoContext';
import Login from './components/Login';
import CargarProductos from './components/CargarProductos';

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <ProductoProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/galeria" element={<GaleriaDeProductos />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route
            path="/cargar-productos"
            element={token ? <CargarProductos token={token} /> : <Login setToken={setToken} />}
          />
        </Routes>
      </Router>
    </ProductoProvider>
  );
};

export default App;