import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function GastoFijoCard({ gasto, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(gasto)}>
      <Text style={styles.nombre}>{gasto.nombre}</Text>
      <Text style={styles.cantidad}>-{gasto.cantidad}€</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cantidad: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
});
