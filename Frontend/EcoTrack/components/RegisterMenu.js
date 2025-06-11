import { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterMenu({ onBack }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { register } = useAuth();

    const handleSubmit = async () => {
        try {
            await register(formData.name, formData.email, formData.password);
            Alert.alert('Éxito', 'Usuario registrado correctamente');
            onBack(); // Volver al login
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Error en el registro');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Usuario"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            />
            
            <Pressable 
                style={styles.registerButton} 
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Registrarse</Text>
            </Pressable>
            
            <Pressable 
                style={styles.backButton} 
                onPress={onBack}
            >
                <Text style={styles.backButtonText}>Volver al inicio de sesión</Text>
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
    registerButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    backButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButtonText: {
        color: '#666',
        fontSize: 14,
    },
});