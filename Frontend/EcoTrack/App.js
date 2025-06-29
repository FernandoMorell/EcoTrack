import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './pages/Layout.js';
import LoginPage from './pages/LoginPage.js';
import { enableScreens } from 'react-native-screens';
import { userService } from './services/ApiServices';
import { SafeAreaProvider } from 'react-native-safe-area-context';

enableScreens();
const Stack = createNativeStackNavigator();

function AppContent() {
    const { user, checkAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                await checkAuth();
            } catch (e) {
                console.error('Fallo en checkAuth:', e);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);    

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <Text>Cargando...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaProvider style={styles.safeArea}>
            <StatusBar style="auto" />
            <NavigationContainer>                
              <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    {user ? (
                        <Stack.Screen 
                            name="Main" 
                            component={Layout}
                            options={{
                                headerShown: false
                            }}
                        />
                    ) : (
                        <Stack.Screen name="Login" component={LoginPage} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});