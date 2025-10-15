// app/SolicitarServico/index.tsx

import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    AppText,
    Button,
    KeyboardShiftView
} from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { styles } from "./styles";

// --- Dados Simulados (substituir por chamadas de API) ---
const TIPOS_DE_SERVICO = [
  "Troca de Óleo",
  "Alinhamento e Balanceamento",
  "Revisão Geral",
  "Problemas no Motor",
  "Sistema de Freios",
  "Outro",
];

// --- Componente de Seletor Customizado ---
interface PickerInputProps {
  label: string;
  placeholder: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

function PickerInput({
  label,
  placeholder,
  options,
  selectedValue,
  onSelect,
}: PickerInputProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setModalVisible(false);
  };

  return (
    <View style={styles.pickerWrapper}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.pickerText,
            !selectedValue && { color: Colors.primaryLight },
          ]}
        >
          {selectedValue || placeholder}
        </Text>
        <Feather name="chevron-down" size={24} color={Colors.primary} />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => handleSelect(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// --- Conteúdo da Tela ---
function SolicitarServicoContent() {
  const [tipoServico, setTipoServico] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [veiculosDoUsuario, setVeiculosDoUsuario] = useState<string[]>([]);

  // Simula o carregamento dos veículos do usuário
  useEffect(() => {
    // Em um app real, você faria uma chamada à API para buscar os veículos
    const fetchUserVehicles = async () => {
      setVeiculosDoUsuario(["Volkswagen Gol (ABC-1D23)", "Honda Civic (XYZ-9F87)"]);
    };
    fetchUserVehicles();
  }, []);

  const handleSolicitar = () => {
    if (!tipoServico || !veiculo) {
      Alert.alert(
        strings.global.attention,
        strings.solicitarServico.validationError
      );
      return;
    }

    // Lógica para enviar a solicitação para a API
    console.log({ tipoServico, veiculo, descricao });

    Alert.alert(
      strings.solicitarServico.successTitle,
      strings.solicitarServico.successMessage
    );
    router.back();
  };

  return (
    <View style={styles.container}>
      <KeyboardShiftView>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color={Colors.primary} />
            <AppText style={styles.backButtonText}>
              {strings.global.back}
            </AppText>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={{ marginBottom: 20 }}>
            <AppText style={styles.title}>
              {strings.solicitarServico.title}
            </AppText>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <PickerInput
              label={strings.solicitarServico.tipoServicoLabel}
              placeholder={strings.solicitarServico.tipoServicoPlaceholder}
              options={TIPOS_DE_SERVICO}
              selectedValue={tipoServico}
              onSelect={setTipoServico}
            />

            <PickerInput
              label={strings.solicitarServico.veiculoLabel}
              placeholder={strings.solicitarServico.veiculoPlaceholder}
              options={veiculosDoUsuario}
              selectedValue={veiculo}
              onSelect={setVeiculo}
            />

            {/* Campo de Descrição */}
            <View style={styles.pickerWrapper}>
              <Text style={styles.label}>
                {strings.solicitarServico.descricaoLabel}
              </Text>
              <View style={[styles.pickerContainer, styles.textAreaContainer]}>
                <TextInput
                  style={styles.textArea}
                  placeholder={strings.solicitarServico.descricaoPlaceholder}
                  placeholderTextColor={Colors.primaryLight}
                  value={descricao}
                  onChangeText={setDescricao}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <View style={{ marginTop: 25, width: "100%", alignItems: 'center' }}>
              <Button
                title={strings.solicitarServico.solicitarButton}
                containerStyle={{ width: "80%" }}
                onPress={handleSolicitar}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardShiftView>
    </View>
  );
}

export default function SolicitarServicoScreen() {
  return <SolicitarServicoContent />;
}
