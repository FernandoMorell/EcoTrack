import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import IngresosGrid from '../components/IngresosGrid';
import IngresoDetalle from '../components/IngresoDetalle';
import NuevoIngresoModal from '../components/NuevoIngresoModal';
import colors from '../themes/colors';

export default function IngresosPage() {
    const auth = useAuth();
    const [selectedIngreso, setSelectedIngreso] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true);
                setError(null);
                // Esperar a que auth esté disponible
                if (!auth || !auth.user || !auth.user.id) {
                    console.log('Auth state:', auth); // Para depuración
                    throw new Error('No autenticado o ID de usuario no disponible');
                }
                setIsLoading(false);
            } catch (err) {
                console.error('Error en checkAuth:', err);
                setError(err.message);
                setIsLoading(false);
            }
        };
        
        checkAuth();
    }, [auth]);

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#2ecc71" />
            </View>
        );
    }

    if (error || !auth || !auth.user) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>Error: {error || 'No autenticado'}</Text>
            </View>
        );
    }

    const handleIngresoPress = (ingreso) => {
        setSelectedIngreso(ingreso);
    };

    const handleBack = () => {
        setSelectedIngreso(null);
        setRefreshKey(prev => prev + 1);
    };

    const handleIngresoCreated = () => {
        setRefreshKey(prev => prev + 1);
    };    const handleIngresoUpdated = (ingresoActualizado) => {
        setRefreshKey(prev => prev + 1); // Actualizar la lista
        setSelectedIngreso(ingresoActualizado); // Mantener la vista de detalle con los datos actualizados
    };

    return (
        <View style={styles.container}>
            {selectedIngreso ? (
                <IngresoDetalle
                    ingreso={selectedIngreso}
                    onClose={handleBack}
                    onUpdate={handleIngresoUpdated}
                />
            ) : (
                <>
                    <View style={styles.centered}>
                        <Text style={styles.title}>Ingresos</Text>
                    </View>
                    <View style={styles.content}>
                        <IngresosGrid
                            key={refreshKey}
                            userId={auth.user.id}
                            onIngresoPress={handleIngresoPress}
                        />
                        <TouchableOpacity
                            style={styles.fab}
                            onPress={() => setShowModal(true)}
                        >
                        <Text style={styles.fabText}>+</Text>
                        </TouchableOpacity>
                    </View>                    
                    <NuevoIngresoModal
                        visible={showModal}
                        onClose={() => setShowModal(false)}
                        onIngresoCreated={handleIngresoCreated}
                        userId={auth?.user?.id}
                    />
                </>
            )}
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
    errorText: {
        color: colors.textPrimary,
        fontSize: 16,
        textAlign: 'center',
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
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.buttonPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fabText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
});