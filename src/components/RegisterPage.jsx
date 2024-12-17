import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';

function LoginPage({setLoggedIn, loggedIn}  ) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(event) => {
        event.preventDefault();
        try{
            
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password, firstName, lastName})
            });

            if(!response.ok){
                setError('Register failed')
            }
            
            const data = await response.json();
            
            localStorage.setItem('token', data.token);
            
            setLoggedIn(data.result);
            navigate('/login');
        }catch(error){
            setError(error.message);
        }

    }

    return(
    <div className="register-page-container">
    <h1 className="app-title">Fotoestudio</h1>
    <div className="register-form-container">
            <h1 className="form-title">Registrate</h1>
            {error && <h2 className="error-message">{error}</h2>}
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label className="form-label">Nombre:</label>
                    <input
                        className="form-input"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        type="text"
                        name="firstName"
                        required
                    />
                </div>
                <div className="form-field">
                    <label className="form-label">Apellido:</label>
                    <input
                        className="form-input"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        type="text"
                        name="lastName"
                        required
                    />
                </div>
                <div className="form-field">
                    <label className="form-label">Email:</label>
                    <input
                        className="form-input"
                        type="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-field">
                    <label className="form-label">Password:</label>
                    <input
                        className="form-input"
                        type="password"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="register-submit-button">Registrar</button>
                <p className="form-footer">
                    Si no ya tenes cuenta, <a className="login-link">ingresa aca</a>
                </p>
            </form>
        </div>
    </div>

    )
}

export default LoginPage;