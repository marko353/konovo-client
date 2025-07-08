import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../assets/styles/productDetail.scss';

interface Product {
  sif_product: string;
  naziv: string;
  price: number;
  categoryName: string;
  description: string;
  imgsrc: string;
}

const ProductDetailPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
     console.log("ID iz URL:", id);
    const fetchProduct = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:5000/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found.');
          } else if (response.status === 401) {
            setError('Unauthorized. Please login again.');
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            setError('Failed to fetch product.');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setProduct(data);
      }  catch (err) {
  console.error('Fetch error:', err);
  setError('Network error, please try again.');
}
      setLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!product) return null;

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => navigate('/products')}>← Back</button>
      <div className="product-card">
        <img src={product.imgsrc} alt={product.naziv} />
        <div className="info">
          <h2>{product.naziv}</h2>
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="category">Category: {product.categoryName}</p>
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
