class Auth {
    static API_URL = 'https://localhost:3000';
    static TOKEN_KEY = 'jwt_token';

    static async login(username, password) {
        try {
            const response = await fetch(`${this.API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const { token } = await response.json();
            this.setToken(token);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    static setToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } catch (error) {
            return false;
        }
    }

    static logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        window.location.href = '/login.html';
    }

    static async fetchWithAuth(url, options = {}) {
        const token = this.getToken();
        if (!token) {
            throw new Error('No authentication token');
        }

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(url, { ...options, headers });
        
        if (response.status === 401) {
            this.logout();
            throw new Error('Session expired');
        }

        return response;
    }

    static validateOTPSession() {
        const otpValidated = sessionStorage.getItem('otpValidated');
        if (!otpValidated) {
            this.logout('Sesi tidak valid. Silakan login kembali.');
        }
    }
} 