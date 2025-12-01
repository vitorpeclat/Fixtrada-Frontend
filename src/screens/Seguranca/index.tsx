import {
  AppText,
  Button,
  Input,
  PasswordValidation,
} from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { useAuth } from "@/contexts/AuthContext";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { FilterStatus } from "@/types/FilterStatus";
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
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

function SegurancaContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isCpfModalVisible, setIsCpfModalVisible] = useState(false);
  const [cpf, setCpf] = useState("");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loadingChange, setLoadingChange] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(
    FilterStatus.HIDE
  );
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
    match: false,
  });

  const snapPoints = useMemo(() => ["65%"], []);

  useEffect(() => {
    const arePasswordsMatching =
      novaSenha.length > 0 && novaSenha === confirmarSenha;
    setPasswordCriteria((prev) => ({ ...prev, match: arePasswordsMatching }));
  }, [novaSenha, confirmarSenha]);

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
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setPasswordCriteria({
      length: false,
      uppercase: false,
      lowercase: false,
      specialChar: false,
      match: false,
    });
  }, []);

  const handleChangePassword = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert(strings.global.attention, strings.global.fillAllFields);
      return;
    }

    if (
      !passwordCriteria.length ||
      !passwordCriteria.uppercase ||
      !passwordCriteria.specialChar
    ) {
      Alert.alert(
        strings.global.invalidPassword,
        strings.cadastroCliente.passwordRequirements
      );
      return;
    }

    if (!passwordCriteria.match) {
      Alert.alert(
        strings.global.invalidPassword,
        strings.securityScreen.passwordsDontMatch // --- ATUALIZADO ---
      );
      return;
    }

    // Deriva email e role do objeto de usuário
    const email = user?.email || user?.usuLogin || user?.mecLogin;
    const role = 'cliente';
    
    if (!email) {
      Alert.alert(strings.global.attention, "E-mail do usuário não encontrado.");
      return;
    }
    
    try {
      setLoadingChange(true);
      const response = await fetch(`${API_BASE_URL}/password/change`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          role,
          senhaAtual: senhaAtual.trim(), 
          novaSenha: novaSenha.trim() 
        }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        Alert.alert(strings.global.attention, json.message || "Erro ao alterar a senha.");
        return;
      }
      Alert.alert(strings.global.success, json.message || "Senha alterada com sucesso.");
      handleClosePasswordSheet();
    } catch (e) {
      Alert.alert(strings.global.attention, "Não foi possível alterar a senha agora.");
    } finally {
      setLoadingChange(false);
    }
  };

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
          onPress={handleOpenPasswordSheet}
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
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleCloseDeleteModal}
              >
                <AppText style={styles.modalButtonTextConfirm}>
                  {strings.securityScreen.no}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleConfirmDelete}
              >
                <AppText style={styles.modalButtonTextCancel}>
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
          	<View style={styles.modalButtonContainer}>
          	  <TouchableOpacity
          	   style={[styles.modalButton, styles.modalButtonConfirm]}
          	   onPress={handleCloseCpfModal}
        	   >
          	   <AppText style={styles.modalButtonTextConfirm}>
          	     {strings.global.cancel}
          	   </AppText>
          	  </TouchableOpacity>
          	  <TouchableOpacity
          	   style={[styles.modalButton, styles.modalButtonDelete]}
          	   onPress={handleCpfSubmit}
        	   >
          	   <AppText style={styles.modalButtonTextDelete}>
          	     {strings.securityScreen.send}
          	   </AppText>
          	  </TouchableOpacity>
        	 	</View>
        	  </Pressable>
    	 	</Pressable>
      </Modal>

      <BottomSheetModal
    	ref={bottomSheetModalRef}
    	index={0}
    	snapPoints={snapPoints}
    	handleIndicatorStyle={styles.bottomSheetHandle}
    	backgroundStyle={styles.bottomSheetBackground}
    	backdropComponent={renderBackdrop}
      >
    	<BottomSheetView style={styles.bottomSheetContainer}>
    	  <AppText style={styles.bottomSheetTitle}>
    		{strings.securityScreen.changePasswordTitle} 
    	  </AppText>
    	  <Input
    		containerStyle={styles.bottomSheetInput}
    		placeholder={strings.securityScreen.currentPassword} 
    		value={senhaAtual}
    		onChangeText={setSenhaAtual}
    		status={passwordVisibility}
    		onEyeIconPress={togglePasswordVisibility}
    		secureTextEntry={passwordVisibility === FilterStatus.HIDE}
    	  />
    	  <Input
    		containerStyle={styles.bottomSheetInput}
    		placeholder={strings.securityScreen.newPassword} 
    		type="password"
    		status={passwordVisibility}
    		onEyeIconPress={togglePasswordVisibility}
    		secureTextEntry={passwordVisibility === FilterStatus.HIDE}
    		onPasswordChange={({ text, criteria }) => {
    		  setNovaSenha(text);
    		  setPasswordCriteria((prev) => ({ ...prev, ...criteria }));
    		}}
    	  />
    	  <PasswordValidation criteria={passwordCriteria} />

    	  <Input
    		containerStyle={styles.bottomSheetInput}
    		placeholder={strings.securityScreen.confirmNewPassword} 
  	 	value={confirmarSenha}
    		onChangeText={setConfirmarSenha}
    		status={passwordVisibility}
    		onEyeIconPress={togglePasswordVisibility}
    		secureTextEntry={passwordVisibility === FilterStatus.HIDE}
    	  />
      	  <Button
    title={loadingChange ? "Salvando..." : strings.global.save} 
    onPress={handleChangePassword}
    containerStyle={{ width: "100%", marginTop: 10 }}
    disabled={loadingChange}
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