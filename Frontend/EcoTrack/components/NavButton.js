import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../themes/colors.js';

export default function NavButton({ to, icon, nested }) {
    const navigation = useNavigation();

    const handleNavigation = () => {
        if (nested) {
            if (navigation.getState().routes[0].name === 'Login') {
                navigation.navigate(to);
            } else {
                navigation.navigate('Main', { screen: to });
            }
        } else {
            navigation.navigate(to);
        }
    };

    return (
        <Pressable
            onPress={handleNavigation}
            style={styles.button}
        >
            <MaterialIcons name={icon} size={28} color="#fff" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.header,
    },
});
