import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useAuth } from '../context/AuthContext';
import { infoMesService } from '../services/ApiServices';
import { dateUtils } from '../services/utils';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function HomePage() {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [infoMes, setInfoMes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInfoMes = async (mes) => {
        try {
            setLoading(true);
            const data = await infoMesService.getInfoMes(user.id, mes);
            setInfoMes(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los datos del mes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfoMes(dateUtils.formatMes(selectedDate));
    }, [selectedDate]);

    const handleConfirm = (date) => {
        setDatePickerVisible(false);
        setSelectedDate(date);
    };

    const calcularAhorro = () => {
        if (!infoMes) return 0;
        const totalGastos = Object.values(infoMes.gastos).reduce((a, b) => a + b, 0);
        return infoMes.ingresos - totalGastos;
    };    const prepararDatosGrafica = () => {
        if (!infoMes?.gastos) return [];
        
        const totalGastos = Object.values(infoMes.gastos).reduce((a, b) => a + b, 0);
        
        return Object.entries(infoMes.gastos)
            .filter(([_, cantidad]) => cantidad > 0)
            .map(([tipo, cantidad]) => ({
                name: tipo,
                population: cantidad, // PieChart espera 'population' como clave para el valor
                color: getTipoColor(tipo),
                legendFontColor: "#7F7F7F",
                legendFontSize: 12,
                percentage: totalGastos > 0 ? ((cantidad / totalGastos) * 100).toFixed(1) + '%' : '0%'
            }));
    };

    const getTipoColor = (tipo) => {
        const colores = {
            'Ocio': '#FF6B6B',
            'Comida': '#4ECDC4',
            'Ropa': '#45B7D1',
            'Otros': '#96CEB4',
            'Fijo': '#FFBE0B'
        };
        return colores[tipo] || '#CCCCCC';
    };

    if (loading) return <Text style={styles.message}>Cargando...</Text>;
    if (error) return <Text style={styles.message}>{error}</Text>;

    return (
        <View style={styles.container}>
            <Pressable 
                onPress={() => setDatePickerVisible(true)}
                style={styles.dateSelector}
            >                
                <Text style={styles.dateSelectorText}>
                    {dateUtils.formatMesLargo(selectedDate)}
                </Text>
            </Pressable>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => setDatePickerVisible(false)}
            />            {infoMes ? (
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Ingresos</Text>
                        <Text style={styles.statValue}>{infoMes.ingresos || 0}€</Text>
                    </View>
                    
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Gastos</Text>
                        <Text style={styles.statValue}>
                            {Object.values(infoMes.gastos || {}).reduce((a, b) => a + b, 0)}€
                        </Text>
                    </View>
                    
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Ahorro</Text>
                        <Text style={[
                            styles.statValue,
                            { color: calcularAhorro() >= 0 ? 'green' : 'red' }
                        ]}>
                            {calcularAhorro()}€
                        </Text>
                    </View>

                    {prepararDatosGrafica().length > 0 ? (
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Distribución de Gastos</Text>                            <PieChart
                                data={prepararDatosGrafica()}
                                width={screenWidth - 40}
                                height={220}
                                chartConfig={{
                                    backgroundColor: '#ffffff',
                                    backgroundGradientFrom: '#ffffff',
                                    backgroundGradientTo: '#ffffff',
                                    decimalPlaces: 1,
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                    propsForLabels: {
                                        fontSize: "10"
                                    }
                                }}
                                accessor="population"
                                backgroundColor="transparent"
                                paddingLeft="15"
                                absolute
                            />
                        </View>
                    ) : (
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>No hay gastos para mostrar</Text>
                        </View>
                    )}
                </View>
            ) : (
                <View style={styles.messageContainer}>
                    <Text style={styles.message}>No hay datos disponibles para este mes.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    dateSelector: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dateSelectorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    statsContainer: {
        flex: 1,
    },
    statBox: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    statLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    chartContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});