// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './components/Index';
import GaleriaDeProductos from './components/GaleriaDeProductos';
import Carrito from './components/Carrito';
import Navbar from './shared/Navbar';
import { ProductoProvider } from './Context/ProductoContext';

const App = () => {
  return (
    <ProductoProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/galeria" element={<GaleriaDeProductos />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
      </Router>
    </ProductoProvider>
  );
};

export default App;