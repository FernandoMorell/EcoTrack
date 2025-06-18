import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../themes/colors';

export default function NuevoGastoFijoModal({ visible, onClose, onSubmit }) {
    const [nombre, setNombre] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!nombre.trim() || !cantidad.trim()) {
            setError('Todos los campos son obligatorios');
            return;
        }

        const cantidadNum = parseFloat(cantidad);
        if (isNaN(cantidadNum) || cantidadNum <= 0) {
            setError('La cantidad debe ser un número positivo');
            return;
        }

        onSubmit({
            nombre: nombre.trim(),
            cantidad: cantidadNum,
        });

        // Reset form
        setNombre('');
        setCantidad('');
        setError('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Nuevo Gasto Fijo</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Nombre del gasto"
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

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <TouchableOpacity 
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Crear Gasto Fijo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: 20,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    closeButton: {
        padding: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.textSecondary,
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    error: {
        color: colors.error,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: colors.success,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
