import { useNavigation } from '@react-navigation/native';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function NavButton({ to, text }) {
    const navigation = useNavigation();

    return (
        <Pressable
            onPress={() => navigation.navigate(to)}
            style={({ pressed }) => [
                {
                    backgroundColor: pressed ? '#ddd' : '#ccc',
                    padding: 10,
                    borderRadius: 5,
                    margin: 5,
                },
            ]}
        >
            <Text style={{ color: '#000', fontSize: 16 }}>{text}</Text>
        </Pressable>
    );
}
