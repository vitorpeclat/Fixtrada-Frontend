import { StyleSheet, Text, View } from 'react-native';

export default function HistoricoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Historico</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 20 }
})