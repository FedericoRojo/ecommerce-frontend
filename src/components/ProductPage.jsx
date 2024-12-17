import { useEffect, useState } from 'react'
import { BrowserRouter as Router, useNavigate, useParams } from 'react-router-dom';
import '../styles/ProductPage.css';

function ProductPage({parentCategories, setCategorySearch, loggedIn, cart, setCart}) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [searchProduct, setSearchProduct] = useState(null);
    const [searchRelatedParam, setSearchRelatedParam] = useState(null);

    useEffect(() => {
        if(id != null){
            setSearchProduct(id);
        }
    }, [id]);

    useEffect(() => {
        if(searchProduct != null){
            fetchProduct();
        }
    }, [searchProduct]);

    useEffect(() => {
        if(product != null){
            setSearchRelatedParam(product.category_id);
        }
    }, [product]);

    useEffect(() => {
        if(searchRelatedParam != null){
            fetchRelatedProducts();
        }
    }, [searchRelatedParam]);

    async function fetchRelatedProducts(){
        if(searchRelatedParam != null){
            setLoadingProducts(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/products/category/${searchRelatedParam}?limit=4&offset=0`);
                if (!response.ok) {
                    const errorJSON = await response.json();
                    setError(errorJSON);
                } else {
                    const json = await response.json();
                    const filteredArray = json.result.filter(item => item.id != product.id);
                    setRelatedProducts(filteredArray);
                }
            } catch (error) {
                setError(error.message);
            }
            setLoadingProducts(false);
        }
    }



    async function fetchProduct(){
        if(searchProduct != null){
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/products/${searchProduct}`);
                if (!response.ok) {
                    const errorJSON = await response.json();
                    setError(errorJSON);
                } else {
                    const json = await response.json();
                    setProduct(json.result);
                }
            } catch (error) {
                setError(error.message);
            }
            setLoading(false);
        }
    }

    const handleIncrease = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrease = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const handleAddToCart = (elem) => {
        console.log();
        if(isProductInCart(elem) == false){
            setCart(prev => [...prev, {...elem, quantity: quantity}]);
            addToCartDB(elem, quantity)
        }
    }

    async function addToCartDB(elem, quant) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/cart`, {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            body: JSON.stringify({productId: elem.id, quantity: quant})
            });
            if (!response.ok) {
                setError(response.status);
            } else {
                const json = await response.json();
            }
        } catch (error) {
            setError(error.message);
        }
        
  }

    function isProductInCart(elem){
        let result = false;
        for(let i = 0; i < cart.length; i++){
            if(cart[i].id == elem.id){
                result = true;
            }
        }
        return result;
    }


  return (
     <div className='product-page-container'>
        <div className='product-information-container'>
            <div className='product-info-data'>
                <div className='image-container'>
                    <div className='cat-page-cat-status'>
                        {parentCategories.length != 0 && (
                            <p>
                            {parentCategories.map((category, index) => (
                            <span key={category.id}  className="category-item">
                                <a
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    handleSearchByCategory(category);
                                }}
                                    className="category-link"
                                >
                                {category.name}
                                </a>
                                {index < parentCategories.length - 1 && <span className="separator"> / </span>}
                            </span>
                            ))}
                        </p>

                        )}
                    </div>
                    <img></img>
                </div>
                { loading ? ( <p>Loading..</p> ) : 
                    ( product != null ? (
                        <div className='product-info-data-details'>
                            <h1>{product.name}</h1>
                            <p>Descripcion</p>
                            <p>{product.description}</p>
                            <h2>Precio: ${product.price}</h2>
                        </div>
                    ) : (
                        <p>Algo sucedio</p>
                    ))}
               
            </div>
            <div className='product-info-payment'>
                <div className="quantity-selector">
                    <button className="quantity-btn" onClick={handleDecrease}>-</button>
                    <input 
                        className="quantity-input"
                        value={quantity} 
                        readOnly
                    />
                    <button className="quantity-btn" onClick={handleIncrease}>+</button>
                </div>
                <button className='pay-button' onClick={() => handleAddToCart(product)}>Añadir al carrito</button>
            </div>
        </div>
        <div className='other-products-container'>
            <h2>Quizas te interesan los siguientes productos: </h2>
            {   loadingProducts ? (<p>Loading products</p>) : 
                    (
                        (relatedProducts.length != 0) ? (
                            <div className='other-products'>
                                {relatedProducts.map(elem => (
                                        <div className='other-product-card' key={elem.id}>
                                                <img />
                                                <h3>{elem.name}</h3>
                                                <h3>${elem.price}</h3>
                                                <button>Comprar</button>
                                        </div>
                                ))}
                            </div>
                           ) : (<></>)
                    )
            }
        </div>
     </div>
  )
}

export default ProductPage
