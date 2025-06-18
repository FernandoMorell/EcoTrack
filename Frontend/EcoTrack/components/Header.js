import { Image, View, StyleSheet } from 'react-native';
import NavButton from './NavButton.js';
import colors from '../themes/colors.js';

export default function Header() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/Icon.png')}
                style={styles.icon}
            >
            </Image>
            
            <NavButton to="Profile" icon="person" nested={true} />
            
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
        backgroundColor: colors.header,
    },
    icon: {
        width: 40,
        height: 40,
    },
});