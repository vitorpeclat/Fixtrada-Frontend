// app/Perfil/index.tsx

import { AppText } from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Menu, Pencil, UserRound } from "lucide-react-native";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

function PerfilContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(openDrawer)();
    });

  return (
    <GestureDetector gesture={flingGesture}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={openDrawer} activeOpacity={0.7}>
            <Menu size={45} color={Colors.primary} />
          </TouchableOpacity>
          <AppText style={styles.headerTitle}>{strings.profile.title}</AppText>
          <View style={styles.headerIconPlaceholder} />
        </View>

        <FlatList
          contentContainerStyle={styles.contentContainer}
          data={[]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={null}
          ListHeaderComponent={
            <View>
              {/* Avatar e Informações */}
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <UserRound size={80} color={Colors.darkGray} />
                </View>
                <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
                  <Pencil size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
              <AppText style={styles.userName}>Nome Cliente</AppText>
              <AppText style={styles.userEmail}>email@cliente.com</AppText>
            </View>
          }
        />
      </View>
    </GestureDetector>
  );
}

export default function PerfilScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PerfilContent />
    </GestureHandlerRootView>
  );
}
