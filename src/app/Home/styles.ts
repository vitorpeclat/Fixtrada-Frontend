// src/screens/HomeScreen/styles.ts

import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    // NOVO: Estilo para o ícone no cabeçalho
    headerIcon: {
        position: 'absolute',
        left: 20,
        zIndex: 10, // Garante que o ícone fique sobre outros elementos
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: '100%',
    },
    cardIcon: {
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.darkGray,
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: Colors.gray,
        marginBottom: 24,
        lineHeight: 24,
    },
});