import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import HomePage from './HomePage';
import IngresosPage from './IngresosPage';
import GastosPage from './GastosPage';
import NotificacionesPage from './NotificacionesPage';
import ProfilePage from './ProfilePage';

const Stack = createNativeStackNavigator();

export default function Layout() {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Header />
            </View>
            
            <View style={styles.contentContainer}>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Stack.Screen name="Home" component={HomePage} />
                    <Stack.Screen name="Ingresos" component={IngresosPage} />
                    <Stack.Screen name="Gastos" component={GastosPage} />
                    <Stack.Screen name="Notificaciones" component={NotificacionesPage} />
                    <Stack.Screen name="Profile" component={ProfilePage} />
                </Stack.Navigator>
            </View>
            
            <View style={styles.navContainer}>
                <NavBar />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    contentContainer: {
        flex: 1,
        marginTop: 65, 
        marginBottom: 65,
    },
    navContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});