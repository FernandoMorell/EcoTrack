import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function GastoDiarioCard({ gasto, onPress }) {
  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Comida':
        return '#3498db';
      case 'Ocio':
        return '#9b59b6';
      case 'Ropa':
        return '#f1c40f';
    case 'Transporte':
        return '#e67e22';
    case 'Hogar':
        return '#2ecc71';
      default:
        return '#95a5a6';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(gasto)}>
      <View style={styles.leftContent}>
        <View style={[styles.tipoIndicator, { backgroundColor: getTipoColor(gasto.tipo) }]} />
        <View>
          <Text style={styles.nombre}>{gasto.nombre}</Text>
          <Text style={styles.tipo}>{gasto.tipo}</Text>
        </View>
      </View>
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
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipoIndicator: {
    width: 8,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tipo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cantidad: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
});
