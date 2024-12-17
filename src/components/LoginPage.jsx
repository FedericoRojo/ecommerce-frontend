import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

function LoginPage({setLoggedIn, loggedIn}  ) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(event) => {
        event.preventDefault();
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password})
            });

            if(!response.ok){
                throw new Error('Login failed');
            }
            
            const data = await response.json();
            
            localStorage.setItem('token', data.token);
            
            setLoggedIn(data.result);
            navigate('/');
        }catch(error){
            setError(error.message);
        }

    }

    return(
        <div className="login-page-container">
            <h1 onClick={() => navigate('/')}>Fotoestudio</h1> 
            <div className="login-form-container">
                <h1>Login</h1>
                {error && <h2 className="error-message">{error}</h2>}
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="form-submit-button">Log in</button>
                    <p>Si no tenes cuenta, <a onClick={() => navigate('/register')}>registrate aca</a></p>
                </form>

            </div>
        </div>
    )
}

export default LoginPage;