import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/ApiServices';
import colors from '../themes/colors';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [limiteDiario, setLimiteDiario] = useState('');
    const [editandoLimite, setEditandoLimite] = useState(false);
    const [limiteActual, setLimiteActual] = useState(0);

    useEffect(() => {
        if (user) {
            cargarLimiteDiario();
        }
    }, [user]);

    const cargarLimiteDiario = async () => {
        try {
            const data = await userService.getLimiteDiario(user.id);
            setLimiteActual(data.limiteDiario);
            setLimiteDiario(data.limiteDiario.toString());
        } catch (error) {
            Alert.alert('Error', 'No se pudo cargar el límite diario');
        }
    };

    const handleLimiteDiario = async () => {
        if (!limiteDiario.trim()) {
            Alert.alert('Error', 'El límite diario no puede estar vacío');
            return;
        }

        const limite = parseFloat(limiteDiario);
        if (isNaN(limite) || limite < 0) {
            Alert.alert('Error', 'El límite debe ser un número válido mayor o igual a 0');
            return;
        }

        try {
            await userService.updateLimiteDiario(user.id, limite);
            setLimiteActual(limite);
            setEditandoLimite(false);
            Alert.alert('Éxito', 'Límite diario actualizado correctamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el límite diario');
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.profileSection}>
                    <Text style={styles.label}>Usuario</Text>
                    <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
                    {user?.email && (
                        <Text style={styles.userEmail}>{user.email}</Text>
                    )}
                </View>

                <View style={styles.profileSection}>
                    <Text style={styles.label}>Límite Diario de Gastos</Text>
                    {editandoLimite ? (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={limiteDiario}
                                onChangeText={setLimiteDiario}
                                keyboardType="numeric"
                                placeholder="Introduce el límite diario"
                            />
                            <View style={styles.buttonContainer}>
                                <Pressable 
                                    style={[styles.button, styles.saveButton]} 
                                    onPress={handleLimiteDiario}
                                >
                                    <Text style={styles.buttonText}>Guardar</Text>
                                </Pressable>
                                <Pressable 
                                    style={[styles.button, styles.cancelButton]} 
                                    onPress={() => {
                                        setEditandoLimite(false);
                                        setLimiteDiario(limiteActual.toString());
                                    }}
                                >
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </Pressable>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.valueContainer}>
                            <Text style={styles.value}>
                                {limiteActual > 0 ? `${limiteActual}€` : 'Sin límite'}
                            </Text>
                            <Pressable 
                                style={[styles.button, styles.editButton]} 
                                onPress={() => setEditandoLimite(true)}
                            >
                                <Text style={styles.buttonText}>Editar</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.logoutContainer}>
                <Pressable 
                    style={({ pressed }) => [
                        styles.logoutButton,
                        { backgroundColor: pressed ? '#d32f2f' : '#f44336' }
                    ]}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    },
    logoutContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButton: {
        backgroundColor: colors.error,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: 160,
    },
    profileSection: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        color: colors.textPrimary,
        marginBottom: 5,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    inputContainer: {
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.textSecondary,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    valueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    button: {
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    editButton: {
        backgroundColor: colors.buttonPrimary,
        flex: 0,
        paddingHorizontal: 20,
    },
    saveButton: {
        backgroundColor: colors.success,
    },
    cancelButton: {
        backgroundColor: colors.error,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});