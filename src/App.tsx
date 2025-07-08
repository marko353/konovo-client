import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';

const App: React.FC = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/products"
          element={token ? <ProductsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/products/:id"
          element={token ? <ProductDetailPage /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={token ? "/products" : "/login"} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
