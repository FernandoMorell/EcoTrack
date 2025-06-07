import { Image, View, StyleSheet } from 'react-native';
import NavButton from './NavButton.js';

export default function Header() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/icon.png')}
                style={ styles.icon }
            />
            
            <NavButton to="/congifuracion" text="Config" />
            
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    icon: {
        width: 40,
        height: 40,
    },
});