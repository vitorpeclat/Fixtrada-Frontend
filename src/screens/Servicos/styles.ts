import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerIcon: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
  },
  tabContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    marginBottom: 16,
    marginTop: 40,
    alignSelf: 'center',
  },
  messageText: {
    fontSize: 18,
    color: Colors.darkGray,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    marginHorizontal: 16,
    maxWidth: '90%',
  },
  button: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 20,
  },
  // Estilos para os cards de propostas
  propostaCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  propostaHeader: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  propostaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  propostaBody: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  propostaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  propostaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGray,
    minWidth: 80,
  },
  propostaValue: {
    fontSize: 14,
    color: Colors.gray,
    flex: 1,
  },
  propostaValueHighlight: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary,
  },
  propostaActions: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  propostaButtonAccept: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  propostaButtonReject: {
    flex: 1,
    backgroundColor: Colors.error,
  },
});
