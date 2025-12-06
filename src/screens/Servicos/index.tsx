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
      const token = user?.token || await AsyncStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/services/${id}/aceitar-proposta`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const responseText = await response.text();

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
      
      // Buscar a proposta aceita para obter os dados necessários
      const propostaAceita = propostas.find(p => p.id === id);
      
      if (propostaAceita && propostaAceita.prestador && user?.sub) {
        // Criar chat entre cliente e prestador
        try {
          const chatResponse = await fetch(`${API_BASE_URL}/chats/servico`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              clienteId: user.sub,
              prestadorCnpj: propostaAceita.prestador.mecCNPJ,
              registroServicoId: id
            })
          });

          if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            console.log('Chat criado:', chatData);
          } else {
            console.error('Erro ao criar chat, mas proposta foi aceita');
          }
        } catch (chatError) {
          console.error('Erro ao criar chat:', chatError);
          // Não bloqueia o fluxo se falhar a criação do chat
        }
      }
      
      fetchPropostas();
      alert('Proposta aceita com sucesso!');
    } catch (err: any) {
      console.error('Erro ao aceitar proposta:', err);
      alert(err.message || 'Falha ao aceitar proposta');
    }
  };

  const recusarProposta = async (id: string) => {
    try {
      const token = user?.token || await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/services/${id}/recusar-proposta`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseText = await response.text();

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
      
      fetchPropostas();
      alert('Proposta recusada com sucesso!');
    } catch (err: any) {
      console.error('Erro ao recusar proposta:', err);
      alert(err.message || 'Falha ao recusar proposta');
    }
  };

  const handleDetailsPress = (item: Proposta) => {
    router.push({
      pathname: "/DetalhesServico",
      params: { serviceId: item.id },
    });
  };

  useEffect(() => {
    fetchPropostas();
  }, [fetchPropostas]);

  const propostasRecebidas = propostas.filter(p => p.status === 'proposta');
  const servicosAndamento = propostas.filter(p => p.status === 'em_andamento');

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
              {propostasRecebidas.length > 0 && (
                <>
                  <AppText style={styles.sectionTitle}>Propostas Recebidas</AppText>
                  {propostasRecebidas.map((proposta) => (
                    <TouchableOpacity 
                      key={proposta.id} 
                      style={styles.propostaCard}
                      onPress={() => handleDetailsPress(proposta)}
                      activeOpacity={0.7}
                    >
                      {/* Header com código e status */}
                      <View style={[styles.cardHeader, { borderLeftColor: Colors.secondary }]}>
                        <View style={styles.codeAndStatus}>
                          <AppText style={styles.cardCode}>#{proposta.codigo}</AppText>
                          <AppText style={[styles.cardStatusPill, { backgroundColor: Colors.secondary }]}>
                            Proposta
                          </AppText>
                          <AppText style={styles.cardValue}>
                            R$ {proposta.valor.toFixed(2)}
                          </AppText>
                        </View>
                      </View>

                      {/* Body */}
                      <View style={styles.cardBody}>
                        {/* Prestador */}
                        <View style={styles.prestadorSection}>
                          <AppText style={styles.prestadorName} numberOfLines={1}>
                            {proposta.prestador?.mecLogin || "-"}
                          </AppText>
                        </View>

                        {/* Info Grid */}
                        <View style={styles.infoGrid}>
                          <View style={styles.infoRow}>
                            <View style={styles.infoPair}>
                              <AppText style={styles.infoLabel}>Problema</AppText>
                              <AppText style={styles.infoValue} numberOfLines={1}>
                                {proposta.tipoServico?.tseTipoProblema || "-"}
                              </AppText>
                            </View>
                            <View style={styles.infoPair}>
                              <AppText style={styles.infoLabel}>Veículo</AppText>
                              <AppText style={styles.infoValue} numberOfLines={1}>
                                {proposta.carro?.carMarca || "-"} {proposta.carro?.carModelo || "-"}
                              </AppText>
                            </View>
                          </View>
                          {proposta.data && (
                            <View style={styles.infoRow}>
                              <View style={styles.infoPair}>
                                <AppText style={styles.infoLabel}>Data</AppText>
                                <AppText style={styles.infoValue}>{proposta.data}</AppText>
                              </View>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* Footer - Ações */}
                      <View style={styles.cardActionsFooter}>
                        <TouchableOpacity 
                          style={styles.actionButtonSmall}
                          onPress={() => handleDetailsPress(proposta)}
                        >
                          <AppText style={styles.actionButtonSmallText}>Detalhes</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.actionButtonSmall, { backgroundColor: Colors.error }]}
                          onPress={() => recusarProposta(proposta.id)}
                        >
                          <AppText style={styles.actionButtonSmallText}>Recusar</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.actionButtonSmall, { backgroundColor: Colors.secondary }]}
                          onPress={() => aceitarProposta(proposta.id)}
                        >
                          <AppText style={styles.actionButtonSmallText}>Aceitar</AppText>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {servicosAndamento.length > 0 && (
                <>
                  <AppText style={[styles.sectionTitle, { marginTop: 24 }]}>Serviços em Andamento</AppText>
                  {servicosAndamento.map((servico) => (
                    <TouchableOpacity 
                      key={servico.id} 
                      style={styles.propostaCard}
                      onPress={() => handleDetailsPress(servico)}
                      activeOpacity={0.7}
                    >
                      {/* Header com código e status */}
                      <View style={[styles.cardHeader, { borderLeftColor: Colors.primary }]}>
                        <View style={styles.codeAndStatus}>
                          <AppText style={styles.cardCode}>#{servico.codigo}</AppText>
                          <AppText style={[styles.cardStatusPill, { backgroundColor: Colors.primary }]}>
                            Em andamento
                          </AppText>
                        </View>
                      </View>

                      {/* Body */}
                      <View style={styles.cardBody}>
                        {/* Prestador */}
                        <View style={styles.prestadorSection}>
                          <AppText style={styles.prestadorName} numberOfLines={1}>
                            {servico.prestador?.mecLogin || "-"}
                          </AppText>
                        </View>

                        {/* Info Grid */}
                        <View style={styles.infoGrid}>
                          <View style={styles.infoRow}>
                            <View style={styles.infoPair}>
                              <AppText style={styles.infoLabel}>Problema</AppText>
                              <AppText style={styles.infoValue} numberOfLines={1}>
                                {servico.tipoServico?.tseTipoProblema || "-"}
                              </AppText>
                            </View>
                            <View style={styles.infoPair}>
                              <AppText style={styles.infoLabel}>Veículo</AppText>
                              <AppText style={styles.infoValue} numberOfLines={1}>
                                {servico.carro?.carMarca || "-"} {servico.carro?.carModelo || "-"}
                              </AppText>
                            </View>
                          </View>
                          {servico.data && (
                            <View style={styles.infoRow}>
                              <View style={styles.infoPair}>
                                <AppText style={styles.infoLabel}>Data</AppText>
                                <AppText style={styles.infoValue}>{servico.data}</AppText>
                              </View>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* Footer */}
                      <View style={styles.cardActionsFooter}>
                        <TouchableOpacity 
                          style={styles.actionButtonSmall}
                          onPress={() => handleDetailsPress(servico)}
                        >
                          <AppText style={styles.actionButtonSmallText}>Detalhes</AppText>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </>
          ) : loadingPropostas ? (
            <AppText style={styles.messageText}>Carregando serviços...</AppText>
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
