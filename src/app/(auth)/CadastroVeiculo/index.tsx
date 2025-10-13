import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  ScrollView,
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
import { Colors } from "@/theme/colors";
import { styles } from "./styles";

type AnimatableViewRef = Animatable.View &
  View & {
    fadeOutUp: (duration: number) => void;
  };

function CadastroVeiculoContent() {
  const [placa, setPlaca] = useState("");
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
  const [usuarioID, setUsuarioID] = useState<string | null>(null);
  const formRef = useRef<
    Animatable.View & { shake: (duration: number) => void }
  >(null);
  const { handleGoBack, handleHardwareBackPress } = useScreenAnimation();
  const { handleNavigatePush } = useScreenAnimation();
  const optionalRef1 = useRef<AnimatableViewRef>(null);
  const optionalRef2 = useRef<AnimatableViewRef>(null);

  const handleHideOptional = () => {
    optionalRef1.current?.fadeOutUp(200);
    setTimeout(() => optionalRef2.current?.fadeOutUp(200), 100);

    setTimeout(() => {
      setShowOptional(false);
    }, 400);
  };

  const fetchUsuarioID = async () => {
    try {
      const id = await AsyncStorage.getItem("usuID");
      if (id !== null) {
        setUsuarioID(id);
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível encontrar seu ID de usuário. Tente fazer o login novamente."
        );
        handleGoBack("fadeOutDown");
      }
    } catch (error) {
      console.error("Erro ao resgatar o ID do usuário do AsyncStorage", error);
    }
  };

  useEffect(() => {
    fetchUsuarioID();
  }, []);

  const dataFormatter = (dado: string) => {
    if (!dado || dado.split("/").length !== 3) return undefined;
    const [dia, mes, ano] = dado.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  const handleCadastro = async () => {
    const kmLimpo = quilometragem.replace(/\D/g, "");
    const anoNumerico = Number.parseInt(ano, 10);
    const kmNumerica = Number.parseInt(kmLimpo, 10);

    if (
      !(marca && modelo) ||
      ano.length !== 4 ||
      !kmLimpo ||
      !cor
    ) {
      formRef.current?.shake(800);
      Alert.alert(
        "Erro de Validação",
        "Preencha a Marca, Modelo, Ano (AAAA), Quilometragem e Cor com dados válidos."
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const placaFormatada = placa.toUpperCase().replace(/[^A-Z0-9]/g, "");
      const response = await fetch(`${API_BASE_URL}/vehicle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          carPlaca: placaFormatada,
          carMarca: marca,
          carModelo: modelo,
          carAno: anoNumerico,
          carCor: cor,
          carKM: kmNumerica,
          carTpCombust: tipoCombustivel || undefined,
          carOpTracao: tracao || undefined,
          carOpTrocaOleo: dataFormatter(trocaOleo),
          carOpTrocaPneu: dataFormatter(trocaPneu),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso!", "Veículo cadastrado com sucesso!");
        handleNavigatePush("/Home", "fadeOutUp");
      } else {
        formRef.current?.shake(800);
        Alert.alert(
          "Falha no Cadastro",
          data.message || "Erro desconhecido ao cadastrar veículo."
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      formRef.current?.shake(800);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHardwareBackPress
    );
    return () => backHandler.remove();
  }, [handleHardwareBackPress]);

  return (
    <View style={styles.container}>
      <AnimatedView style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleGoBack("fadeOutDown")}
          style={styles.backButton}
        >
          <Feather color={Colors.primary} name="chevron-left" size={24} />
          <AppText style={styles.backButtonText}>voltar</AppText>
        </TouchableOpacity>
      </AnimatedView>

      <AnimatedView>
        <AppText style={styles.title}>Cadastro de Veículo</AppText>
      </AnimatedView>

      <ScrollView contentContainerStyle={styles.content}>
        <Animatable.View ref={formRef} style={styles.form}>
          <AnimatedView>
            <Input
              containerStyle={{ width: "90%" }}
              label="Placa"
              onChangeText={setPlaca}
              placeholder="Ex: ABC-1D23"
              type="placa"
              value={placa}
            />
          </AnimatedView>
          <AnimatedView>
            <Input
              containerStyle={{ width: "90%" }}
              label="Marca"
              onChangeText={setMarca}
              placeholder="Ex: Volkswagen"
              value={marca}
            />
          </AnimatedView>
          <AnimatedView>
            <Input
              containerStyle={{ width: "90%" }}
              label="Modelo"
              onChangeText={setModelo}
              placeholder="Ex: Gol"
              value={modelo}
            />
          </AnimatedView>

          <AnimatedView style={[styles.row, { width: "90%" }]}>
            <View style={{ flex: 0.7 }}>
              <Input
                  label="Combustível"
                  placeholder="Selecionar"
                  type="fuel"
                  value={tipoCombustivel}
                  onFuelChange={({ fuel }) => setTipoCombustivel(fuel)}
              />
            </View>
            <View style={{ flex: 0.3 }}>
              <Input
                label="Ano"
                onYearChange={({ year }) => setAno(year)}
                placeholder="AAAA"
                type="year"
                value={ano}
              />
            </View>
          </AnimatedView>

          <AnimatedView style={[styles.row, { width: "90%" }]}>
            <View style={styles.rowItem}>
              <Input
                keyboardType="number-pad"
                label="Quilometragem"
                onChangeText={setQuilometragem}
                placeholder="Ex: 50000"
                value={quilometragem}
              />
            </View>
            <View style={styles.rowItem}>
              <Input
                label="Cor"
                onChangeText={setCor}
                placeholder="Ex: Preto"
                value={cor}
              />
            </View>
          </AnimatedView>

          <AnimatedView>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={
                showOptional ? handleHideOptional : () => setShowOptional(true)
              }
              style={styles.optionalToggle}
            >
              <Feather
                color={Colors.secondary}
                name={showOptional ? "minus" : "plus"}
                size={20}
              />
              <AppText style={styles.optionalText}>Dados opcionais</AppText>
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
                    label="Tração"
                    onChangeText={setTracao}
                    placeholder="Ex: 4x4"
                    value={tracao}
                  />
                </View>
                <View style={styles.rowItem}>
                  <Input
                    label="Revisão"
                    onDateChange={({ date }) => setRevisao(date)}
                    placeholder="DD/MM/AAAA"
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
                    label="Troca de pneu"
                    onDateChange={({ date }) => setTrocaPneu(date)}
                    placeholder="DD/MM/AAAA"
                    type="date"
                    value={trocaPneu}
                  />
                </View>
                <View style={styles.rowItem}>
                  <Input
                    label="Troca de óleo"
                    onDateChange={({ date }) => setTrocaOleo(date)}
                    placeholder="DD/MM/AAAA"
                    type="date"
                    value={trocaOleo}
                  />
                </View>
              </Animatable.View>
            </View>
          )}
        </Animatable.View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          containerStyle={{ width: "60%" }}
          onPress={handleCadastro}
          title="Cadastrar Veículo"
        />
      </View>
    </View>
  );
}

export default function CadastroVeiculo() {
  return (
    <AnimationProvider>
      <CadastroVeiculoContent />
    </AnimationProvider>
  );
}