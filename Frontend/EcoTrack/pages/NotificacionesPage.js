import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import NotificacionesGrid from '../components/NotificacionesGrid';
import { notificacionesService } from '../services/ApiServices';
import colors from '../themes/colors';

export default function NotificacionesPage() {
    const { user } = useAuth();
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        loadNotificaciones();
    }, [refreshKey]);

    const loadNotificaciones = async () => {
        try {
            if (!user) return;
            const data = await notificacionesService.getNotificaciones(user.id);
            setNotificaciones(data);
            setError(null);
        } catch (error) {
            console.error('Error loading notificaciones:', error);
            setError('Error al cargar las notificaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (notificacionId) => {
        try {
            await notificacionesService.deleteNotificacion(notificacionId);
            setRefreshKey(prev => prev + 1);
            Alert.alert('Éxito', 'Notificación eliminada correctamente');
        } catch (error) {
            Alert.alert('Error', 'Error al eliminar la notificación');
        }
    };    const handleMarcarLeido = async (notificacionId) => {
        try {
            const notificacionActualizada = await notificacionesService.marcarLeidoNotificacion(notificacionId);
            
            // Asegurarse de que la notificación actualizada tiene la propiedad correcta
            if (typeof notificacionActualizada === 'object' && notificacionActualizada !== null) {
                setNotificaciones(prevNotificaciones => 
                    prevNotificaciones.map(notif => 
                        notif._id === notificacionId ? notificacionActualizada : notif
                    )
                );
            } else {
                throw new Error('Respuesta del servidor inválida');
            }
        } catch (error) {
            console.error('Error al marcar como leída:', error);
            Alert.alert('Error', 'Error al marcar la notificación como leída');
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#2ecc71" />
            </View>
        );
    }

    if (error || !user) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>{error || 'No autenticado'}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.centered}>
                <Text style={styles.title}>Notificaciones</Text>
            </View>
            <View style={styles.content}>
                <NotificacionesGrid
                    notificaciones={notificaciones}
                    onDelete={handleDelete}
                    marcarLeido={handleMarcarLeido}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textPrimary,
        padding: 20,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        position: 'relative',
    },
    errorText: {
        color: colors.error,
        fontSize: 16,
        textAlign: 'center',
    },
});