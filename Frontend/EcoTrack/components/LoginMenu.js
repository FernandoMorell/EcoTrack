import { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginMenu({ onSwitchToRegister }) {
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    });
    const { login } = useAuth();

    const handleSubmit = async () => {
        try {
            await login(formData.name, formData.password);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Error en el inicio de sesión');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Usuario"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            />
            
            <Pressable 
                style={styles.loginButton} 
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </Pressable>
            
            <Pressable 
                style={styles.registerLink} 
                onPress={onSwitchToRegister}
            >
                <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    loginButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerLink: {
        marginTop: 15,
        alignItems: 'center',
    },
    linkText: {
        color: '#2196F3',
        fontSize: 14,
    },
});