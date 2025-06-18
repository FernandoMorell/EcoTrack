import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { ingresosService } from '../services/ApiServices';
import colors from '../themes/colors';

export default function NuevoIngresoModal({ visible, onClose, onIngresoCreated, userId }) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');

  const handleSubmit = async () => {
    try {
      if (!nombre || !cantidad) {
        Alert.alert('Error', 'Todos los campos son obligatorios');
        return;
      }

      const cantidadNum = parseFloat(cantidad);
      if (isNaN(cantidadNum) || cantidadNum <= 0) {
        Alert.alert('Error', 'La cantidad debe ser un número mayor que 0');
        return;
      }

      const nuevoIngreso = await ingresosService.createIngreso({
        nombre,
        cantidad: cantidadNum,
        user: userId,
      });

      onIngresoCreated(nuevoIngreso);
      setNombre('');
      setCantidad('');
      onClose();
      Alert.alert('Éxito', 'Ingreso creado correctamente');
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al crear el ingreso');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Nuevo Ingreso</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nombre del ingreso"
            value={nombre}
            onChangeText={setNombre}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Cantidad"
            value={cantidad}
            onChangeText={setCantidad}
            keyboardType="numeric"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Crear</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: colors.success,
  },
  cancelButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
