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
import { gastosDiariosService, gastosFijosService, userService, notificacionesService } from '../services/ApiServices';

export default function GastosPage() {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [gastosFijos, setGastosFijos] = useState([]);
    const [gastosDiarios, setGastosDiarios] = useState([]);
    const [selectedGastoFijo, setSelectedGastoFijo] = useState(null);
    const [selectedGastoDiario, setSelectedGastoDiario] = useState(null);
    const [showNuevoGastoFijo, setShowNuevoGastoFijo] = useState(false);
    const [showNuevoGastoDiario, setShowNuevoGastoDiario] = useState(false);
    const [limiteDiario, setLimiteDiario] = useState(0);

    useEffect(() => {
        loadGastos();
    }, []);

    useEffect(() => {
        if (user) {
            cargarLimiteDiario();
        }
    }, [user]);

    const loadGastos = async () => {
        try {
            if (!user) return;
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const gastosFijosResponse = await gastosFijosService.getGastosFijos(user.id);
            const gastosDiariosResponse = await gastosDiariosService.getGastosDiarios(user.id, formattedDate);
            setGastosFijos(gastosFijosResponse);
            setGastosDiarios(gastosDiariosResponse);
        } catch (error) {
            console.error('Error loading gastos:', error);
        }
    };

    const cargarLimiteDiario = async () => {
        try {
            const data = await userService.getLimiteDiario(user.id);
            setLimiteDiario(data.limiteDiario);
        } catch (error) {
            console.error('Error al cargar el límite diario:', error);
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
    };

    const checkLimiteDiario = async (nuevoGasto) => {
        if (!limiteDiario) return false;
        
        const gastosDelDia = gastosDiarios.reduce((total, gasto) => total + gasto.cantidad, 0);
        const totalConNuevoGasto = gastosDelDia + nuevoGasto;
        
        if (totalConNuevoGasto > limiteDiario) {            try {
                await notificacionesService.createNotificacion({
                    titulo: '¡Límite diario excedido!',
                    mensaje: `Has superado tu límite diario de ${limiteDiario}€ el ${selectedDate.toLocaleDateString()}.`,
                    user: user.id,
                });
            } catch (error) {
                console.error('Error al crear la notificación:', error);
            }
            return false;
        }
        return false;
    };

    const handleNuevoGastoFijo = async (gastoData) => {
        try {
            if (!user) return;
            const response = await gastosFijosService.createGastoFijo({
                ...gastoData,
                user: user.id
            });
            setGastosFijos([...gastosFijos, response]);
            setShowNuevoGastoFijo(false);
            Alert.alert('Éxito', 'Gasto fijo creado correctamente');
        } catch (error) {
            console.error('Error creating gasto fijo:', error);
            Alert.alert('Error', 'No se pudo crear el gasto fijo');
        }
    };

    const handleNuevoGastoDiario = async (gastoData) => {
        try {
            if (!user) {
                Alert.alert('Error', 'No se pudo obtener la información del usuario');
                return;
            }            const formattedDate = selectedDate.toISOString().split('T')[0];
            // Verificar el límite pero permitir la creación del gasto
            await checkLimiteDiario(gastoData.cantidad);

            const response = await gastosDiariosService.createGastoDiario({
                ...gastoData,
                user: user.id,
                fecha: formattedDate
            });
            setGastosDiarios([...gastosDiarios, response]);
            setShowNuevoGastoDiario(false);
            Alert.alert('Éxito', 'Gasto diario creado correctamente');
        } catch (error) {
            console.error('Error creating gasto diario:', error);
            Alert.alert(
                'Error',
                error.response?.data?.error || 'Ocurrió un error al crear el gasto diario'
            );
        }
    };    const handleUpdateGastoFijo = async (gastoData) => {
        try {
            const response = await gastosFijosService.updateGastoFijo(gastoData._id, gastoData);
            setGastosFijos(gastosFijos.map(g => g._id === gastoData._id ? response : g));
            setSelectedGastoFijo(response); // Actualizamos el gasto seleccionado con la respuesta del servidor
            await loadGastos(); // Reload to ensure InfoMes is updated
        } catch (error) {
            console.error('Error updating gasto fijo:', error);
            throw error;
        }
    };
      const handleUpdateGastoDiario = async (gastoData) => {
        try {
            const response = await gastosDiariosService.updateGastoDiario(gastoData._id, gastoData);
            setGastosDiarios(gastosDiarios.map(g => g._id === gastoData._id ? response : g));
            setSelectedGastoDiario(response); // Actualizamos el gasto seleccionado con la respuesta del servidor
            await loadGastos(); // Reload to ensure InfoMes is updated
        } catch (error) {
            console.error('Error updating gasto diario:', error);
            throw error;
        }
    };

    const handleBack = () => {
        setSelectedGastoFijo(null);
        setSelectedGastoDiario(null);
        loadGastos();
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
        margin: 10,
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
        color: '#333',
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    sectionContent: {
        marginBottom: 20,
    },
});