import { AppText } from "@/components";
import { Colors } from "@/theme/colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Menu, Star } from "lucide-react-native";
import React from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

// Tipo para os dados estáticos do card
type ServiceCardData = {
  id: string;
  title: string;
  carModel: string;
  visitValue: string;
  rating: number;
  avatarUrl: string;
};

// Gerando 10 cards estáticos
const STATIC_DATA: ServiceCardData[] = Array.from({ length: 10 }).map((_, index) => ({
  id: String(index),
  title: "AUTOREPAIR",
  carModel: index % 2 === 0 ? "Gol 2011" : "Fiat Uno 2013",
  visitValue: "50,00",
  rating: 5,
  // Placeholder de imagem para simular o logo da mecânica
  avatarUrl: "https://img.freepik.com/free-vector/car-repair-logo-template_23-2148963287.jpg", 
}));

export default function ServicosScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderCard = ({ item }: { item: ServiceCardData }) => (
    <View style={styles.cardContainer}>
      {/* Lado Esquerdo: Logo */}
      <View style={styles.cardLogoContainer}>
        <Image 
          source={{ uri: item.avatarUrl }} 
          style={styles.cardLogo} 
          resizeMode="cover"
        />
      </View>

      {/* Lado Direito: Informações */}
      <View style={styles.cardContent}>
        <AppText style={styles.cardTitle}>
          {item.title} <AppText style={styles.cardSubtitle}>– {item.carModel}</AppText>
        </AppText>

        <AppText style={styles.cardValueText}>
          Valor de Visita.......R$ {item.visitValue}
        </AppText>

        <View style={styles.ratingContainer}>
          <AppText style={styles.ratingLabel}>Nota: {item.rating}</AppText>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={18} 
                color="#FFD700" 
                fill="#FFD700" 
                style={{ marginLeft: 2 }}
              />
            ))}
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]} 
            activeOpacity={0.8}
            onPress={() => console.log(`Aceitar ${item.id}`)}
          >
            <AppText style={styles.buttonText}>Aceitar</AppText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]} 
            activeOpacity={0.8}
            onPress={() => console.log(`Recusar ${item.id}`)}
          >
            <AppText style={styles.buttonText}>Recusar</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.headerIcon, { top: insets.top + 10 }]}
        onPress={openDrawer}
        activeOpacity={0.7}
      >
        <Menu size={45} color={Colors.primary} />
      </TouchableOpacity>

      <View style={[styles.contentContainer, { paddingTop: insets.top + 60 }]}>
        <FlatList
          data={STATIC_DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}