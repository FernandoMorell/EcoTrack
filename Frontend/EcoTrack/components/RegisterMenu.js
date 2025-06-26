import { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, Alert, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import colors from '../themes/colors';

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
            <Image
                            source={require('../assets/Icon.png')}
                            style={styles.icon}
                        >
            </Image>
            <Text style={styles.title}>EcoTrack</Text>
            <Text style={styles.title}>Registro</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Usuario"
                placeholderTextColor={colors.textSecondary}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor={colors.textSecondary}
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
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: colors.textPrimary,
    },
    input: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.textSecondary,
        color: colors.textSecondary,
    },
    registerButton: {
        backgroundColor: colors.buttonPrimary,
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
        color: colors.buttonPrimary,
        fontSize: 14,
    },
    icon: {
        width: 150,
        height: 150,
        alignSelf: 'center',
    },
});