import { StyleSheet, View } from 'react-native';
import NavButton from './NavButton';

export default function NavBar() {
    return (
        <View style={styles.navBar}>
            <NavButton to="Home" icon="account-balance" nested={true} />
            <NavButton to="Ingresos" icon="attach-money" nested={true} />
            <NavButton to="Gastos" icon="money-off" nested={true} />
            <NavButton to="Notificaciones" icon="notifications" nested={true} />
        </View>
    );
}

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#2C3E50',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
});
