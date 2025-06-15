import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Axios para la API
const api = axios.create({
    baseURL: 'http://192.168.18.29:3000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000  // Timeout de 5 segundos
});

// Interceptor para añadir el token y manejar errores
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('@ecotrack:token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores y refrescar token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 (Unauthorized) y no hemos intentado refrescar el token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshAccessToken();
                originalRequest.headers['x-auth-token'] = newToken;
                return api(originalRequest);
            } catch (refreshError) {
                // Si no se puede refrescar el token, limpiamos el storage y forzamos logout
                await AsyncStorage.multiRemove([
                    '@ecotrack:token',
                    '@ecotrack:refreshToken',
                    '@ecotrack:user'
                ]);
                // Redirigir al login (esto debe ser manejado por el componente)
                throw new Error('Session expired');
            }
        }

        return Promise.reject(error);
    }
);

// Función para refrescar el token
const refreshAccessToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem('@ecotrack:refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await axios.post('http://localhost:3000/auth/refresh', {
            token: refreshToken
        });

        const { accessToken } = response.data;
        await AsyncStorage.setItem('@ecotrack:token', accessToken);
        return accessToken;
    } catch (error) {
        throw new Error('Unable to refresh token');
    }
};

// Servicios de autenticación
export const authService = {
    login: async (name, password) => {
        const response = await api.post('/auth/login', { name, password });
        return response.data;
    },

    register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },
};

// Servicios de información mensual
export const infoMesService = {
    getInfoMes: async (userId, mes) => {
        const response = await api.get(`/infomes/${userId}`, { params: { mes } });
        return response.data;
    },

    createInfoMes: async (mes, userId) => {
        const response = await api.post('/infomes', { mes, user: userId });
        return response.data;
    },

    addGasto: async (infoMesId, gasto) => {
        const response = await api.patch(`/infomes/${infoMesId}/gasto?accion=add`, gasto);
        return response.data;
    },

    removeGasto: async (infoMesId, gasto) => {
        const response = await api.patch(`/infomes/${infoMesId}/gasto?accion=remove`, gasto);
        return response.data;
    },

    addIngreso: async (infoMesId, ingreso) => {
        const response = await api.put(`/infomes/${infoMesId}/ingreso?accion=add`, ingreso);
        return response.data;
    },

    removeIngreso: async (infoMesId, ingreso) => {
        const response = await api.put(`/infomes/${infoMesId}/ingreso?accion=remove`, ingreso);
        return response.data;
    },
};

// Servicios de gastos diarios
export const gastosDiariosService = {
    getGastosDiarios: async (userId, fecha) => {
        try {
            const response = await api.get(`/gastosdiarios/${userId}`, { params: { fecha } });
            return response.data;
        } catch (error) {
            console.error('Error en getGastosDiarios:', error.response?.data || error.message);
            throw error;
        }
    },    
    
    createGastoDiario: async (gastoDiario) => {
        try {
            const { nombre, cantidad, tipo, fecha, user } = gastoDiario;
            const response = await api.post('/gastosdiarios/', {
                nombre,
                cantidad: Number(cantidad),
                tipo,
                fecha,
                user
            });
            return response.data;
        } catch (error) {
            console.error('Error en createGastoDiario:', error.response?.data || error.message);
            throw error;
        }
    },

    updateGastoDiario: async (id, gastoDiario) => {
        try {
            const response = await api.patch(`/gastosdiarios/${id}`, gastoDiario);
            return response.data;
        } catch (error) {
            console.error('Error en updateGastoDiario:', error.response?.data || error.message);
            throw error;
        }
    },

    deleteGastoDiario: async (id) => {
        try {
            const response = await api.delete(`/gastosdiarios/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error en deleteGastoDiario:', error.response?.data || error.message);
            throw error;
        }
    },
};

// Servicios de gastos fijos
export const gastosFijosService = {
    getGastosFijos: async (userId) => {
        const response = await api.get(`/gastosfijos/${userId}`);
        return response.data;
    },

    createGastoFijo: async (gastoFijo) => {
        const response = await api.post('/gastosfijos', gastoFijo);
        return response.data;
    },

    updateGastoFijo: async (id, gastoFijo) => {
        const response = await api.patch(`/gastosfijos/${id}`, gastoFijo);
        return response.data;
    },

    deleteGastoFijo: async (id) => {
        const response = await api.delete(`/gastosfijos/${id}`);
        return response.data;
    },
};

// Servicios de ingresos
export const ingresosService = {    
    getIngresos: async (userId) => {
        try {
            const response = await api.get(`/ingresos/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error en getIngresos:', error.response?.data || error.message);
            throw error;
        }
    },
    
    createIngreso: async (ingresoData) => {
        try {
            const response = await api.post('/ingresos', ingresoData);
            return response.data;
        } catch (error) {
            console.error('Error en createIngreso:', error.response?.data || error.message);
            throw error;
        }
    },

    updateIngreso: async (id, ingresoData) => {
        try {
            const response = await api.patch(`/ingresos/${id}`, { nombre: ingresoData.nombre, cantidad: Number(ingresoData.cantidad) });
            return response.data;
        } catch (error) {
            console.error('Error en updateIngreso:', error.response?.data || error.message);
            throw error;
        }
    },

    deleteIngreso: async (id) => {
        try {
            const response = await api.delete(`/ingresos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error en deleteIngreso:', error.response?.data || error.message);
            throw error;
        }
    }
};

// Servicios de notificaciones
export const notificacionesService = {
    getNotificaciones: async (userId) => {
        try {
            const response = await api.get(`/notificaciones/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error en getNotificaciones:', error.response?.data || error.message);
            throw error;
        }
    },

    marcarLeidoNotificacion: async (notificacionId) => {
        try {
            const response = await api.put(`/notificaciones/${notificacionId}/leida`);
            return response.data;
        } catch (error) {
            console.error('Error en markAsRead:', error.response?.data || error.message);
            throw error;
        }
    },

    createNotificacion: async (notificacionData) => {
        try {
            const response = await api.post('/notificaciones', notificacionData);
            return response.data;
        } catch (error) {
            console.error('Error en createNotificacion:', error.response?.data || error.message);
            throw error;
        }
    },

    deleteNotificacion: async (notificacionId) => {
        try {
            const response = await api.delete(`/notificaciones/${notificacionId}`);
            return response.data;
        } catch (error) {
            console.error('Error en deleteNotificacion:', error.response?.data || error.message);
            throw error;
        }
    }
};

// Servicios de usuario
export const userService = {
    updateLimiteDiario: async (userId, limite) => {
        try {
            const response = await api.put(`/users/${userId}/limite`, { limite: limite });
            return response.data;
        } catch (error) {
            console.error('Error en updateLimiteDiario:', error.response?.data || error.message);
            throw error;
        }
    },

    getLimiteDiario: async (userId) => {
        try {
            const response = await api.get(`/users/${userId}/limite`);
            return response.data;
        } catch (error) {
            console.error('Error en getLimiteDiario:', error.response?.data || error.message);
            throw error;
        }
    },
};