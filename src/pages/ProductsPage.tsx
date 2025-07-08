import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/products.scss';

interface Product {
  sif_product: string;
  naziv: string;
  price: number;
  categoryName: string;
  description: string;
  imgsrc: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:5000/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Unauthorized. Please login again.');
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            setError('Failed to fetch products.');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Network error, please try again.');
      }
      setLoading(false);
    };

    fetchProducts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="products-page">
      <h2>Products</h2>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <ul className="product-list">
            {currentProducts.map((product) => (
              <li
                key={product.sif_product}
                className="product-card"
                onClick={() => navigate(`/products/${product.sif_product}`)}
              >
                <img src={product.imgsrc} alt={product.naziv} />
                <strong>{product.naziv}</strong>
                <div className="price">${product.price.toFixed(2)}</div>
                <div className="category">Category: {product.categoryName}</div>
                <div
                  className="description"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              ← Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsPage;
