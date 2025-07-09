import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/products.scss';

interface Product {
  id: string;
  naziv: string;
  price: number;
  categoryName: string | null;
  description: string;
  imgsrc: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';


const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
        const response = await fetch(`${API_URL}/products`, {
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
  console.error(err);
}

      setLoading(false);
    };

    fetchProducts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Kreiranje liste kategorija sa 'all' i bez duplikata
  const categories = ['all', ...Array.from(new Set(products.map(p => p.categoryName ?? 'N/A')))];

  // Filtriranje proizvoda po kategoriji i pretrazi
  const filteredProducts = products.filter((product) => {
    const productCategory = product.categoryName ?? 'N/A';
    const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;
    const matchesSearch = product.naziv.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logika
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  if (loading) return <p className="loading">Loading products...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="products-page">
      <header>
        <h2>Products</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="category-select"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'N/A' ? 'No Category' : cat}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <>
          <ul className="product-list">
            {currentProducts.map(product => (
              <li
                key={product.id}
                className="product-card"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <img src={product.imgsrc} alt={product.naziv} />
                <div className="product-info">
                  <h3>{product.naziv}</h3>
                  <p className="price">${product.price.toFixed(2)}</p>
                  <p className="category">{product.categoryName ?? 'No Category'}</p>
                  <p
                    className="description"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>← Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>Next →</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsPage;
