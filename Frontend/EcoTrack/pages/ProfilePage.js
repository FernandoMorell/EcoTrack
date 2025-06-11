import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <Text style={styles.label}>Usuario</Text>
                <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
            </View>
            
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
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
        color: '#666',
        marginBottom: 5,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        backgroundColor: '#f44336',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});