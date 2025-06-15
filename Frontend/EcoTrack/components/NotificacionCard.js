import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function NotificacionCard({ notificacion, onDelete, marcarLeido }) {
  return (    <View style={[
      styles.card,
      { backgroundColor: notificacion.leido ? '#f5f5f5' : 'white', borderLeftColor: notificacion.leido ? '#95a5a6' : '#3498db' }
    ]}>
      <View style={styles.content}>
        <Text style={[
          styles.title,
          notificacion.leido && styles.leido
        ]}>{notificacion.titulo}</Text>
        <Text style={[
          styles.mensaje,
          notificacion.leido && styles.leido
        ]}>{notificacion.mensaje}</Text>
      </View>
      <View style={styles.actions}>
        {!notificacion.leido && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => marcarLeido(notificacion._id)}
          >
            <MaterialIcons name="check-circle" size={24} color="#2ecc71" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(notificacion._id)}
        >
          <MaterialIcons name="delete" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {    backgroundColor: 'white',
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
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  content: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  mensaje: {
    fontSize: 14,
    color: '#666',
  },
  fecha: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  leido: {
    color: '#95a5a6',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
  },
});
