import { StyleSheet, View } from 'react-native';
import NavButton from './NavButton';

export default function NavBar() {
    return (
        <View style={styles.navBar}>
            <NavButton to="Home" text="Home" nested={true} />
            <NavButton to="Ingresos" text="Ingresos" nested={true} />
            <NavButton to="Gastos" text="Gastos" nested={true} />
            <NavButton to="Notificaciones" text="Notificaciones" nested={true} />
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