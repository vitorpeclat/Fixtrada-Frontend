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
    headerIcon: {
        position: 'absolute',
        left: 20,
        zIndex: 10,
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
    vehicleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    vehicleIconContainer: {
        marginRight: 16,
    },
    vehicleInfoContainer: {
        flex: 1,
    },
    vehicleDataRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    vehicleDataLabel: {
        fontWeight: 'bold',
        color: Colors.darkGray,
        marginRight: 8,
    },
    vehicleDataValue: {
        color: Colors.darkGray,
    },
});
