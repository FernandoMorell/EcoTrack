import { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, Alert, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import colors from '../themes/colors';

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
            <Image
                source={require('../assets/Icon.png')}
                style={styles.icon}
            >
            </Image>
            <Text style={styles.title}>EcoTrack</Text>
            <Text style={styles.title}>Iniciar Sesión</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Usuario"
                placeholderTextColor={colors.textSecondary}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
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
    loginButton: {
        backgroundColor: colors.buttonPrimary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerLink: {
        marginTop: 15,
        alignItems: 'center',
    },
    linkText: {
        color: colors.buttonPrimary,
        fontSize: 14,
    },
    icon: {
        width: 150,
        height: 150,
        alignSelf: 'center',
    }
});