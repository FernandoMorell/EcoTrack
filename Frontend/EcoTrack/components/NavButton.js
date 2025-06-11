import { useNavigation } from '@react-navigation/native';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function NavButton({ to, text, nested }) {
    const navigation = useNavigation();

    const handleNavigation = () => {
        if (nested) {
            // Si estamos en el Login, navegamos directamente
            if (navigation.getState().routes[0].name === 'Login') {
                navigation.navigate(to);
            } else {
                // Si estamos en el Layout, navegamos dentro de Main
                navigation.navigate('Main', { screen: to });
            }
        } else {
            navigation.navigate(to);
        }
    };

    return (
        <Pressable
            onPress={handleNavigation}
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: pressed ? '#ddd' : '#fff',
                },
            ]}
        >
            <Text style={styles.text}>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        margin: 5,
        minWidth: 80,
        alignItems: 'center',
    },
    text: {
        color: '#000',
        fontSize: 16,
    }
});
