import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import LoginMenu from '../components/LoginMenu';
import RegisterMenu from '../components/RegisterMenu';
import colors from '../themes/colors';
import { useSafeAreaInsets  } from 'react-native-safe-area-context';



export default function LoginPage() {
    const [currentView, setCurrentView] = useState('login');
    const insets = useSafeAreaInsets();
    return (
      
            <View style={[styles.container, {
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }]}>

                <View style={styles.contentContainer}>
                    {currentView === 'login' ? (
                        <LoginMenu onSwitchToRegister={() => setCurrentView('register')} />
                    ) : (
                        <RegisterMenu onBack={() => setCurrentView('login')} />
                    )}
                </View>
            </View>
     
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        backgroundColor: colors.background,
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});