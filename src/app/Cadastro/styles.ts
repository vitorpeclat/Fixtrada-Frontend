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
        marginLeft: '5%', 
    },
    backButtonText: {
        color: Colors.primary,
        fontSize: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.secondary,
        textAlign: 'center'
    },
    form: {
        width: "100%",
        alignItems: "center",
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 2,
    },
    criteriaContainer: {
        width: '90%',
        paddingHorizontal: 5,
        marginTop: 8,
        gap: 4,
    },
    criterionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    criterionIcon: {
        marginRight: 8,
    },
    criterionText: {
        fontSize: 13,
    },
});