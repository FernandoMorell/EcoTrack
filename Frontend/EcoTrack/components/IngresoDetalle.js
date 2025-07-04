import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ingresosService } from '../services/ApiServices';
import colors from '../themes/colors';

export default function IngresoDetalle({ ingreso, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState(ingreso.nombre);
  const [cantidad, setCantidad] = useState(ingreso.cantidad.toString());
  const handleUpdate = async () => {
    try {
      if (!nombre.trim()) {
        Alert.alert('Error', 'El nombre es obligatorio');
        return;
      }

      const cantidadNum = parseFloat(cantidad);
      if (isNaN(cantidadNum) || cantidadNum <= 0) {
        Alert.alert('Error', 'La cantidad debe ser un número mayor que 0');
        return;
      }

      const ingresoActualizado = await ingresosService.updateIngreso(ingreso._id, {
        nombre: nombre.trim(),
        cantidad: cantidadNum,
      });      
      
      setIsEditing(false); // Desactivar modo edición antes de actualizar
      Alert.alert('Éxito', 'Ingreso actualizado correctamente');
      onUpdate(ingresoActualizado);
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al actualizar el ingreso');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalle del Ingreso</Text>
      </View>

      <View style={styles.content}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre del ingreso"
            />
            <TextInput
              style={styles.input}
              value={cantidad}
              onChangeText={setCantidad}
              keyboardType="numeric"
              placeholder="Cantidad"
            />
            <View style={styles.buttonContainer}>
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
              <Text style={styles.value}>{ingreso.nombre}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Cantidad:</Text>
              <Text style={styles.value}>{ingreso.cantidad}€</Text>
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
                    'Eliminar Ingreso',
                    '¿Estás seguro de que quieres eliminar este ingreso?',
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
                            await ingresosService.deleteIngreso(ingreso._id);
                            Alert.alert('Éxito', 'Ingreso eliminado correctamente');
                            onClose();
                          } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el ingreso');
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
    backgroundColor: colors.background
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    color: colors.textPrimary,
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
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: colors.success,
  },
  cancelButton: {
    backgroundColor: colors.error,
  },
  deleteButton: {
    backgroundColor: colors.error,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
