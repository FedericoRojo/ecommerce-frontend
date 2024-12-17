export default async function isAuthenticated() {
    let result = null;
    const token = localStorage.getItem('token');
    if (token != null) {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/users/auth`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token
                 }
            });

            if (response.ok) {
                const data = await response.json();
                result = data.result;
            } else {
                console.log("Token is invalid or expired");
            }
        } catch (error) {
            console.error("Token validation failed", error);
        }
    }
    
    return result;
}
