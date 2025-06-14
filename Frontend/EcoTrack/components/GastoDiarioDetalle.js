import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function GastoDiarioDetalle({ gasto, onClose, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [nombre, setNombre] = useState(gasto.nombre);
    const [cantidad, setCantidad] = useState(gasto.cantidad.toString());
    const [tipo, setTipo] = useState(gasto.tipo);
    const [error, setError] = useState('');

    const handleUpdate = () => {
        if (!nombre.trim() || !cantidad.trim() || !tipo.trim()) {
            setError('Todos los campos son obligatorios');
            return;
        }

        const cantidadNum = parseFloat(cantidad);
        if (isNaN(cantidadNum) || cantidadNum <= 0) {
            setError('La cantidad debe ser un número positivo');
            return;
        }

        onUpdate({
            ...gasto,
            nombre,
            cantidad: cantidadNum,
            tipo
        });
        setIsEditing(false);
        setError('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setIsEditing(!isEditing)}
                    style={styles.editButton}
                >
                    <MaterialIcons name={isEditing ? "check" : "edit"} size={24} color="#333" />
                </TouchableOpacity>
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
                            placeholder="Cantidad"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            value={tipo}
                            onChangeText={setTipo}
                            placeholder="Tipo de gasto"
                        />
                        {error ? <Text style={styles.error}>{error}</Text> : null}
                        <TouchableOpacity 
                            style={styles.updateButton}
                            onPress={handleUpdate}
                        >
                            <Text style={styles.updateButtonText}>Actualizar</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.title}>{nombre}</Text>
                        <Text style={styles.amount}>-{cantidad}€</Text>
                        <Text style={styles.type}>{tipo}</Text>
                        <Text style={styles.date}>
                            {new Date(gasto.fecha).toLocaleDateString()}
                        </Text>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    closeButton: {
        padding: 5,
    },
    editButton: {
        padding: 5,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    amount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF0000',
        marginBottom: 15,
    },
    type: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
    },
    date: {
        fontSize: 16,
        color: '#999',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    updateButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    updateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
