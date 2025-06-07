import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet } from 'react-native';
import Layout from './pages/Layout.js';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Main"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen 
            name="Main" 
            component={Layout}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: StatusBar.currentHeight + 10 || 10, // Asegura que el contenido no se superponga al status bar
  },
});