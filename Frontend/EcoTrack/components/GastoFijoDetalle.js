import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { gastosFijosService } from '../services/ApiServices';
import colors from '../themes/colors';

export default function GastoFijoDetalle({ gasto, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState(gasto.nombre);
  const [cantidad, setCantidad] = useState(gasto.cantidad.toString());

  const handleUpdate = async () => {
    try {
      const cantidadNum = parseFloat(cantidad);
      if (isNaN(cantidadNum) || cantidadNum <= 0) {
        Alert.alert('Error', 'La cantidad debe ser un número mayor que 0');
        return;
      }

      const gastoActualizado = await gastosFijosService.updateGastoFijo(gasto._id, {
        nombre,
        cantidad: cantidadNum,
      });

      onUpdate(gastoActualizado);
      setIsEditing(false);
      Alert.alert('Éxito', 'Gasto fijo actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al actualizar el gasto fijo');
    }
  };

  return (
    <View style={styles.container}>      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalle del Gasto Fijo</Text>
      </View>

      <View style={styles.content}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre del gasto"
            />
            <TextInput
              style={styles.input}
              value={cantidad}
              onChangeText={setCantidad}
              keyboardType="numeric"
              placeholder="Cantidad"
            />            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>{gasto.nombre}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Cantidad:</Text>
              <Text style={styles.value}>-{gasto.cantidad}€</Text>
            </View>            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.editButton]} 
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.deleteButton]} 
                onPress={() => {
                  Alert.alert(
                    'Eliminar Gasto Fijo',
                    '¿Estás seguro de que quieres eliminar este gasto fijo?',
                    [
                      {
                        text: 'Cancelar',
                        style: 'cancel'
                      },
                      {
                        text: 'Eliminar',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await gastosFijosService.deleteGastoFijo(gasto._id);
                            Alert.alert('Éxito', 'Gasto fijo eliminado correctamente');
                            onClose();
                          } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el gasto fijo');
                          }
                        }
                      }
                    ]
                  );
                }}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
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
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  content: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary,
  },
  label: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
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
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: colors.buttonPrimary,
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: colors.success,
  },
  cancelButton: {
    backgroundColor: colors.error,
  },
  deleteButton: {
    backgroundColor: colors.error,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
