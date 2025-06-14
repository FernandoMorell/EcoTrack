import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import GastoFijoCard from './GastoFijoCard';

export default function GastosFijosGrid({ gastosFijos, onGastoPress, onAddPress }) {
    const renderItem = ({ item }) => (
        <GastoFijoCard 
            gasto={item}
            onPress={() => onGastoPress(item)}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Gastos Fijos</Text>
                <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
                    <MaterialIcons name="add" size={24} color="#4CAF50" />
                </TouchableOpacity>
            </View>
            {gastosFijos.length > 0 ? (
                <FlatList
                    data={gastosFijos}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        No hay gastos fijos registrados
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        padding: 5,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});
