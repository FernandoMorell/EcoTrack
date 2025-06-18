import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import NotificacionCard from './NotificacionCard';
import colors from '../themes/colors';

export default function NotificacionesGrid({ notificaciones, onDelete, marcarLeido }) {
    const renderItem = ({ item }) => (
        <NotificacionCard 
            notificacion={item}
            onDelete={onDelete}
            marcarLeido={marcarLeido}
        />
    );

    return (
        <View style={styles.container}>
            {notificaciones.length > 0 ? (
                <FlatList
                    data={notificaciones}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        No tienes notificaciones
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
