import React from 'react';
import { View } from 'react-native';
import { AppText } from '@/components';
import { styles } from './styles';

export default function VerificarAvaliacaoScreen() {
  return (
    <View style={styles.container}>
      <AppText style={styles.text}>Tela de Verificar Avaliação</AppText>
    </View>
  );
}
