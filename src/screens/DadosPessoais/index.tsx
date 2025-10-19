import {
    AppText
} from "@/components";
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

function DadosPessoaisContent (){
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: 'https://avatars.githubusercontent.com/u/69623412?v=4' }} 
            style={styles.profileImage} 
          />
          <TouchableOpacity style={styles.editIconContainer}>
            <Image 
              source={require('../../assets/android-icon-foreground.png')} 
              style={styles.editIcon} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.section}>
        <View style={styles.sectionContent}>
          <AppText style={styles.sectionTitle}>Nome</AppText>
          <AppText style={styles.sectionValue}>Vitor Rodrigues Peclat</AppText>
        </View>
        <Image source={require('../../assets/android-icon-foreground.png')} style={styles.arrowIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <View style={styles.sectionContent}>
          <AppText style={styles.sectionTitle}>Gênero</AppText>
          <AppText style={styles.sectionValue}>Homem</AppText>
        </View>
        <Image source={require('../../assets/android-icon-foreground.png')} style={styles.arrowIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <View style={styles.sectionContent}>
          <AppText style={styles.sectionTitle}>Número de telefone</AppText>
          <View style={styles.sectionValueContainer}>
            <AppText style={styles.sectionValue}>+5511976275639</AppText>
            <Image source={require('../../assets/android-icon-foreground.png')} style={styles.verifiedIcon} />
          </View>
        </View>
        <Image source={require('../../assets/android-icon-foreground.png')} style={styles.arrowIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <View style={styles.sectionContent}>
          <AppText style={styles.sectionTitle}>E-mail</AppText>
          <View style={styles.sectionValueContainer}>
            <AppText style={styles.sectionValue}>vitorr.peclat@gmail.com</AppText>
            <Image source={require('../../assets/android-icon-foreground.png')} style={styles.verifiedIcon} />
          </View>
        </View>
        <Image source={require('../../assets/android-icon-foreground.png')} style={styles.arrowIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <View style={styles.sectionContent}>
          <AppText style={styles.sectionTitle}>Verificação de identidade</AppText>
          <AppText style={styles.sectionValue}>Adicione seu documento de identidade</AppText>
        </View>
        <Image source={require('../../assets/android-icon-foreground.png')} style={styles.arrowIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <View style={styles.sectionContent}>
          <AppText style={styles.sectionTitle}>Idioma</AppText>
          <AppText style={styles.sectionValue}>Atualizar idioma do dispositivo</AppText>
        </View>
        <Image source={require('../../assets/android-icon-foreground.png')} style={styles.arrowIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default function DadosPessoaisScreen() {
  return (
      <DadosPessoaisContent />
  );
}
