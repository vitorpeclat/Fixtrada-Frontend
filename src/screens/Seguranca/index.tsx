// app/.../Seguranca/index.tsx (Caminho de arquivo suposto)

import {
  AppText,
  Button,
  Input,
  PasswordValidation, // --- ADICIONADO ---
} from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { FilterStatus } from "@/types/FilterStatus"; // --- ADICIONADO ---
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, {
  useCallback,
  useEffect, // --- ADICIONADO ---
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert, // --- ADICIONADO ---
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

/**
 * Componente interno que renderiza o conteúdo da tela de Segurança.
 * A lógica da tela fica encapsulada aqui.
 */
function SegurancaContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // --- States dos Modais Antigos ---
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isCpfModalVisible, setIsCpfModalVisible] = useState(false);
  const [cpf, setCpf] = useState("");

  // --- States e Refs do Bottom Sheet ---
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // --- ADICIONADO: States de validação de senha (da tela de Cadastro) ---
  const [passwordVisibility, setPasswordVisibility] = useState(
    FilterStatus.HIDE
  );
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
    match: false,
  });

  // Define a altura do bottom sheet
  const snapPoints = useMemo(() => ["65%"], []); // Aumentado para caber a validação

  // --- ADICIONADO: useEffect para validar senhas correspondentes ---
  useEffect(() => {
    const arePasswordsMatching =
      novaSenha.length > 0 && novaSenha === confirmarSenha;
    setPasswordCriteria((prev) => ({ ...prev, match: arePasswordsMatching }));
  }, [novaSenha, confirmarSenha]);

  // --- ADICIONADO: Função para alternar visibilidade ---
  const togglePasswordVisibility = () => {
    setPasswordVisibility((s) =>
      s === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE
    );
  };

  const handleOpenPasswordSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleClosePasswordSheet = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    // Limpa os campos ao fechar
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setPasswordCriteria({
      length: false,
      uppercase: false,
      specialChar: false,
      match: false,
    });
  }, []);

  // --- ATUALIZADO: Lógica para salvar a nova senha com validação ---
  const handleChangePassword = () => {
    // 1. Validação de campos vazios
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert(strings.global.attention, strings.global.fillAllFields);
      return; // Não fecha o modal
    }

    // 2. Validação dos critérios da nova senha
    if (
      !passwordCriteria.length ||
      !passwordCriteria.uppercase ||
      !passwordCriteria.specialChar
    ) {
      Alert.alert(
        strings.global.invalidPassword,
        strings.cadastroCliente.passwordRequirements // Reutilizando string do cadastro
      );
      return; // Não fecha o modal
    }

    // 3. Validação de senhas correspondentes
    if (!passwordCriteria.match) {
      Alert.alert(
        strings.global.invalidPassword,
        "A nova senha e a confirmação não coincidem." // Adicionar aos 'strings'
      );
      return; // Não fecha o modal
    }

    // Se tudo estiver OK:
    // TODO: Adicionar lógica de API para alterar a senha
    console.log("Senha Atual:", senhaAtual);
    console.log("Nova Senha:", novaSenha);

    // Limpa os campos e fecha o modal (movido para 'handleClosePasswordSheet')
    handleClosePasswordSheet();
  };

  // Função para renderizar o backdrop clicável
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={handleClosePasswordSheet}
      />
    ),
    [handleClosePasswordSheet]
  );

  // ... (funções de exclusão de conta) ...
  const handleDeleteAccountPress = () => {
    setIsDeleteModalVisible(true);
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };
  const handleConfirmDelete = () => {
    setIsDeleteModalVisible(false);
    setIsCpfModalVisible(true);
  };
  const handleCloseCpfModal = () => {
    setIsCpfModalVisible(false);
    setCpf("");
  };
  const handleCpfSubmit = () => {
    console.log("CPF enviado:", cpf);
    handleCloseCpfModal();
  };

  return (
    <View style={styles.container}>
      {/* --- Cabeçalho --- */}
      <TouchableOpacity
        style={[styles.headerIcon, { top: insets.top + 10 }]}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <ChevronLeft size={30} color={Colors.primary} />
      </TouchableOpacity>
      <AppText style={[styles.headerTitle, { top: insets.top + 12 }]}>
        {strings.securityScreen.title}
      </AppText>

      {/* --- Conteúdo Principal (Scroll) --- */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingTop: insets.top + 70 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={handleOpenPasswordSheet} // Abre o Bottom Sheet
        >
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>
              {strings.securityScreen.password}
            </AppText>
            <AppText style={styles.menuItemSubtitle}>
              {strings.securityScreen.passwordSubtitle}
            </AppText>
          </View>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={handleDeleteAccountPress}
        >
          <View style={styles.menuItemContent}>
            <AppText style={styles.deleteText}>
              {strings.securityScreen.deleteAccount}
            </AppText>
            <AppText style={styles.menuItemSubtitle}>
              {strings.securityScreen.deleteAccountWarning}
            </AppText>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* ... (Modais de Excluir Conta e CPF) ... */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isDeleteModalVisible}
        onRequestClose={handleCloseDeleteModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseDeleteModal}>
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <AppText style={styles.modalTitle}>
              {strings.securityScreen.deleteAccountModalTitle}
            </AppText>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleCloseDeleteModal}
              >
                <AppText style={styles.modalButtonTextCancel}>
                  {strings.securityScreen.no}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleConfirmDelete}
              >
                <AppText style={styles.modalButtonTextSave}>
                  {strings.securityScreen.yes}
                </AppText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isCpfModalVisible}
        onRequestClose={handleCloseCpfModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseCpfModal}>
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <AppText style={styles.modalTitle}>
              {strings.securityScreen.cpfModalTitle}
            </AppText>
            <Input
              containerStyle={styles.modalInput}
              placeholder={strings.global.cpfPlaceholder}
              value={cpf}
              onChangeText={setCpf}
              type="cpf"
              autoFocus
            />
            <Button
              title={strings.securityScreen.send}
              onPress={handleCpfSubmit}
              containerStyle={[{ width: "100%" }]}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* --- MODAL BOTTOM SHEET DE ALTERAR SENHA (ATUALIZADO) --- */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.bottomSheetHandle}
        backgroundStyle={styles.bottomSheetBackground}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <AppText style={styles.bottomSheetTitle}>Alterar Senha</AppText>
          <Input
            containerStyle={styles.bottomSheetInput}
            placeholder="Senha Atual"
            value={senhaAtual}
            onChangeText={setSenhaAtual}
            // --- Props de senha adicionadas ---
            status={passwordVisibility}
            onEyeIconPress={togglePasswordVisibility}
            secureTextEntry={passwordVisibility === FilterStatus.HIDE}
          />
          <Input
            containerStyle={styles.bottomSheetInput}
            placeholder="Nova Senha"
            // --- Props de senha ATUALIZADAS (usando onPasswordChange) ---
            type="password"
            status={passwordVisibility}
            onEyeIconPress={togglePasswordVisibility}
            secureTextEntry={passwordVisibility === FilterStatus.HIDE}
            onPasswordChange={({ text, criteria }) => {
              setNovaSenha(text);
              setPasswordCriteria((prev) => ({ ...prev, ...criteria }));
            }}
          />
          {/* --- Componente de validação ADICIONADO --- */}
          <PasswordValidation criteria={passwordCriteria} />

          <Input
            containerStyle={styles.bottomSheetInput}
            placeholder="Confirmar Nova Senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            // --- Props de senha adicionadas ---
            status={passwordVisibility}
            onEyeIconPress={togglePasswordVisibility}
            secureTextEntry={passwordVisibility === FilterStatus.HIDE}
          />
          <Button
            title="Salvar"
            onPress={handleChangePassword}
            containerStyle={{ width: "100%", marginTop: 10 }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

export default function SegurancaScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SegurancaContent />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}