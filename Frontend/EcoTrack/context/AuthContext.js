import { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/ApiServices';

const AuthContext = createContext();

const STORAGE_KEYS = {
    USER: '@ecotrack:user',
    TOKEN: '@ecotrack:token',
    REFRESH_TOKEN: '@ecotrack:refreshToken'
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);   
    
    const login = async (name, password) => {
        try {
            const data = await authService.login(name, password);
            // Ahora el ID viene directamente de la respuesta del servidor
            const userData = { id: data.id, name };
            
            await AsyncStorage.multiSet([
                [STORAGE_KEYS.USER, JSON.stringify(userData)],
                [STORAGE_KEYS.TOKEN, data.accesstoken],
                [STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken]
            ]);
            
            setUser(userData);
            setToken(data.accesstoken);
            setRefreshToken(data.refreshToken);
            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const data = await authService.register(name, email, password);
            return data;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
            setUser(null);
            setToken(null);
            setRefreshToken(null);
        } catch (error) {
            console.error('Error en logout:', error);
            // Aún si falla el logout en el servidor, limpiamos el estado local
            await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
            setUser(null);
            setToken(null);
            setRefreshToken(null);
            throw error;
        }
    };    
    
    const checkAuth = async () => {
        try {
            const [userResult, tokenResult, refreshTokenResult] = await AsyncStorage.multiGet([
                STORAGE_KEYS.USER,
                STORAGE_KEYS.TOKEN,
                STORAGE_KEYS.REFRESH_TOKEN
            ]);
            
            const savedUser = userResult[1];
            const savedToken = tokenResult[1];
            const savedRefreshToken = refreshTokenResult[1];

            if (savedUser && savedToken && savedRefreshToken) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking auth:', error);
            return false;
        }
    };    
    
    return (
        <AuthContext.Provider value={{ 
            user, 
            token,
            refreshToken, 
            login, 
            logout, 
            register, 
            checkAuth,
            isAuthenticated: !!user 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
