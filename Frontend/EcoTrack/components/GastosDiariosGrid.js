import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import GastoDiarioCard from './GastoDiarioCard';
import colors from '../themes/colors';

export default function GastosDiariosGrid({ gastosDiarios, onGastoPress, onAddPress }) {
    const renderItem = ({ item }) => (
        <GastoDiarioCard 
            gasto={item}
            onPress={() => onGastoPress(item)}
        />
    );

    const total = gastosDiarios.reduce((sum, gasto) => sum + gasto.cantidad, 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.title}>Gastos Diarios</Text>
                    <Text style={styles.total}>Total: -{total}€</Text>
                </View>
                <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
                    <MaterialIcons name="add" size={24} color={colors.buttonPrimary} />
                </TouchableOpacity>
            </View>
            {gastosDiarios.length > 0 ? (
                <FlatList
                    data={gastosDiarios}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        No hay gastos diarios para esta fecha
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.textSecondary,
    },
    headerLeft: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    total: {
        fontSize: 16,
        color: colors.error,
        marginTop: 4,
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
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
