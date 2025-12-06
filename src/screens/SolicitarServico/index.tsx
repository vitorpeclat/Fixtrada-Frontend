// app/SolicitarServico/index.tsx

import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AppText, Button, KeyboardShiftView } from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { useVehicles } from "@/contexts/VehiclesContext";
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
  const { vehicles, loading: loadingVehicles } = useVehicles();
  
  const [tipoServico, setTipoServico] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [veiculosDoUsuario, setVeiculosDoUsuario] = useState<string[]>([]);
  const [veiculoMap, setVeiculoMap] = useState<Map<string, { carID: string; carPlaca: string }>>(new Map());
  const [tiposServicoDisponiveis, setTiposServicoDisponiveis] = useState<string[]>([]);
  const [tiposServicoMap, setTiposServicoMap] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [loadingTiposServico, setLoadingTiposServico] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [usandoLocalizacao, setUsandoLocalizacao] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [localDisplay, setLocalDisplay] = useState("");

  // Carrega os veículos do usuário
  useEffect(() => {
    if (vehicles && vehicles.length > 0) {
      const vehicleOptions: string[] = [];
      const vehicleMapping = new Map<string, { carID: string; carPlaca: string }>();
      
      vehicles.forEach((vehicle) => {
        if (vehicle.carID && vehicle.carPlaca && vehicle.carMarca && vehicle.carModelo) {
          const displayText = `${vehicle.carMarca} ${vehicle.carModelo} (${vehicle.carPlaca})`;
          vehicleOptions.push(displayText);
          vehicleMapping.set(displayText, { 
            carID: vehicle.carID, 
            carPlaca: vehicle.carPlaca 
          });
        }
      });
      
      setVeiculosDoUsuario(vehicleOptions);
      setVeiculoMap(vehicleMapping);
    }
  }, [vehicles]);

  // Busca os tipos de serviço disponíveis da API
  useEffect(() => {
    const fetchTiposServico = async () => {
      try {
        setLoadingTiposServico(true);
        const token = await AsyncStorage.getItem("userToken");
        
        const response = await fetch(`${API_BASE_URL}/tipos-servico`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const tipoServicoOptions: string[] = [];
          const tipoServicoMapping = new Map<string, string>();

          if (Array.isArray(data)) {
            data.forEach((tipo: any) => {
              if (tipo.tseID && tipo.tseTipoProblema) {
                tipoServicoOptions.push(tipo.tseTipoProblema);
                tipoServicoMapping.set(tipo.tseTipoProblema, tipo.tseID);
              }
            });
          }

          setTiposServicoDisponiveis(tipoServicoOptions);
          setTiposServicoMap(tipoServicoMapping);
        } else {
          // Fallback para valores estáticos se a API falhar
          setTiposServicoDisponiveis(TIPOS_DE_SERVICO);
        }
      } catch (error) {
        console.error("Erro ao buscar tipos de serviço:", error);
        // Fallback para valores estáticos se houver erro
        setTiposServicoDisponiveis(TIPOS_DE_SERVICO);
      } finally {
        setLoadingTiposServico(false);
      }
    };

    fetchTiposServico();
  }, []);

  // Função para obter localização do usuário
  const obterLocalizacaoUsuario = async () => {
    try {
      setLoadingLocation(true);
      
      // Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          strings.global.attention,
          "Permissão de localização negada. Por favor, habilite nas configurações."
        );
        return;
      }

      // Obter localização atual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Fazer geocodificação reversa para obter o endereço
      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode) {
        const rua = geocode.street || geocode.name || "";
        const numero = geocode.streetNumber || "";
        const bairro = geocode.district || geocode.subregion || "";
        const cidade = geocode.city || geocode.subregion || geocode.name || "";
        const estado = geocode.region || geocode.subregion || "";

        setCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setLocalDisplay(
          `${rua}${numero ? ", " + numero : ""}${bairro ? " - " + bairro : ""}${cidade ? " - " + cidade : ""}${estado ? " - " + estado : ""}`
        );
        setUsandoLocalizacao(true);

        Alert.alert(
          "Localização Obtida",
          `${rua}${numero ? ", " + numero : ""}\n${bairro ? bairro + " - " : ""}${cidade}${estado ? "/" + estado : ""}`
        );
      } else {
        Alert.alert(
          strings.global.error,
          "Não foi possível obter o endereço da sua localização."
        );
      }
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      Alert.alert(
        strings.global.error,
        "Erro ao obter sua localização. Tente novamente."
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSolicitar = async () => {
    if (!tipoServico || !veiculo) {
      Alert.alert(
        strings.global.attention,
        strings.solicitarServico.validationError
      );
      return;
    }

    if (!descricao || descricao.trim() === "") {
      Alert.alert(
        strings.global.attention,
        "Por favor, informe uma descrição para o serviço."
      );
      return;
    }

    // Exigir uso da localização
    if (!usandoLocalizacao || !coords) {
      Alert.alert(
        strings.global.attention,
        "Para solicitar o serviço é necessário usar sua localização."
      );
      return;
    }

    try {
      setLoading(true);
      const veiculoData = veiculoMap.get(veiculo);
      const tipoServicoID = tiposServicoMap.get(tipoServico);

      if (!veiculoData?.carID) {
        Alert.alert(strings.global.error, "Veículo inválido.");
  setLoading(false);
        return;
      }

      if (!tipoServicoID) {
        Alert.alert(strings.global.error, "Tipo de serviço inválido.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          regDescricao: descricao.trim(),
          fk_carro_carID: veiculoData.carID,
          fk_tipo_servico_tseID: tipoServicoID,
          regLatitude: coords.latitude,
          regLongitude: coords.longitude,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        Alert.alert(
          strings.solicitarServico.successTitle,
          strings.solicitarServico.successMessage
        );
        router.back();
      } else {
        Alert.alert(
          strings.global.error,
          data.message || "Erro ao solicitar serviço."
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      Alert.alert(strings.global.error, strings.global.serverError);
    } finally {
      setLoading(false);
    }
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
              placeholder={loadingTiposServico ? "Carregando tipos de serviço..." : strings.solicitarServico.tipoServicoPlaceholder}
              options={tiposServicoDisponiveis}
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

            {/* Campo de Endereço/CEP (somente localização) */}
            <View style={styles.pickerWrapper}>
              <Text style={styles.label}>Endereço do Local do Serviço</Text>
              <View style={styles.pickerContainer}>
                <TextInput
                  style={[styles.pickerText, { flex: 1 }]}
                  placeholder="Use sua localização para preencher o endereço"
                  placeholderTextColor={Colors.primaryLight}
                  value={
                    usandoLocalizacao && localDisplay
                      ? localDisplay
                      : ""
                  }
                  editable={false}
                />
              </View>
              <TouchableOpacity
                onPress={obterLocalizacaoUsuario}
                disabled={loadingLocation}
                style={{
                  marginTop: 8,
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: Colors.primary,
                  borderRadius: 6,
                }}
              >
                {loadingLocation ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Feather name="map-pin" size={14} color="#fff" />
                    <Text style={{ color: "#fff", marginLeft: 6, fontSize: 12 }}>
                      Usar minha localização
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              {!usandoLocalizacao && (
                <Text style={{ marginTop: 6, fontSize: 12, color: Colors.primaryLight }}>
                  É obrigatório usar a localização para solicitar o serviço.
                </Text>
              )}
            </View>

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
              <Text style={{ fontSize: 12, color: Colors.primaryLight, marginTop: 5 }}>
                * Campo obrigatório
              </Text>
            </View>

            <View style={{ marginTop: 25, width: "100%", alignItems: 'center' }}>
              <Button
                title={strings.solicitarServico.solicitarButton}
                containerStyle={{ width: "80%" }}
                onPress={handleSolicitar}
                disabled={loading || loadingVehicles || loadingTiposServico || loadingLocation}
              />
              {(loading || loadingVehicles || loadingTiposServico || loadingLocation) && (
                <ActivityIndicator 
                  size="small" 
                  color={Colors.primary} 
                  style={{ marginTop: 10 }} 
                />
              )}
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
