import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import colors from '../themes/colors.js';

export default function GastoDiarioCard({ gasto, onPress }) {
  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Comida':
        return '#2980B9';
      case 'Ocio':
        return '#9B59B6';
      case 'Ropa':
        return '#E67E22';
      case 'Transporte':
        return '#1ABC9C';
      case 'Hogar':
        return '#34495E';
      default:
        return '#95A5A6';
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
    color: colors.textPrimary,
  },
  tipo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cantidad: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.error,
  },
});
