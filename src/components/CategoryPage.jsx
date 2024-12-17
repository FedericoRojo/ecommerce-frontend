import { useEffect, useState, useRef, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../styles/CategoryPage.css';


function CategoryPage({categories, categorySearch, setCategorySearch, setLoadCategories,
                        parentCategories, setParentCategories, loggedIn, cart, setCart
}) {
    const navigate = useNavigate();
    const observer = useRef();
    const location = useLocation();

    //const [parentCategories, setParentCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [sort, setSort] = useState();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [limit, setLimit] = useState(12);
    const [offset, setOffset] = useState(0);
    const [limitReached, setLimitReached] = useState(false);
    const [searchCategory, setSearchCategory] = useState(null);
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    
    const queryParams = new URLSearchParams(location.search);
    const categoryID = queryParams.get('category');
    
    useEffect(() => {
        if(categories.length == 0){
            setLoadCategories(prev => !prev);
        }else{
            setCategoriesLoaded(true);
        }
    }, [categories]);

    useEffect(() => {
        if(categoriesLoaded){
            filterCategories();
        }
    }, [categoriesLoaded]);

    useEffect(() => { 
        if(categoryID != null){
            setSearchCategory(categoryID);
        }
        if(categories.length == 0){
            setLoadCategories(prev => !prev);
        }
    }, [categoryID]); 

    useEffect(() => {
        if (searchCategory != null) {
            setProducts([]); 
            setOffset(0);
            setLimitReached(false); 
        }
    }, [searchCategory]);  
    
    useEffect(() => {
        if (searchCategory && !limitReached) {
            fetchByCategory();
            filterCategories();
        }
    }, [limitReached, searchCategory]);


    useEffect(() => {
        if (offset !== 0 && limitReached == false){
            fetchByCategory(); 
        }
    }, [offset]); 
    

    const lastProductRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !limitReached) {
                setOffset(prevOffset => prevOffset + limit);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, limitReached]);

    function filterCategories(){
        if(categories.length > 0){
            const wantToCopy = findInCategory(categories, searchCategory);
            if(wantToCopy){
                setSubCategories(wantToCopy.children);
                const {id, parent_id, name} = wantToCopy;
                const root = {id, parent_id, name};
                let result = [];
                findParentsCategories(root, result);
                setParentCategories(result);
            }else{
                console.log('Category not found');
            }
            
        }
    }

    function findInCategory(array, id){
        let result = null;
        for(let i = 0; i < array.length && result == null; i++){
            if(array[i].id == id){
                result = array[i];
            }else{
                if(array[i].children.length != 0){
                    result = findInCategory(array[i].children, id);
                }
            }
        }
        return result;
    }


    function findParentsCategories(item, result) {
        result.unshift(item);
        if (item.parent_id != null) {
            const parent = findInCategory(categories, item.parent_id);
            if (parent) {
                const { id, parent_id, name } = parent;
                const aux = { id, parent_id, name };
                findParentsCategories(aux, result);
            } else {
                console.log(`Parent not found for ${item.name}`);
            }
        }
    }


    async function fetchByCategory() {
        if(!limitReached){
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/products/category/${searchCategory}?limit=${limit}&offset=${offset}`);
                if (!response.ok) {
                    
                    const errorJson = await response.json();
                    if (errorJson.error === 'Offset exceeds total number of products in this category') {
                        setLimitReached(true);
                    } else {
                        setError(errorJson.status);
                    }
                } else {
                    const json = await response.json();
                    if(json.status === 400){
                        setLimitReached(true);
                    }else{
                        setProducts(prev => [...prev, ...json.result]);
                    }
                }
            } catch (error) {
                setError(error.message);
            }
            setLoading(false);
        }
    }

    const handleSearchByCategory = (elem) => {
        setCategorySearch(elem.id);
        navigate(`/search?category=${elem.id}`);
    }

    
    const handleAddToCard = (elem) => {
        if(isProductInCart(elem) == false){
            setCart(prev => [...prev, {...elem, quantity: 1}]);
            addToCartDB(elem);
        }
    }

    async function addToCartDB(elem) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/cart`, {
                method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                body: JSON.stringify({productId: elem.id, quantity: 1})
            });
            if (!response.ok) {
                setError(response.status);
            } else {
                const json = await response.json();
                console.log('aca');
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
    <div className='cat-page-container'>
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
        <div className='cat-page-content'>
            <div className='cat-page-content-filters'>
                <div className='cat-page-content-filter-section'>
                    <h3>Categorias</h3>
                    {subCategories != null && subCategories.length != 0 && 
                    subCategories.map(elem => (
                        <div key={elem.id}>
                            <p onClick={() => handleSearchByCategory(elem)} >{elem.name}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className='cat-page-content-products-container'>
                <div className='cat-page-content-order'>
                    <p>Ordenar por: </p>
                    <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
                        <option value="">Seleccionar</option>
                        <option value="price-asc">Precio: Menor a Mayor</option>
                        <option value="price-desc">Precio: Mayor a Menor</option>
                        <option value="name-asc">Nombre: A-Z</option>
                        <option value="name-desc">Nombre: Z-A</option>
                        <option value="popularity">Popularidad</option>
                        <option value="newest">Más Recientes</option>
                    </select>
                </div>
                <div className='cat-page-content-products'>
                    {products.length > 0 ? (
                        products.map((elem, index) => (
                            <div className='product-card' 
                                key={elem.id}
                                ref={index === products.length - 1 ? lastProductRef : null}
                               
                                >
                                <div onClick={ () => navigate(`/product/${elem.id}`)}>
                                    <img src={elem.image} alt={elem.name} />
                                    <h3>{elem.name}</h3>
                                    <h3>{elem.price}</h3>
                                </div>
                                <button onClick={(event) => {
                                    event.stopPropagation();
                                    handleAddToCard(elem)}}>Añadir al carrito</button>
                            </div>
                        ))
                    ) : (
                        <p>No products available.</p>
                    )}
                    {loading && <p>Loading...</p>}
                </div>
            </div>

        </div>
    </div>
  )
}

export default CategoryPage;
