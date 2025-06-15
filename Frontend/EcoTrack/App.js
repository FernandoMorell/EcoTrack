import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './pages/Layout.js';
import LoginPage from './pages/LoginPage.js';
import { userService } from './services/ApiServices';

const Stack = createNativeStackNavigator();

function AppContent() {
    const { user, checkAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await checkAuth();
            setIsLoading(false);
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
        <SafeAreaView style={styles.safeArea}>
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
        </SafeAreaView>
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
        marginTop: StatusBar.currentHeight || 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});