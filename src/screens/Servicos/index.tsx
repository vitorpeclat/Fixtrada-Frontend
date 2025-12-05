import { AppText, Button } from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { useAuth } from "@/contexts/AuthContext";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Car, Menu } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

type Prestador = {
  mecCNPJ: string;
  mecLogin: string | null;
  mecNota: number | null;
  mecEnderecoNum: string | null;
  mecAtivo: boolean;
  mecFoto: string | null;
  latitude: number | null;
  longitude: number | null;
  fk_endereco_endCEP: string | null;
};

type Proposta = {
  id: string;
  codigo: string;
  status: string;
  descricao: string;
  data: string;
  hora: string;
  valor: number;
  notaCliente: number | null;
  comentarioCliente: string | null;
  carro: any;
  tipoServico: any;
  prestador: Prestador | null;
};

function ServicosContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useAuth();
  
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loadingPropostas, setLoadingPropostas] = useState(false);
  const [errorPropostas, setErrorPropostas] = useState<string | null>(null);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const fetchPropostas = useCallback(async () => {
    setLoadingPropostas(true);
    setErrorPropostas(null);
    try {
      const url = `${API_BASE_URL}/services/proposta/list`;
      console.log('Buscando propostas de:', url);
      const token = user?.token || await AsyncStorage.getItem('userToken');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const propostas = Array.isArray(data) ? data : [];
      console.log('Propostas recebidas:', propostas.length);
      setPropostas(propostas);
    } catch (err: any) {
      console.error('Erro ao carregar propostas:', err);
      setErrorPropostas("Falha ao carregar propostas");
    } finally {
      setLoadingPropostas(false);
    }
  }, [user]);

  const aceitarProposta = async (id: string) => {
    try {
      console.log('Aceitando proposta ID:', id);
      const token = user?.token || await AsyncStorage.getItem('userToken');
      console.log('URL:', `${API_BASE_URL}/services/${id}/aceitar-proposta`);
      
      const response = await fetch(`${API_BASE_URL}/services/${id}/aceitar-proposta`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (!response.ok) {
        let errorMessage = 'Erro ao aceitar proposta';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
        console.error('Erro do servidor:', errorMessage, 'Status:', response.status);
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }

      const data = JSON.parse(responseText);
      console.log('Proposta aceita:', data);
      
      fetchPropostas();
      alert('Proposta aceita com sucesso!');
    } catch (err: any) {
      console.error('Erro ao aceitar proposta:', err);
      alert(err.message || 'Falha ao aceitar proposta');
    }
  };

  const recusarProposta = async (id: string) => {
    try {
      console.log('Recusando proposta ID:', id);
      const token = user?.token || await AsyncStorage.getItem('userToken');
      console.log('URL:', `${API_BASE_URL}/services/${id}/recusar-proposta`);
      
      const response = await fetch(`${API_BASE_URL}/services/${id}/recusar-proposta`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (!response.ok) {
        let errorMessage = 'Erro ao recusar proposta';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
        console.error('Erro do servidor:', errorMessage, 'Status:', response.status);
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }

      const data = JSON.parse(responseText);
      console.log('Proposta recusada:', data);
      
      fetchPropostas();
      alert('Proposta recusada com sucesso!');
    } catch (err: any) {
      console.error('Erro ao recusar proposta:', err);
      alert(err.message || 'Falha ao recusar proposta');
    }
  };

  useEffect(() => {
    fetchPropostas();
  }, [fetchPropostas]);

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
        <ScrollView contentContainerStyle={[styles.tabContentContainer, { paddingBottom: 32 }]}>
          {propostas.length > 0 ? (
            <>
              <AppText style={styles.messageText}>Propostas Recebidas</AppText>
              {propostas.map((proposta) => (
                <View key={proposta.id} style={styles.propostaCard}>
                  <View style={styles.propostaHeader}>
                    <AppText style={styles.propostaTitle}>
                      Código: {proposta.codigo}
                    </AppText>
                  </View>
                  
                  <View style={styles.propostaBody}>
                    {proposta.prestador && (
                      <View style={styles.propostaRow}>
                        <AppText style={styles.propostaLabel}>Prestador:</AppText>
                        <AppText style={styles.propostaValue}>
                          {proposta.prestador.mecLogin || "Não identificado"}
                        </AppText>
                      </View>
                    )}
                    
                    <View style={styles.propostaRow}>
                      <AppText style={styles.propostaLabel}>Valor:</AppText>
                      <AppText style={styles.propostaValueHighlight}>
                        R$ {proposta.valor.toFixed(2)}
                      </AppText>
                    </View>

                    {proposta.descricao && (
                      <View style={styles.propostaRow}>
                        <AppText style={styles.propostaLabel}>Descrição:</AppText>
                        <AppText style={styles.propostaValue}>
                          {proposta.descricao}
                        </AppText>
                      </View>
                    )}
                  </View>

                  <View style={styles.propostaActions}>
                    <Button
                      title="Recusar"
                      onPress={() => recusarProposta(proposta.id)}
                      containerStyle={styles.propostaButtonReject}
                    />
                    <Button
                      title="Aceitar"
                      onPress={() => aceitarProposta(proposta.id)}
                      containerStyle={styles.propostaButtonAccept}
                    />
                  </View>
                </View>
              ))}
            </>
          ) : loadingPropostas ? (
            <AppText style={styles.messageText}>Carregando propostas...</AppText>
          ) : errorPropostas ? (
            <AppText style={[styles.messageText, { color: Colors.error }]}>
              {errorPropostas}
            </AppText>
          ) : (
            <>
              <Car
                size={150}
                color={Colors.secondary}
                strokeWidth={1.5}
                style={styles.carImage}
              />
              <AppText style={styles.messageText}>
                {strings.services.noServiceRequested}
              </AppText>
              <Button
                title={strings.services.requestServiceButton}
                onPress={() => router.push("/SolicitarServico")}
                containerStyle={styles.button}
              />
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

export default function ServicosScreen() {
  return <ServicosContent />;
}
