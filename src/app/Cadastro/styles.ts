import { Colors } from '@/theme/colors';
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
    },
    header: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '5%', // Alinha com os inputs
    },
    backButtonText: {
        color: Colors.primary,
        fontSize: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.secondary, // Laranja do print
        textAlign: 'center'
    },
    form: {
        width: "100%",
        alignItems: "center",
        gap: 12, // Um pouco mais de espaço entre os campos
    },
    // Estilo genérico para linhas com mais de um componente
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
    },
});