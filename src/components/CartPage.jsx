import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import '../styles/CartPage.css';



/*
Situaciones en las que se modifica el carrito:
1- Product page: añadir carrito
    a- Logeado: lo agrego en db
    b- NoLogeado: solo en frontend
2- Category page: añadir carrito
    a- Logeado: lo agrego en db
    b- NoLogeado: solo en frontend
3- CartPage: modificar carrito
    a- Logeado: lo agrego en db
    b- NoLogeado: solo en frontend

Si tengo cosas en el carrito y me logeo, entonces creo un carrito para ese usuario logeado.
Si ese usuario logeado ya tenia un carrito lo reemplazo con los datos actuales

*/ 

function CartPage({cart, setCart, setReloadCart, loggedIn}) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [shipment, setShipment] = useState(true);
    const [locationCode, setLocationCode] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if(cart.length > 0){
            setTotal(sumTotal());
        }
        
    }, [cart]);

    function sumTotal() {
        let result = 0;
        for(let i = 0; i < cart.length; i++){
            result = result + ( Number(cart[i].price) * cart[i].quantity);
        }
        result = Number(result.toFixed(2));
        return result;
    }


    const handleIncrease = (elem) => {
        setCart( prevCart => 
            prevCart.map(item => {
                let result = null;
                if(item.id === elem.id){
                    result = {...item, quantity: item.quantity + 1};
                    updateQuantityDB(result);
                }else{
                    result = item;
                }
                return result;
        }))
    };

    const handleDecrease = (elem) => {
        setCart( prevCart => prevCart.map(item => {
            let result = null;
            if(item.id = elem.id){
                result = {...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 };
                updateQuantityDB(result);
            }else{
                result = item;
            }
            return result;
        }))
    };

    async function updateQuantityDB(elem){
        try{
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/cart/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({productID: elem.id, quantity: elem.quantity})
              });
            if(!response.ok){
                setError('Error while updating quantity in cart');
            }else{
                const json = await response.json();
                console.log(json);
                
            }
        }catch(e){
            setError(e);
        }
    }

    function handleShipment(){
        setShipment(true);
    }
    
    function handleNoShipment(){
        setShipment(false);
    }

    async function handleDelete(elem){
        try{
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/cart/${elem.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: token
                    }
                }
            );
            if(!response.ok){
                setError('Error while deleting from cart');
            }else{
                const json = await response.json();
                setCart(prev => prev.filter(item => item.id != elem.id));
                setReloadCart(prev => !prev);
            }
        }catch(e){
            setError(e);    
        }
    }

    function handleFinishBuy(){

    }

  return (
      <div className='cart-page-container'>
        <div className='cart-container'>
            <div>
                <h1>Mi compra</h1>
            </div>
            { (cart.length > 0) ? (
                <>
                    <div className="cart-content">
                        <div className="cart-header">
                            <span>Product</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span></span> 
                        </div>
                        {(cart.map(elem => (
                            <div className="cart-item" key={elem.id}>
                                <div className="product-details">
                                    <img alt="Product Name" />
                                    <span>{elem.name}</span>
                                </div>
                                <span>${elem.price}</span>
                                <div className="cart-quantity-selector">
                                    <button className="cart-quantity-btn" onClick={() => handleDecrease(elem)}>-</button>
                                    <input 
                                        className="quantity-input"
                                        value={elem.quantity} 
                                        readOnly
                                    />
                                    <button className="cart-quantity-btn" onClick={() => handleIncrease(elem)}>+</button>
                                </div>
                                <button className="delete-button" onClick={() => handleDelete(elem)}>X</button>
                            </div>
                        )))}
                        
                    </div>
                    <div>
                        <h3>Total: ${total}</h3>
                    </div>
                </>
            ) : 
            (<p>No items in cart</p>)
            }
        </div>
        <div className='cart-page-process-data'>
            <div className='cart-page-shipment'>
                <div className='shipment-options'>
                    <button 
                        className={shipment ? 'active' : ''} 
                        style={{
                            borderTopLeftRadius: '5px',
                            borderBottomLeftRadius: '5px'
                        }}
                        onClick={handleShipment}>Enviar</button>
                    <button 
                        style={{
                            borderTopRighttRadius: '5px',
                            borderBottomRightRadius: '5px'
                        }}
                        className={!shipment ? 'active' : ''} 
                        onClick={handleNoShipment}>Retirar</button>
                </div>
                {shipment ? (
                    <div className='shipment-calculation-container'>
                        <div className='shipment-location-container'>
                            { locationCode ? (
                                <button>Modificar</button>
                            ) : (
                                <button>Ingresar</button>
                            )}
                            <label>CP:</label>
                            <input  type="number"
                                    name="location"
                                    value={locationCode}
                                    onChange={e => setLocationCode(e.target.value)}
                                    required />
                        </div>
                        {locationCode && (
                            <div>
                                <span>Entrega en hasta 3 dias</span>
                                <span>$20000</span>
                            </div>
                        )}
                    </div>
                ) : (<p>Podes retirar tu pedido sin costo de envio en Macachin, España 370</p>)}
            </div>
            <div className='cart-page-payment'>
                <p>Total: ${total}</p>
                <button onClick={() => navigate('/')}>Elegir mas productos</button>
                <button onClick={() => navigate('/checkout')}>Finalizar Compra</button>
            </div>
        </div>
      </div>
  )
}



export default CartPage;
