import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { infoMesService } from '../services/ApiServices';
import { useNavigation } from '@react-navigation/native';

export default function ComparacionInfoMes({ userId, mesInicial }) {
    const navigation = useNavigation();
    const [mes1, setMes1] = useState(mesInicial || '');
    const [mes2, setMes2] = useState('');
    const [infoMes1, setInfoMes1] = useState(null);
    const [infoMes2, setInfoMes2] = useState(null);
    const [loading, setLoading] = useState(false);

    // Generar array de meses disponibles (últimos 12 meses)
    const getMesesDisponibles = () => {
        const meses = [];
        const date = new Date();
        for (let i = 0; i < 12; i++) {
            const mes = date.toISOString().slice(0, 7); // Formato YYYY-MM
            meses.push(mes);
            date.setMonth(date.getMonth() - 1);
        }
        return meses;
    };

    const cargarInfoMes = async (mes, setInfoMes) => {
        try {
            const data = await infoMesService.getInfoMes(userId, mes);
            setInfoMes(data);
        } catch (error) {
            console.error('Error al cargar InfoMes:', error);
        }
    };

    useEffect(() => {
        if (mes1) {
            cargarInfoMes(mes1, setInfoMes1);
        }
    }, [mes1]);

    useEffect(() => {
        if (mes2) {
            cargarInfoMes(mes2, setInfoMes2);
        }
    }, [mes2]);    const calcularTotales = (infoMes) => {
        if (!infoMes) return { totalGastos: 0, totalIngresos: 0, balance: 0 };
        
        const totalGastos = [...(infoMes.gastosFijos || []), ...(infoMes.gastosDiarios || [])]
            .reduce((sum, gasto) => sum + gasto.cantidad, 0);
        
        // infoMes.ingresos podría ser directamente el número
        const totalIngresos = typeof infoMes.ingresos === 'number' 
            ? infoMes.ingresos 
            : Array.isArray(infoMes.ingresos) 
                ? infoMes.ingresos.reduce((sum, ingreso) => sum + ingreso.cantidad, 0)
                : 0;
        
        return {
            totalGastos,
            totalIngresos,
            balance: totalIngresos - totalGastos
        };
    };

    const renderComparacion = () => {
        const totales1 = calcularTotales(infoMes1);
        const totales2 = calcularTotales(infoMes2);

        return (
            <View style={styles.comparacionContainer}>
                <View style={styles.columna}>
                    <Text style={styles.mesTitle}>{mes1 || 'Primer mes'}</Text>
                    <Text style={styles.label}>Ingresos: <Text style={styles.valor}>{totales1.totalIngresos}€</Text></Text>
                    <Text style={styles.label}>Gastos: <Text style={styles.valor}>-{totales1.totalGastos}€</Text></Text>
                    <Text style={[styles.label, styles.balance]}>
                        Balance: <Text style={[styles.valor, { color: totales1.balance >= 0 ? '#2ecc71' : '#e74c3c' }]}>
                            {totales1.balance}€
                        </Text>
                    </Text>
                </View>

                <View style={styles.separador} />

                <View style={styles.columna}>
                    <Text style={styles.mesTitle}>{mes2 || 'Segundo mes'}</Text>
                    <Text style={styles.label}>Ingresos: <Text style={styles.valor}>{totales2.totalIngresos}€</Text></Text>
                    <Text style={styles.label}>Gastos: <Text style={styles.valor}>-{totales2.totalGastos}€</Text></Text>
                    <Text style={[styles.label, styles.balance]}>
                        Balance: <Text style={[styles.valor, { color: totales2.balance >= 0 ? '#2ecc71' : '#e74c3c' }]}>
                            {totales2.balance}€
                        </Text>
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Comparación de Meses</Text>
                <Pressable 
                    style={styles.volverButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.volverButtonText}>Volver</Text>
                </Pressable>
            </View>
            
            <View style={styles.pickerContainer}>
                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Primer mes</Text>
                    <Picker
                        selectedValue={mes1}
                        onValueChange={setMes1}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecciona un mes" value="" />
                        {getMesesDisponibles().map(mes => (
                            <Picker.Item 
                                key={mes} 
                                label={new Date(mes).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} 
                                value={mes} 
                            />
                        ))}
                    </Picker>
                </View>

                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Segundo mes</Text>
                    <Picker
                        selectedValue={mes2}
                        onValueChange={setMes2}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecciona un mes" value="" />
                        {getMesesDisponibles().map(mes => (
                            <Picker.Item 
                                key={mes} 
                                label={new Date(mes).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} 
                                value={mes} 
                            />
                        ))}
                    </Picker>
                </View>
            </View>

            {renderComparacion()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    volverButton: {
        backgroundColor: '#3498db',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    volverButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pickerContainer: {
        marginBottom: 20,
    },
    pickerWrapper: {
        marginBottom: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pickerLabel: {
        fontSize: 16,
        color: '#666',
        padding: 10,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    comparacionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    columna: {
        flex: 1,
    },
    separador: {
        width: 1,
        backgroundColor: '#ddd',
        marginHorizontal: 15,
    },
    mesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    valor: {
        fontWeight: 'bold',
        color: '#333',
    },
    balance: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
