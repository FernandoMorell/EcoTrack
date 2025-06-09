import { useNavigation } from '@react-navigation/native';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function NavButton({ to, text }) {
    const navigation = useNavigation();

    return (
        <Pressable
            onPress={() => navigation.navigate(to)}
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
