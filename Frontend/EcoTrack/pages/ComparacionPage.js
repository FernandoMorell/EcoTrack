import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import ComparacionInfoMes from '../components/ComparacionInfoMes';

export default function ComparacionPage({ route }) {
    const { user } = useAuth();
    const { mesInicial } = route.params || {};

    return (
        <View style={styles.container}>
            <ComparacionInfoMes 
                userId={user?.id}
                mesInicial={mesInicial} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});
