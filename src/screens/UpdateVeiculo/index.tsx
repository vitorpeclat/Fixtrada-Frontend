import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

import {
  AnimatedView,
  AnimationProvider,
  AppText,
  Button,
  Input,
  useScreenAnimation,
} from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { useVehicles } from "@/contexts/VehiclesContext";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { useLocalSearchParams } from "expo-router";
import { styles } from "./styles";

type AnimatableViewRef = Animatable.View &
  View & {
    fadeOutUp: (duration: number) => void;
  };

function UpdateVeiculoContent() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { vehicles, reload } = useVehicles();
  const vehicle = vehicles.find((v) => v.carID === params.id);

  const [placa, setPlaca] = useState("");
  const [placaError, setPlacaError] = useState<string | null>(null);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [quilometragem, setQuilometragem] = useState("");
  const [tipoCombustivel, setTipoCombustivel] = useState("");
  const [cor, setCor] = useState("");
  const [tracao, setTracao] = useState("");
  const [trocaOleo, setTrocaOleo] = useState("");
  const [trocaPneu, setTrocaPneu] = useState("");
  const [revisao, setRevisao] = useState("");
  const [showOptional, setShowOptional] = useState(false);
  const formRef = useRef<Animatable.View & { shake: (duration: number) => void }>(null);
  const { handleGoBack, handleHardwareBackPress, handleNavigatePush } = useScreenAnimation();
  const optionalRef1 = useRef<AnimatableViewRef>(null);
  const optionalRef2 = useRef<AnimatableViewRef>(null);

  // Helper para converter ISO (YYYY-MM-DD) para BR (DD/MM/YYYY) sem fuso
  const isoToBr = (valor?: string | null) => {
    if (!valor) return "";
    const onlyDate = valor.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(onlyDate)) {
      const [y, m, d] = onlyDate.split("-");
      return `${d}/${m}/${y}`;
    }
    return valor; // já em outro formato
  };

  // Preencher campos com dados do veículo (convertendo datas para dd/mm/aaaa)
  useEffect(() => {
    if (vehicle) {
      setPlaca(vehicle.carPlaca || "");
      setMarca(vehicle.carMarca || "");
      setModelo(vehicle.carModelo || "");
      setAno(vehicle.carAno ? String(vehicle.carAno) : "");
      setQuilometragem(vehicle.carKM ? String(vehicle.carKM) : "");
      setTipoCombustivel(vehicle.carTpCombust || "");
      setCor(vehicle.carCor || "");
      setTracao(vehicle.carOpTracao || "");
      setTrocaOleo(isoToBr(vehicle.carOpTrocaOleo));
      setTrocaPneu(isoToBr(vehicle.carOpTrocaPneu));
      setRevisao(isoToBr(vehicle.carOpRevisao));

      if (vehicle.carOpTracao || vehicle.carOpRevisao || vehicle.carOpTrocaPneu || vehicle.carOpTrocaOleo) {
        setShowOptional(true);
      }
    }
  }, [vehicle]);

  const handleHideOptional = () => {
    optionalRef1.current?.fadeOutUp(200);
    setTimeout(() => optionalRef2.current?.fadeOutUp(200), 100);
    setTimeout(() => setShowOptional(false), 400);
  };

  const dataFormatter = (dado: string) => {
    if (!dado || dado.split("/").length !== 3) return undefined;
    const [dia, mes, ano] = dado.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  const handleUpdate = async () => {
    if (!vehicle?.carID) {
      Alert.alert(strings.global.error, "Veículo não encontrado.");
      return;
    }

    const isPlacaValid = validatePlaca(placa);
    if (!isPlacaValid) {
      formRef.current?.shake(800);
      setPlacaError(strings.cadastroVeiculo.invalidPlaca || "Formato de placa inválido");
      return;
    }

    const kmLimpo = quilometragem.replace(/\D/g, "");
    if (!(marca && modelo) || ano.length !== 4 || !kmLimpo || !cor) {
      formRef.current?.shake(800);
      Alert.alert(strings.global.validationError, strings.cadastroVeiculo.validationMessage);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const placaFormatada = placa.toUpperCase().replace(/[^A-Z0-9]/g, "");
      
      const response = await fetch(`${API_BASE_URL}/vehicles/${vehicle.carID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          carPlaca: placaFormatada,
          carMarca: marca,
          carModelo: modelo,
          carAno: Number.parseInt(ano, 10),
          carCor: cor,
          carKM: Number.parseInt(kmLimpo, 10),
          carTpCombust: tipoCombustivel || undefined,
          carOpTracao: tracao || undefined,
          carOpTrocaOleo: dataFormatter(trocaOleo),
          carOpTrocaPneu: dataFormatter(trocaPneu),
          carOpRevisao: dataFormatter(revisao),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        await reload(); // Atualizar contexto
        Alert.alert(strings.global.success, "Veículo atualizado com sucesso!");
        handleNavigatePush("/Home", "fadeOutUp");
      } else {
        formRef.current?.shake(800);
        Alert.alert(strings.global.error, data.message || "Erro ao atualizar veículo.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      formRef.current?.shake(800);
      Alert.alert(strings.global.error, strings.global.serverError);
    }
  };

  const validatePlaca = (text: string) => {
    if (!text) return false;
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const oldFormat = /^[A-Z]{3}[0-9]{4}$/;
    const mercosulFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    return oldFormat.test(cleaned) || mercosulFormat.test(cleaned);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleHardwareBackPress);
    return () => backHandler.remove();
  }, [handleHardwareBackPress]);

  if (!vehicle) {
    return (
      <View style={styles.container}>
        <AppText style={{ textAlign: "center", marginTop: 100 }}>Veículo não encontrado.</AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedView style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleGoBack("fadeOutDown")}
          style={styles.backButton}
        >
          <Feather color={Colors.primary} name="chevron-left" size={24} />
          <AppText style={styles.backButtonText}>{strings.global.back}</AppText>
        </TouchableOpacity>
      </AnimatedView>

      <AnimatedView>
        <AppText style={styles.title}>Atualizar Veículo</AppText>
      </AnimatedView>

      <FlatList
        contentContainerStyle={styles.content}
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={null}
        ListHeaderComponent={
          <Animatable.View ref={formRef} style={styles.form}>
            <AnimatedView style={[styles.row]}>
              <Input
                containerStyle={{ width: "90%" }}
                label={strings.cadastroVeiculo.placaLabel}
                onChangeText={(text) => {
                  setPlaca(text);
                  if (text === "") {
                    setPlacaError(null);
                  } else if (validatePlaca(text)) {
                    setPlacaError(null);
                  } else {
                    setPlacaError(strings.cadastroVeiculo.invalidPlaca || "Formato de placa inválido");
                  }
                }}
                placeholder={strings.cadastroVeiculo.placaPlaceholder}
                type="placa"
                value={placa}
                error={placaError}
              />
            </AnimatedView>
            <AnimatedView style={[styles.row]}>
              <Input
                containerStyle={{ width: "90%" }}
                label={strings.cadastroVeiculo.marcaLabel}
                onChangeText={setMarca}
                placeholder={strings.cadastroVeiculo.marcaPlaceholder}
                value={marca}
              />
            </AnimatedView>
            <AnimatedView style={[styles.row]}>
              <Input
                containerStyle={{ width: "90%" }}
                label={strings.cadastroVeiculo.modeloLabel}
                onChangeText={setModelo}
                placeholder={strings.cadastroVeiculo.modeloPlaceholder}
                value={modelo}
              />
            </AnimatedView>

            <AnimatedView style={[styles.row, { width: "90%" }]}>
              <View style={{ flex: 0.7 }}>
                <Input
                  label={strings.cadastroVeiculo.combustivelLabel}
                  placeholder={strings.global.select}
                  type="fuel"
                  value={tipoCombustivel}
                  onFuelChange={({ fuel }) => setTipoCombustivel(fuel)}
                />
              </View>
              <View style={{ flex: 0.3 }}>
                <Input
                  label={strings.cadastroVeiculo.anoLabel}
                  onYearChange={({ year }) => setAno(year)}
                  placeholder={strings.cadastroVeiculo.anoPlaceholder}
                  type="year"
                  value={ano}
                />
              </View>
            </AnimatedView>

            <AnimatedView style={[styles.row, { width: "90%" }]}>
              <View style={styles.rowItem}>
                <Input
                  keyboardType="number-pad"
                  label={strings.cadastroVeiculo.kmLabel}
                  onChangeText={setQuilometragem}
                  placeholder={strings.cadastroVeiculo.kmPlaceholder}
                  value={quilometragem}
                />
              </View>
              <View style={styles.rowItem}>
                <Input
                  label={strings.cadastroVeiculo.corLabel}
                  onChangeText={setCor}
                  placeholder={strings.cadastroVeiculo.corPlaceholder}
                  value={cor}
                />
              </View>
            </AnimatedView>

            <AnimatedView>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={showOptional ? handleHideOptional : () => setShowOptional(true)}
                style={styles.optionalToggle}
              >
                <Feather color={Colors.secondary} name={showOptional ? "minus" : "plus"} size={20} />
                <AppText style={styles.optionalText}>{strings.cadastroVeiculo.optionalData}</AppText>
              </TouchableOpacity>
            </AnimatedView>

            {showOptional && (
              <View style={styles.optionalContainer}>
                <Animatable.View
                  animation="fadeInDown"
                  duration={400}
                  ref={optionalRef1}
                  style={[styles.row, { width: "90%" }]}
                >
                  <View style={styles.rowItem}>
                    <Input
                      label={strings.cadastroVeiculo.tracaoLabel}
                      onChangeText={setTracao}
                      placeholder={strings.cadastroVeiculo.tracaoPlaceholder}
                      value={tracao}
                    />
                  </View>
                  <View style={styles.rowItem}>
                    <Input
                      label={strings.cadastroVeiculo.revisaoLabel}
                      onDateChange={({ date }) => setRevisao(date)}
                      placeholder={strings.global.datePlaceholder}
                      value={revisao}
                      type="date"
                    />
                  </View>
                </Animatable.View>
                <Animatable.View
                  animation="fadeInDown"
                  duration={400}
                  ref={optionalRef2}
                  style={[styles.row, { width: "90%" }]}
                >
                  <View style={styles.rowItem}>
                    <Input
                      label={strings.cadastroVeiculo.trocaPneuLabel}
                      onDateChange={({ date }) => setTrocaPneu(date)}
                      placeholder={strings.global.datePlaceholder}
                      type="date"
                      value={trocaPneu}
                    />
                  </View>
                  <View style={styles.rowItem}>
                    <Input
                      label={strings.cadastroVeiculo.trocaOleoLabel}
                      onDateChange={({ date }) => setTrocaOleo(date)}
                      placeholder={strings.global.datePlaceholder}
                      type="date"
                      value={trocaOleo}
                    />
                  </View>
                </Animatable.View>
              </View>
            )}
          </Animatable.View>
        }
      />

      <View style={styles.buttonContainer}>
        <Button
          containerStyle={{ width: "60%" }}
          onPress={handleUpdate}
          title="Atualizar Veículo"
        />
      </View>
    </View>
  );
}

export default function UpdateVeiculoScreen() {
  return (
    <AnimationProvider>
      <UpdateVeiculoContent />
    </AnimationProvider>
  );
}
