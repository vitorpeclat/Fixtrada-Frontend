// src/screens/HomeScreen/styles.ts

import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    // Container principal da página
    pageContainer: {
        flex: 1, // Garante que o container ocupe toda a tela
        backgroundColor: Colors.lightGray, // Cor de fundo da página
    },
    // Estilo para o ScrollView
    scrollContainer: {
        paddingHorizontal: 20, // Espaçamento nas laterais do conteúdo
    },
    // Estilo para o cartão de ação
    card: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 24,
        alignItems: 'center', // Centraliza os itens horizontalmente
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    // Ícone dentro do cartão
    cardIcon: {
        marginBottom: 16,
    },
    // Título principal do cartão
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.darkGray,
        marginBottom: 8,
    },
    // Subtítulo descritivo do cartão
    cardSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: Colors.gray,
        marginBottom: 24,
        lineHeight: 24, // Melhora a legibilidade do texto
    },
});