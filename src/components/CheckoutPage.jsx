import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import '../styles/CheckoutPage.css';


function CheckoutPage({cart, loggedIn}) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [progressShow, setProgressShow] = useState(1);
    const [email, setEmail] = useState('');
    const  [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [shipment, setShipment] = useState('');
    const [cp, setCp] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [provincia, setProvincia] = useState('');
    const [calle, setCalle] = useState('');
    const [numeroDepto, setNumeroDepto] = useState();
    const [numeroDir, setNumeroDir] = useState();
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if(loggedIn != null){
            console.log(loggedIn);
            setEmail(loggedIn.email);
            setName(`${loggedIn.first_name} ${loggedIn.last_name}`);
        }
    }, [loggedIn]);

    function handleProgress(){
        setProgressShow(prev => prev+1);
    }

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

    
    function handleShipment(){
        setShipment(true);
    }
    
    function handleNoShipment(){
        setShipment(false);
    }

    


  return (
      <div className='checkout-general-container'>
        <div className='checkout-data-container'>
            {(progressShow >= 1) && (
                <div className='checkout-indentification-container'>
                    {loggedIn != null ? 
                        (<div className='checkout-identification-form'>
                            <h2>Identificación</h2>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                disabled
                            />
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                disabled
                            />
                            <label htmlFor="phone">Telefono:</label>
                            <input
                                type="number"
                                id="phone"
                                name="phone"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                            />
                            <button onClick={handleProgress}>Siguiente</button>
                        </div>) : 
                        (<p>Ingresa con tu cuenta para poder comprar. <a onClick={() => navigate('/login')}>Ingresar</a></p>)}
                </div>
            )}
            {(progressShow >= 2) && 
                (<div className='checkout-shipment-container'>
                        <h2>Envío:</h2>
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
                            <div className='checkout-identification-form'>
                                <label htmlFor="number">CP:</label>
                                <input
                                    type="number"
                                    id="cp"
                                    name="cp"
                                    value={cp}
                                    onChange={e => setCp(e.target.value)}
                                />
                                <span>Dirección de entrega</span>
                                <label htmlFor="provincia">Provincia:</label>
                                <input
                                    required
                                    type="text"
                                    id="provincia"
                                    name="provincia"
                                    value={provincia}
                                    onChange={e => setProvincia(e.target.value)}
                                />
                                <label htmlFor="ciudad">Ciudad:</label>
                                <input
                                    required
                                    type="text"
                                    id="ciudad"
                                    name="ciudad"
                                    value={ciudad}
                                    onChange={e => setCiudad(e.target.value)}
                                />
                                <label htmlFor="calle">Calle:</label>
                                <input
                                    required
                                    type="text"
                                    id="calle"
                                    name="calle"
                                    value={calle}
                                    onChange={e => setCalle(e.target.value)}
                                />
                                <label htmlFor="numeroDir">Numero de direccion:</label>
                                <input
                                    required
                                    type="number"
                                    id="numeroDir"
                                    name="numeroDir"
                                    value={numeroDir}
                                    onChange={e => setNumeroDir(e.target.value)}
                                />
                                <label htmlFor="numeroDepto">Numero de departamento:</label>
                                <input
                                    type="number"
                                    id="numeroDepto"
                                    name="numeroDepto"
                                    value={numeroDepto}
                                    onChange={e => setNumeroDepto(e.target.value)}
                                />
                                
                            </div>
                        ) : (
                        <div className='checkout-identification-form'>
                            <p>Podes retirar tu pedido sin costo de envio en Macachin, España 370</p>
                            <button onClick={handleProgress}>Siguiente</button>
                        </div>)}
                </div>
            )}
            {(progressShow >= 3) && (
                <div className='checkout-identification-form'>
                    <h2>Pago</h2>
                    <div>
                        <img></img>
                        <h5>MercadoPago</h5>
                    </div>
                    <img></img>
                </div>
            )}
        </div>
        <div className='payment-info-container'>
                <div className="payment-content">
                    {(cart.map(elem => (
                        <div className="payment-item" key={elem.id}>
                            <div className="product-details">
                                <img alt="Product Name" />
                                <span>{elem.name}</span>
                            </div>
                            <span>x{elem.quantity}</span>
                            <span>${elem.price}</span>
                        </div>
                    )))}  
                </div>
                <button className="btnBackToCart" onClick={() => navigate('/cart')}>Volver al carrito</button>
                <div>
                    <h3>Total: ${total}</h3>
                </div>
                <button className='buy-btn'>Comprar ahora</button>
        </div>
      </div>
  )
}



export default CheckoutPage;
