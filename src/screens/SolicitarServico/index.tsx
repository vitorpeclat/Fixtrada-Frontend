// app/SolicitarServico/index.tsx

import { Feather } from "@expo/vector-icons";
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

import {
  AppText,
  Button,
  KeyboardShiftView
} from "@/components";
import api from "@/lib/api";
import { useVehicles } from "@/contexts/VehiclesContext";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { formatCEP } from "@/utils/formatters";
import { styles } from "./styles";

// Tipo para o endereço
interface EnderecoData {
  endCEP: string;
  endRua: string;
  endCidade: string;
  endEstado: string;
  endBairro?: string;
  endNumero?: string;
}

// Mapeamento de estados brasileiros para UF
const ESTADOS_UF: Record<string, string> = {
  "Acre": "AC",
  "Alagoas": "AL",
  "Amapá": "AP",
  "Amazonas": "AM",
  "Bahia": "BA",
  "Ceará": "CE",
  "Distrito Federal": "DF",
  "Espírito Santo": "ES",
  "Goiás": "GO",
  "Maranhão": "MA",
  "Mato Grosso": "MT",
  "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG",
  "Pará": "PA",
  "Paraíba": "PB",
  "Paraná": "PR",
  "Pernambuco": "PE",
  "Piauí": "PI",
  "Rio de Janeiro": "RJ",
  "Rio Grande do Norte": "RN",
  "Rio Grande do Sul": "RS",
  "Rondônia": "RO",
  "Roraima": "RR",
  "Santa Catarina": "SC",
  "São Paulo": "SP",
  "Sergipe": "SE",
  "Tocantins": "TO",
};

const UF_SET = new Set(Object.values(ESTADOS_UF));

function normalizeStateName(value: string): string {
  // Remove acentos, símbolos e prefixos comuns como "Estado de"/"State of"
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\b(estado|state|provincia|province)\b\s*(de|da|do|of)?\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toUF(possible: string | null | undefined): string | null {
  if (!possible) return null;
  const trimmed = possible.trim();

  // Caso já seja exatamente uma UF
  if (/^[A-Za-z]{2}$/.test(trimmed)) {
    const upper = trimmed.toUpperCase();
    return UF_SET.has(upper) ? upper : null;
  }

  // Tentar extrair uma UF de tokens de 2 letras (ex: "SP - São Paulo")
  const tokens = trimmed.split(/[^A-Za-z]+/).filter(Boolean);
  for (const t of tokens) {
    if (t.length === 2) {
      const upper = t.toUpperCase();
      if (UF_SET.has(upper)) return upper;
    }
  }

  // Tentar mapear pelo nome por extenso (com tolerância a prefixos e sufixos)
  const normalized = normalizeStateName(trimmed);
  for (const [nome, uf] of Object.entries(ESTADOS_UF)) {
    const nomeNorm = normalizeStateName(nome);
    if (normalized === nomeNorm || new RegExp(`(^|\n|\r|\b)${nomeNorm}(\b|$)`).test(normalized)) {
      return uf;
    }
  }

  return null;
}

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
  const [enderecoCompleto, setEnderecoCompleto] = useState<EnderecoData | null>(null);
  const [usandoLocalizacao, setUsandoLocalizacao] = useState(false);

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
        const response = await api.get("/tipos-servico");

        if (response.status === 200) {
          const data = response.data;
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
        // Extrair CEP
        const cep = (geocode.postalCode || "").replace(/\D/g, "");

        // cidade com fallback
        const cidade = geocode.city || geocode.subregion || geocode.district || geocode.name || "";

        // tentar obter UF a partir do region (nome por extenso) ou se já vier abreviado
        const ufFromRegion = toUF(geocode.region);
        const uf = ufFromRegion || toUF(geocode.subregion) || toUF(geocode.city) || "";

        const enderecoData: EnderecoData = {
          endCEP: cep,
          endRua: geocode.street || geocode.name || "",
          endCidade: cidade || "",
          endEstado: uf || "",
          endBairro: geocode.district || geocode.subregion || undefined,
          endNumero: geocode.streetNumber || undefined,
        };

        setEnderecoCompleto(enderecoData);
        setUsandoLocalizacao(true);

        Alert.alert(
          "Localização Obtida",
          `${enderecoData.endRua}${enderecoData.endNumero ? ", " + enderecoData.endNumero : ""}\n${enderecoData.endBairro ? enderecoData.endBairro + " - " : ""}${enderecoData.endCidade}${enderecoData.endEstado ? "/" + enderecoData.endEstado : ""}`
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

  // Função para criar endereço no banco de dados
  const criarEndereco = async (enderecoData: EnderecoData): Promise<string | null> => {
    try {
      const response = await api.post("/enderecos", enderecoData);

      if (response.status === 201 || response.status === 200) {
        return enderecoData.endCEP;
      }
      // Se o endereço já existe (409 Conflict)
      else if (response.status === 409) {
        return enderecoData.endCEP;
      }
      else {
        throw new Error(response.data.message || "Erro ao criar endereço");
      }
    } catch (error: any) {
        // Se a API retornar um erro de conflito, significa que o endereço já existe.
        if (error.response && error.response.status === 409) {
            console.log("Endereço já existe, usando CEP existente.");
            return enderecoData.endCEP;
        }
      console.error("Erro ao criar endereço:", error);
      throw error;
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

    // Exigir uso da localização e endereço preenchido
    if (!usandoLocalizacao || !enderecoCompleto) {
      Alert.alert(
        strings.global.attention,
        "Para solicitar o serviço é necessário usar sua localização para preencher o endereço."
      );
      return;
    }
    if (!enderecoCompleto.endCEP || enderecoCompleto.endCEP.replace(/\D/g, "").length !== 8) {
      Alert.alert(
        strings.global.attention,
        "Não foi possível obter um CEP válido da sua localização."
      );
      return;
    }

    try {
      setLoading(true);
      const veiculoData = veiculoMap.get(veiculo);
      const tipoServicoID = tiposServicoMap.get(tipoServico);
    let cepFinal: string | null = null;

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

      // Criar/sincronizar endereço primeiro (obrigatório)
      try {
        const cepCriado = await criarEndereco(enderecoCompleto);
        if (cepCriado) {
          cepFinal = cepCriado;
        } else {
          throw new Error("CEP não retornado");
        }
      } catch (error) {
        Alert.alert(
          strings.global.error,
          "Erro ao registrar o endereço. Tente novamente."
        );
        setLoading(false);
        return;
      }

      const response = await api.post("/services", {
        regDescricao: descricao.trim(),
        fk_carro_carID: veiculoData.carID,
        fk_tipo_servico_tseID: tipoServicoID,
        fk_endereco_endCEP: cepFinal,
      });

      const data = response.data;
      
      if (response.status === 201) {
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
    } catch (error: any) {
      console.error("Erro na requisição:", error);
      Alert.alert(strings.global.error, error.response?.data?.message || strings.global.serverError);
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
                    usandoLocalizacao && enderecoCompleto
                      ? `${enderecoCompleto.endRua || ""}${enderecoCompleto.endNumero ? ", " + enderecoCompleto.endNumero : ""}${enderecoCompleto.endBairro ? " - " + enderecoCompleto.endBairro : ""}${enderecoCompleto.endEstado ? " - " + enderecoCompleto.endEstado : ""}`
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
