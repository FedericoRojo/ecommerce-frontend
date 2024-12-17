import { useEffect, useState } from 'react';
import '../styles/Carrousel.css';

function Carrousel() {
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const newVisibleProducts = [];
        for(let i = 0; i < 5; i++){
            newVisibleProducts.push(products[(currentIndex + i) % products.length])
        }
        setVisibleProducts(newVisibleProducts);
    }, [currentIndex]);

    const nextImages = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 5) % products.length);
    }

    const prevImages = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 5 + products.length) % products.length);
    }



  return (
    <div className="carousel-container">
      <div className="static-label">Lo más vendido</div>
      <div className="carousel">
        <button className="arrow left-arrow" onClick={prevImages}>
           
            <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="carousel-images">
          {visibleProducts.map((product, index) => (
            <div key={index} className="carousel-item">
              <img src={product} alt={`Product ${index + 1}`} />
            </div>
          ))}
        </div>
        <button className="arrow right-arrow" onClick={nextImages}>
            <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  )
}

export default Carrousel;
