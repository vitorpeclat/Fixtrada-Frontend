import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    // Container principal
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20, // Adiciona um espaçamento geral
    },
    // Cabeçalho com a saudação
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greetingContainer: {
        flex: 1,
    },
    greetingText: {
        fontSize: 22,
        color: Colors.gray,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    // Cartão principal de CTA (Call to Action)
    mainCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 30,
        // Sombra para dar elevação (iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        // Sombra (Android)
        elevation: 5,
    },
    cardIcon: {
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 14,
        color: Colors.gray,
        textAlign: 'center',
        marginBottom: 16,
    },
    // Seção de Acesso Rápido
    quickActionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
    },
    quickActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionButton: {
        flex: 1, // Faz os botões dividirem o espaço igualmente
        backgroundColor: Colors.lightGray,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    actionButtonText: {
        fontWeight: '500',
        color: Colors.text,
    }
});