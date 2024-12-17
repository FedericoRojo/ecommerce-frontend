import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import isAutheticated from '../lib/isAuthenticated';
import HomePage from './HomePage';
import Header from './Header';
import Footer from './Footer';
import CategoryPage from './CategoryPage';
import ProductPage from './ProductPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';


function App() {
  const [loggedIn, setLoggedIn] = useState(null);
  const [categorySearch, setCategorySearch] = useState(null);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadCategories, setLoadCategories] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [reloadCart, setReloadCart] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [loadCategories])

  useEffect( () => {
    const checkAuth = async () => {
      const isAutheticatedUser = await isAutheticated();
      setLoggedIn(isAutheticatedUser);
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if(loggedIn != null && cartLoaded == false){
        if(cart.length != 0){
          addItemsToCart(); //Load items added to current, before loggedin
        }
        setCartLoaded(true);
    }
  }, [loggedIn]);

  useEffect( () => {
    if(loggedIn != null && cartLoaded){ 
      fetchCart(); //Get items added from other sessions
    }
  }, [cartLoaded]);

  useEffect(() => {
    if(loggedIn != null){
      fetchCart();
    }
  }, [reloadCart]);

  async function fetchCart(){
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/cart`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
      });
      if (!response.ok) {
          setError(response.status);
      } else {
          const json = await response.json();        
          if(json.result.length != 0){
            
            const actualCart = cart;
            const newCart = [];
            let found = false;
            for(let i = 0; i < json.result.length; i++){
              found = false;
              for(let j = 0; j < actualCart.length && !found; j++){
                if(json.result[i].id === actualCart[j].id){
                  found = true;
                }
              }
              if(!found){
                newCart.push(json.result[i]);
              }
            }
            setCart(prev => [...prev, ...newCart]);
            
          }
      }
  } catch (error) {
      setError(error.message);
  }
  }

  async function addItemsToCart() {
      if(cart.length != 0){
        const token = localStorage.getItem('token');
        for(let i = 0; i < cart.length; i++){
          try {
              const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/cart`, {
                method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                body: JSON.stringify({productId: cart[i].id, quantity: cart[i].quantity})
              });
              if (!response.ok) {
                  setError(response.status);
              } else {
                  const json = await response.json();
                  console.log('Data inserted in cart correctly');
              }
          } catch (error) {
              setError(error.message);
          }
        }
      }
      
  }

  async function fetchCategories() {
      try {
          const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/categories`);
          if (!response.ok) {
              setError(response.status);
          } else {
              const json = await response.json();
              const data = buildHierarchy(json.result);
              setCategories(data);
          }
      } catch (error) {
          setError(error.message);
      }
  }
    
  function buildHierarchy(data) {
    const map = new Map(); 
    const result = [];       
  
    data.forEach(category => {
      if (!map.has(category.id)) {
        map.set(category.id, { ...category, children: [] });
      }
  
      const node = map.get(category.id);
  
      if (category.parent_id === null) {
        result.push(node);
      } else {
        if (!map.has(category.parent_id)) {
          map.set(category.parent_id, { children: [] });
        }
        const parent = map.get(category.parent_id);
        parent.children.push(node);
      }
    });
  
    return result;
  }

 

  return (
      <Router>
        <Routes>
          <Route element={<RegisterLayout  setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>} >
            <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>}></Route>
            <Route path="/register" element={<RegisterPage setLoggedIn={setLoggedIn} loggedIn={loggedIn} />} ></Route>
          </Route>
          <Route element={<MainLayout categories={categories} 
                                      categorySearch={categorySearch} setCategorySearch={setCategorySearch}
                                      setLoadCategories={setLoadCategories} 
                                      parentCategories={parentCategories} setParentCategories={setParentCategories}
                                      loggedIn={loggedIn} setLoggedIn={setLoggedIn}
                                      cart={cart} setCart={setCart}/>}>

                  <Route path="/" element={<HomePage />}></Route>

                  <Route path="/search" element={<CategoryPage categories={categories} 
                    categorySearch={categorySearch} setCategorySearch={setCategorySearch}
                    setLoadCategories={setLoadCategories} 
                    parentCategories={parentCategories} setParentCategories={setParentCategories}
                    loggedIn={loggedIn}
                    cart={cart} setCart={setCart}/>}></Route>

                  <Route path="/product/:id" element={<ProductPage parentCategories={parentCategories}
                      setCategorySearch={setCategorySearch}
                      loggedIn={loggedIn}
                      cart={cart} setCart={setCart}  />}></Route>

                  <Route path="/cart" element={<CartPage 
                    cart={cart} setCart={setCart} setReloadCart={setReloadCart}
                    loggedIn={loggedIn}/>}></Route>

                  <Route path="/checkout" element={<CheckoutPage cart={cart} loggedIn={loggedIn}  />}></Route>

          </Route>
          
        </Routes>
      </Router>
  )
}


function RegisterLayout({setLoggedIn, loggedIn}) {
  return (
    <>
    <Outlet />
    </>
  );
}

function MainLayout({categories, categorySearch, setCategorySearch, setLoadCategories, parentCategories, 
                     setParentCategories, loggedIn, setLoggedIn, cart, setCart}) {
  return (
    <>
      <Header categories={categories} setCategorySearch={setCategorySearch} cart={cart}
              loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      <div className='app-container'>
        <Outlet />
      </div>
      <Footer/>
    </>
  );
}

export default App
