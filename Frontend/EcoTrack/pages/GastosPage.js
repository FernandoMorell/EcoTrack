import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SectionList, TouchableOpacity, Text, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import GastosFijosGrid from '../components/GastosFijosGrid';
import GastosDiariosGrid from '../components/GastosDiariosGrid';
import GastoFijoDetalle from '../components/GastoFijoDetalle';
import GastoDiarioDetalle from '../components/GastoDiarioDetalle';
import NuevoGastoFijoModal from '../components/NuevoGastoFijoModal';
import NuevoGastoDiarioModal from '../components/NuevoGastoDiarioModal';
import { gastosDiariosService, gastosFijosService } from '../services/ApiServices';

export default function GastosPage() {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [gastosFijos, setGastosFijos] = useState([]);
    const [gastosDiarios, setGastosDiarios] = useState([]);
    const [selectedGastoFijo, setSelectedGastoFijo] = useState(null);
    const [selectedGastoDiario, setSelectedGastoDiario] = useState(null);
    const [showNuevoGastoFijo, setShowNuevoGastoFijo] = useState(false);
    const [showNuevoGastoDiario, setShowNuevoGastoDiario] = useState(false);    useEffect(() => {
        // Solo cargamos al montar el componente
        loadGastos();
    }, []); // Removemos selectedDate como dependencia
    
    const loadGastos = async () => {
        try {
            if (!user) return;
            // Format date as YYYY-MM-DD
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const gastosFijosResponse = await gastosFijosService.getGastosFijos(user.id);
            const gastosDiariosResponse = await gastosDiariosService.getGastosDiarios(user.id, formattedDate);
            setGastosFijos(gastosFijosResponse);
            setGastosDiarios(gastosDiariosResponse);
        } catch (error) {
            console.error('Error loading gastos:', error);
        }
    };    
      const handleDateChange = async (event, date) => {
        setShowDatePicker(false);
        if (date) {
            setSelectedDate(date);
            try {
                if (!user) return;
                const formattedDate = date.toISOString().split('T')[0];
                const [gastosFijosResponse, gastosDiariosResponse] = await Promise.all([
                    gastosFijosService.getGastosFijos(user.id),
                    gastosDiariosService.getGastosDiarios(user.id, formattedDate)
                ]);
                setGastosFijos(gastosFijosResponse);
                setGastosDiarios(gastosDiariosResponse);
            } catch (error) {
                console.error('Error loading gastos after date change:', error);
                Alert.alert('Error', 'No se pudieron cargar los gastos para la fecha seleccionada');
            }
        }
    };

    const handleGastoFijoPress = (gasto) => {
        setSelectedGastoFijo(gasto);
    };

    const handleGastoDiarioPress = (gasto) => {
        setSelectedGastoDiario(gasto);
    };    const handleNuevoGastoFijo = async (gastoData) => {
        try {
            if (!user) return;
            const response = await gastosFijosService.createGastoFijo({
                ...gastoData,
                user: user.id
            });
            setGastosFijos([...gastosFijos, response]);
        } catch (error) {
            console.error('Error creating gasto fijo:', error);
        }
    };    
    
    const handleNuevoGastoDiario = async (gastoData) => {
        try {
            if (!user) {
                Alert.alert('Error', 'No se pudo obtener la información del usuario');
                return;
            }

            const formattedDate = selectedDate.toISOString().split('T')[0];
            const response = await gastosDiariosService.createGastoDiario({
                ...gastoData,
                user: user.id,
                fecha: formattedDate
            });
            setGastosDiarios([...gastosDiarios, response]);
            Alert.alert('Éxito', 'Gasto diario creado correctamente');
        } catch (error) {
            console.error('Error creating gasto diario:', error);
            Alert.alert(
                'Error',
                error.response?.data?.error || 'Ocurrió un error al crear el gasto diario'
            );
        }
    };    
    
    const handleUpdateGastoFijo = async (gastoData) => {
        try {
            const response = await gastosFijosService.updateGastoFijo(gastoData.id, gastoData);
            setGastosFijos(gastosFijos.map(g => g.id === gastoData.id ? response : g));
            setSelectedGastoFijo(null);
        } catch (error) {
            console.error('Error updating gasto fijo:', error);
        }
    };    const handleUpdateGastoDiario = async (gastoData) => {
        try {
            const response = await gastosDiariosService.updateGastoDiario(gastoData.id, gastoData);
            setGastosDiarios(gastosDiarios.map(g => g.id === gastoData.id ? response : g));
            setSelectedGastoDiario(null);
        } catch (error) {
            console.error('Error updating gasto diario:', error);
        }
    };    
    
    const getSectionsData = () => {
        return [
            {
                title: 'Gastos Fijos',
                data: [gastosFijos],
                renderContent: () => (
                    <GastosFijosGrid
                        gastosFijos={gastosFijos}
                        onGastoPress={handleGastoFijoPress}
                        onAddPress={() => setShowNuevoGastoFijo(true)}
                    />
                )
            },
            {
                title: 'Gastos Diarios',
                data: [gastosDiarios],
                renderContent: () => (
                    <GastosDiariosGrid
                        gastosDiarios={gastosDiarios}
                        onGastoPress={handleGastoDiarioPress}
                        onAddPress={() => setShowNuevoGastoDiario(true)}
                    />
                )
            }
        ];
    };

    const renderItem = ({ item, section }) => (
        <View style={styles.sectionContent}>
            {section.renderContent()}
        </View>
    );

    const handleBack = () => {
        setSelectedGastoFijo(null);
        setSelectedGastoDiario(null);
        loadGastos();
    };

    const renderMainContent = () => (
        <>
            <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.dateButtonText}>
                    {selectedDate.toLocaleDateString()}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <SectionList
                style={styles.content}
                sections={getSectionsData()}
                renderItem={renderItem}
                stickySectionHeadersEnabled={false}
                keyExtractor={(item, index) => index.toString()}
            />

            <NuevoGastoFijoModal
                visible={showNuevoGastoFijo}
                onClose={() => setShowNuevoGastoFijo(false)}
                onSubmit={handleNuevoGastoFijo}
            />            
            <NuevoGastoDiarioModal
                visible={showNuevoGastoDiario}
                onClose={() => setShowNuevoGastoDiario(false)}
                onSubmit={handleNuevoGastoDiario}
                selectedDate={selectedDate}
            />
        </>
    );

    return (
        <View style={styles.container}>
            {selectedGastoFijo ? (
                <GastoFijoDetalle
                    gasto={selectedGastoFijo}
                    onClose={handleBack}
                    onUpdate={handleUpdateGastoFijo}
                />
            ) : selectedGastoDiario ? (
                <GastoDiarioDetalle
                    gasto={selectedGastoDiario}
                    onClose={handleBack}
                    onUpdate={handleUpdateGastoDiario}
                />
            ) : (
                renderMainContent()
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    dateButton: {
        backgroundColor: 'white',
        padding: 15,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 8,
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
    dateButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    content: {
        flex: 1,
    },
    sectionHeader: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        marginHorizontal: 10,
    },
    sectionHeaderText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    sectionContent: {
        flex: 1,
        minHeight: 200,
    },
});