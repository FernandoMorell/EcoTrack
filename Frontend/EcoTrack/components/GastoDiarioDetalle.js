import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { gastosDiariosService } from '../services/ApiServices';

export default function GastoDiarioDetalle({ gasto, onClose, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [nombre, setNombre] = useState(gasto.nombre);
    const [cantidad, setCantidad] = useState(gasto.cantidad.toString());
    const [tipo, setTipo] = useState(gasto.tipo);

    const tiposGasto = ['Comida', 'Ropa', 'Ocio', 'Transporte', 'Hogar', 'Otros'];

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

            if (!tiposGasto.includes(tipo)) {
                Alert.alert('Error', 'El tipo no es válido');
                return;
            }

            const gastoActualizado = await gastosDiariosService.updateGastoDiario(gasto._id, {
                nombre: nombre.trim(),
                cantidad: cantidadNum,
                tipo,
                fecha: gasto.fecha
            });

            onUpdate(gastoActualizado);
            setIsEditing(false);
            Alert.alert('Éxito', 'Gasto diario actualizado correctamente');
        } catch (error) {
            Alert.alert('Error', error.message || 'Error al actualizar el gasto diario');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Detalle del Gasto Diario</Text>
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
                        />
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={tipo}
                                onValueChange={setTipo}
                                style={styles.picker}
                            >
                                {tiposGasto.map((t) => (
                                    <Picker.Item key={t} label={t} value={t} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style={[styles.button, styles.cancelButton]} 
                                onPress={() => setIsEditing(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.button, styles.saveButton]} 
                                onPress={handleUpdate}
                            >
                                <Text style={styles.buttonText}>Guardar</Text>
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
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Tipo:</Text>
                            <Text style={styles.value}>{gasto.tipo}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Fecha:</Text>
                            <Text style={styles.value}>
                                {new Date(gasto.fecha).toLocaleDateString()}
                            </Text>
                        </View>
            <View style={styles.buttonContainer}>
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
                                        'Eliminar Gasto Diario',
                                        '¿Estás seguro de que quieres eliminar este gasto diario?',
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
                                                        await gastosDiariosService.deleteGastoDiario(gasto._id);
                                                        Alert.alert('Éxito', 'Gasto diario eliminado correctamente');
                                                        onClose();
                                                    } catch (error) {
                                                        Alert.alert('Error', 'No se pudo eliminar el gasto diario');
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
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    closeButton: {
        padding: 10,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#333',
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
        borderBottomColor: '#eee',
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
        fontSize: 16,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginVertical: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
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
        backgroundColor: '#3498db',
        flex: 1,
        marginRight: 5,
    },
    saveButton: {
        backgroundColor: '#2ecc71',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
