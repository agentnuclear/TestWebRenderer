import { url } from "../utils/url";



export const register = async (firstname,lastname,email, password) => {
  try {
    const response = await fetch(`${url}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstname,lastname,email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

export const login = async (email, password) => {
        try{

          console.log('Login function called with:', { email, password });
            const response = await fetch(`${url}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password }),
                });
            
                if (!response.ok) {
                throw new Error('Login failed');
                }
            
                const data = await response.json();

                localStorage.setItem('token', data.user.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                console.log('Login successful:', data);
                return data;
        }
        catch(error){
            console.error('Error during login:', error);
            throw error;
        }
  }
  

