import { StyleSheet, View } from 'react-native';
import NavButton from './NavButton.js';

export default function NavBar() {
    return (
        <View style={styles.navBar}>
            <NavButton to="/" text="Home" />
            <NavButton to="/ingresos" text="About" />
            <NavButton to="/gastos" text="Contact" />
            <NavButton to="/notificaciones" text="Contact" />
        </View>
    );
}

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
});