import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { ingresosService } from '../services/ApiServices';
import IngresoCard from './IngresoCard';
import colors from '../themes/colors';

export default function IngresosGrid({ userId, onIngresoPress }) {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);  const [error, setError] = useState(null);

  const fetchIngresos = async () => {
    if (!userId) {
      setError('UserId no proporcionado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ingresosService.getIngresos(userId);
      setIngresos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar los ingresos:', error);
      setError(error.response?.data?.error || error.message);
      setIngresos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngresos();
  }, [userId]);
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {ingresos.length > 0 ? (
      <FlatList
        data={ingresos}
        renderItem={({ item }) => (
          <IngresoCard
            ingreso={item}
            onPress={onIngresoPress}
          />
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.gridContent}
      />) : (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No hay ingresos disponibles</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gridContent: {
    padding: 10,
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
  }
});
