import { AppText, Button } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { Colors } from "@/theme/colors";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MapPin, MessageCircle, Star } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../ChatList/api";
import { styles } from "./styles";

type DetalhesMecanicaParams = {
  cnpj: string;
};

type Mecanica = {
  mecCNPJ: string;
  mecLogin: string | null;
  mecNota: number | null;
  mecEnderecoNum: string | null;
  mecAtivo: boolean;
  mecFoto: string | null;
  mecTelefone: string | null;
  mecEmail: string | null;
  latitude: number | null;
  longitude: number | null;
  fk_endereco_endCEP: string | null;
  endereco?: {
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
  };
};

export default function DetalhesMecanicaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { cnpj } = useLocalSearchParams<DetalhesMecanicaParams>();
  const cleanCnpj = (cnpj ? String(cnpj) : "").replace(/\D/g, "");

  const [mecanica, setMecanica] = useState<Mecanica | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingChat, setCreatingChat] = useState(false);

  useEffect(() => {
    fetchDetalhesMecanica();
  }, [cnpj]);

  const fetchDetalhesMecanica = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1) Tenta endpoint direto por CNPJ
      let data: any | null = null;
      try {
        // Usa instancia 'api' com token para evitar 401
        const response = await api.get(`/prestadores/${encodeURIComponent(cleanCnpj || String(cnpj))}`);
        data = response.data;
      } catch (err: any) {
        const status = err?.response?.status;
        console.warn('Falha ao buscar prestador específico.', status, err?.response?.data);
        // 404 ou outro erro: tenta fallback pela lista
        try {
          const list = await api.get(`/prestadores?ativo=true&limit=200&offset=0`);
          const arr = Array.isArray(list.data) ? list.data : [];
          data = arr.find((p: any) => {
            const pCnpj = String(p.mecCNPJ || '').replace(/\D/g, '');
            return pCnpj === cleanCnpj || String(p.mecCNPJ) === String(cnpj);
          }) || null;
        } catch (listErr: any) {
          console.warn('Fallback via lista também falhou:', listErr?.response?.status, listErr?.response?.data);
        }
      }

      if (!data) {
        throw new Error('Mecânica não encontrada');
      }

      // Se tiver CEP, busca endereço completo
      let enderecoCompleto = undefined;
      if (data.fk_endereco_endCEP) {
        try {
          const cleanCEP = data.fk_endereco_endCEP.replace(/\D/g, '');
          const viaCepRes = await axios.get(`https://viacep.com.br/ws/${cleanCEP}/json/`); // ViaCEP não requer auth
          if (!viaCepRes.data.erro) {
            enderecoCompleto = {
              logradouro: viaCepRes.data.logradouro,
              bairro: viaCepRes.data.bairro,
              localidade: viaCepRes.data.localidade,
              uf: viaCepRes.data.uf,
            };
          }
        } catch (err) {
          console.log('Erro ao buscar CEP:', err);
        }
      }

      setMecanica({
        ...data,
        endereco: enderecoCompleto,
      });
    } catch (err: any) {
      console.error('Erro ao carregar detalhes da mecânica:', err);
      setError('Não foi possível carregar os detalhes da mecânica');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = async () => {
    if (!mecanica || !user) return;

    try {
      setCreatingChat(true);
      // 1) Tenta criar (ou obter existente) via POST /chats
      const clienteId = (user?.id || user?.usuID || user?.userId || user?.sub) as string | undefined;
      const prestadorCnpj = String(mecanica.mecCNPJ || '').replace(/\D/g, '');

      if (!clienteId) {
        throw new Error('Não foi possível identificar o usuário logado (clienteId ausente).');
      }
      if (!prestadorCnpj || prestadorCnpj.length !== 14) {
        throw new Error('CNPJ do prestador inválido para iniciar o chat.');
      }

      try {
        const resp = await api.post('/chats', { clienteId, prestadorCnpj });
        const chatId = resp?.data?.chatID || resp?.data?.chatId || resp?.data?.id;
        if (chatId) {
          router.push({ pathname: "/Chat", params: { chatId } });
          return;
        }
        // Se não veio chatId por algum motivo, cair no fallback
        console.warn('POST /chats não retornou chatId. Caindo no fallback.');
      } catch (postErr: any) {
        console.warn('Falha no POST /chats, tentando fallback GET lista.', postErr?.response?.status, postErr?.response?.data);
      }

      // 2) Fallback: buscar chats e abrir pelo nome
      try {
        const chatsResponse = await api.get('/cliente/meus-chats');
        const list = Array.isArray(chatsResponse.data) ? chatsResponse.data : [];
        const targetName = (mecanica.mecLogin || '').trim().toLowerCase();
        const existingChat = list.find((chat: any) =>
          String(chat.shopName || '').trim().toLowerCase() === targetName
        );
        if (existingChat?.id) {
          router.push({ pathname: "/Chat", params: { chatId: existingChat.id } });
          return;
        }
      } catch (listErr) {
        console.warn('Fallback GET /cliente/meus-chats falhou:', listErr);
      }

      // 3) Sem sucesso: levar à lista
      Alert.alert('Chat', 'Não foi possível abrir ou criar o chat. Abrindo sua lista de chats.');
      router.push({ pathname: "/ChatList" });
    } catch (err: any) {
      console.error('Erro ao abrir chat:', err);
      Alert.alert('Erro', 'Não foi possível abrir o chat com a mecânica');
    } finally {
      setCreatingChat(false);
    }
  };

  const formatCEP = (cep: string | null) => {
    if (!cep) return '';
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length === 8) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    return cep;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <AppText style={styles.loadingText}>Carregando detalhes...</AppText>
      </View>
    );
  }

  if (error || !mecanica) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <AppText style={styles.errorText}>{error || 'Mecânica não encontrada'}</AppText>
        <Button
          title="Voltar"
          onPress={() => router.back()}
          containerStyle={styles.backButton}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color={Colors.primary} />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Detalhes da Mecânica</AppText>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Foto e Nome */}
        <View style={styles.profileSection}>
          {mecanica.mecFoto ? (
            <Image source={{ uri: mecanica.mecFoto }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <AppText style={styles.profileImagePlaceholderText}>
                {mecanica.mecLogin?.charAt(0).toUpperCase() || 'M'}
              </AppText>
            </View>
          )}
          <AppText style={styles.profileName}>{mecanica.mecLogin || 'Mecânica'}</AppText>
          
          {/* Avaliação */}
          {mecanica.mecNota !== null && (
            <View style={styles.ratingContainer}>
              <Star size={20} color={Colors.warning} fill={Colors.warning} />
              <AppText style={styles.ratingText}>{mecanica.mecNota.toFixed(1)}</AppText>
            </View>
          )}
        </View>

        {/* Contato removido conforme solicitado */}

        {/* Endereço */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Endereço</AppText>
          
          <View style={styles.infoRow}>
            <MapPin size={20} color={Colors.secondary} />
            <View style={styles.addressTextContainer}>
              {mecanica.endereco ? (
                <>
                  <AppText style={styles.infoText}>
                    {mecanica.endereco.logradouro}
                    {mecanica.mecEnderecoNum ? `, ${mecanica.mecEnderecoNum}` : ''}
                  </AppText>
                  <AppText style={styles.infoText}>
                    {mecanica.endereco.bairro} - {mecanica.endereco.localidade}/{mecanica.endereco.uf}
                  </AppText>
                  <AppText style={styles.infoText}>
                    CEP: {formatCEP(mecanica.fk_endereco_endCEP)}
                  </AppText>
                </>
              ) : (
                <AppText style={styles.infoText}>
                  CEP: {formatCEP(mecanica.fk_endereco_endCEP)}
                  {mecanica.mecEnderecoNum ? `, Nº ${mecanica.mecEnderecoNum}` : ''}
                </AppText>
              )}
            </View>
          </View>
        </View>

        {/* CNPJ */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Informações</AppText>
          <AppText style={styles.infoText}>CNPJ: {mecanica.mecCNPJ}</AppText>
        </View>
      </ScrollView>

      {/* Botão de Chat Fixo */}
      <View style={[styles.chatButtonContainer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          title={creatingChat ? "Abrindo chat..." : "Conversar com a Mecânica"}
          onPress={handleOpenChat}
          disabled={creatingChat}
          containerStyle={styles.chatButton}
          icon={<MessageCircle size={20} color={Colors.white} style={{ marginRight: 8 }} />}
        />
      </View>
    </View>
  );
}
