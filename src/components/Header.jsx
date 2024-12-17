import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';


function Header({categories, setCategorySearch, cart, loggedIn, setLoggedIn}) {
    const navigate = useNavigate();    
    const divSearchRef = useRef(null);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showSearchResult, setShowSearchResult] = useState(false);
    const [error, setError] = useState(null);
    const [querySearch, setQuerySearch] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (divSearchRef.current && !divSearchRef.current.contains(event.target)) {
                setShowSearchResult(false);
                setProducts([]);
            }
        };
    
        if (showSearchResult) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showSearchResult]);



    useEffect(() => {
        if(products.length > 0){
            setShowSearchResult(true);
            setQuerySearch('');
        }
    }, [products]);

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const handleCategorySearch = (elem) => {
        setCategorySearch(elem.id);
        setDropdownOpen(false);
        navigate(`/search?category=${elem.id}`);
    }

    const renderCategories = (categories) => {
        return (
          <ul className='sub-menu'>
            {categories.map((category) => (
              <li key={category.id} onClick={(e) => {
                e.stopPropagation(); 
                handleCategorySearch(category)}}>
                {category.name}
                {category.children.length > 0 && renderCategories(category.children)}
              </li>
            ))}
          </ul>
        );
    };
      
    function handleSearchByQuery(){
        if(querySearch != ''){
            fetchProductsByQuerySearch();
            setDropdownOpen(false);
        }
    }

    async function fetchProductsByQuerySearch() {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/products/search?query=${querySearch}`);
            if (!response.ok) {
                setError(response.status);
            } else {
                const json = await response.json();
                setProducts(json.result);
            }
        } catch (error) {
            setError(error.message);
        }
    }

    
    async function handleLogOut() {
        localStorage.removeItem("token");
        setLoggedIn(null);
        navigate('/');
    }

  return (
    <header className='header-container'>
        <div className='content-header'>
            <div className='left-content-header'>
                { (loggedIn == null) && (
                    <button className="cart-button">
                        <i className="fa-solid fa-user" onClick={() => navigate('/login')}></i>
                    </button>)}
                { (loggedIn != null) && (
                <button className="cart-button">
                    <i className="fa fa-sign-out" onClick={() => handleLogOut()}></i>
                </button>) }
                
            </div>
            <h1 onClick={() => navigate('/')}>Fotoestudio</h1>
            <div className='right-content-header'>
                <button className="cart-button" onClick={() => navigate('/cart')}>
                    <i className="fa-solid fa-cart-shopping">
                        {cart.length !== 0 && <span className="cart-count">({cart.length})</span>}
                    </i>
                </button>
                <button className="cart-button" >
                    <i className="fa-solid fa-bag-shopping"></i>
                </button>
            </div>
        </div>
        <div className='search-header'>
            <div className='search-bar'>
                <button onClick={toggleDropdown}>Category</button>
                <input 
                type="text"
                id="querySearch"
                name="querySearch"
                value={querySearch}
                onChange={e => setQuerySearch(e.target.value)}/>
                <i className="fa-solid fa-magnifying-glass" onClick={handleSearchByQuery}></i>
            </div>
            {dropdownOpen && (
               <div className="dropdown-menu">
                    <ul>
                        {categories.map((category) => (
                            <li key={category.id} 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleCategorySearch(category)}}>
                                {category.name}
                                {category.children.length > 0 && renderCategories(category.children)}
                            </li>
                        ))}
                    </ul>
                </div>
              )
            }
            {showSearchResult && products.length != 0 && (
                <div className='search-results' ref={divSearchRef}>
                    <ul>
                        {products.map(product => (
                            <li key={product.id}>
                                <img></img>
                                <p>{product.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}       
        </div>
    </header>
  )
}

export default Header;
