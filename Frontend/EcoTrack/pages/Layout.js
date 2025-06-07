import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import NavBar from '../components/NavBar';

export default function Layout() {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Header />
            </View>
            
            <View style={styles.contentContainer}>
                {/*Contenido de cada pagina*/}
            </View>
            
            <View style={styles.navContainer}>
                <NavBar />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: '#fff',
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
        marginTop: 120, 
        marginBottom: 60,
        padding: 15,
    },
    navContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});