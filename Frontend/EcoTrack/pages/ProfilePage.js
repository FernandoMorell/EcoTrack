import { View, Text, StyleSheet } from 'react-native';

export default function ProfilePage() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nombre</Text>
            <Text style={styles.subtitle}>Cerrar Sesion</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginTop: 10,
    },
});