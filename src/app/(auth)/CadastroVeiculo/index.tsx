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
  const [versao, setVersao] = useState("");
  const [showOptional, setShowOptional] = useState(false);
  const [usuarioID, setUsuarioID] = useState<string | null>(null);
  const formRef = useRef<
    Animatable.View & { shake: (duration: number) => void }
  >(null);
  const { handleGoBack, handleHardwareBackPress } = useScreenAnimation();
  const { handleNavigatePush } = useScreenAnimation();
  const optionalRef1 = useRef<AnimatableViewRef>(null);
  const optionalRef2 = useRef<AnimatableViewRef>(null);
  const optionalRef3 = useRef<AnimatableViewRef>(null);

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
    const [dia, mes, ano] = dado.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  const handleCadastro = async () => {
    // Limpar e validar os campos obrigatórios (apenas os definidos no vehicleSchema)
    const kmLimpo = quilometragem.replace(/\D/g, "");
    const anoNumerico = Number.parseInt(ano, 10);
    const kmNumerica = Number.parseInt(kmLimpo, 10);
    const anoAtual = new Date().getFullYear();

    if (
      !(marca && modelo) ||
      ano.length !== 4 ||
      anoNumerico > anoAtual + 1 ||
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
      const response = await fetch("http://192.168.15.16:3333/vehicle", {
        // Usando /vehicles (plural)
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          carPlaca: placaFormatada,
          carMarca: marca,
          carModelo: modelo,
          carAno: anoNumerico, // Enviado como number
          carCor: cor,
          carKM: kmNumerica, // Enviado como number
          carTpCombust: tipoCombustivel || undefined,
          carOpTracao: tracao || undefined,
          carOpTrocaOleo: dataFormatter(trocaOleo) || undefined,
          carOpTrocaPneu: dataFormatter(trocaPneu) || undefined,
          // Outros campos opcionais podem ser adicionados aqui se o schema do back-end for atualizado
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

  // --- NOVA FUNÇÃO DE VALIDAÇÃO PARA O ANO ---
  const handleAnoChange = (text: string) => {
    // Garante que apenas números sejam inseridos
    const numericText = text.replace(/[^0-9]/g, "");
    const currentYear = new Date().getFullYear();

    // Valida se o ano inserido é maior que o ano atual
    if (numericText.length === 4) {
      const inputYear = Number.parseInt(numericText, 10);
      if (inputYear > currentYear) {
        // Se for maior, define o ano para o ano atual
        setAno(String(currentYear));
        return;
      }
    }
    // Atualiza o estado com o texto numérico
    setAno(numericText);
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
              placeholder="Ex: ABC-1234"
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
            <View style={styles.rowItem}>
              <Input
                keyboardType="number-pad"
                label="Ano"
                maxLength={4}
                onChangeText={handleAnoChange}
                placeholder="AAAA"
                value={ano}
              />
            </View>
            <View style={styles.rowItem}>
              <Input
                keyboardType="number-pad"
                label="Quilometragem"
                onChangeText={setQuilometragem}
                placeholder="Ex: 50000"
                value={quilometragem}
              />
            </View>
          </AnimatedView>

          <AnimatedView>
            <Input
              containerStyle={{ width: "90%" }}
              label="Tipo de Combustível"
              onChangeText={setTipoCombustivel}
              placeholder="Ex: Gasolina, Flex"
              value={tipoCombustivel}
            />
          </AnimatedView>
          <AnimatedView>
            <Input
              containerStyle={{ width: "90%" }}
              label="Cor"
              onChangeText={setCor}
              placeholder="Ex: Preto"
              value={cor}
            />
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
                    placeholder="dd/mm/aaaa"
                    type="date"
                    value={trocaPneu}
                  />
                </View>
              </Animatable.View>
              <Animatable.View
                animation="fadeInDown"
                duration={400}
                ref={optionalRef3}
                style={[styles.row, { width: "90%" }]}
              >
                <View style={styles.rowItem}>
                  <Input
                    label="Troca de óleo"
                    onDateChange={({ date }) => setTrocaOleo(date)}
                    placeholder="dd/mm/aaaa"
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
