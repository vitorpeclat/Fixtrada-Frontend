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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 32,
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
    marginHorizontal: 0,
  },
  button: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 20,
  },
  // Estilos para as seções
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginHorizontal: 0,
    marginVertical: 12,
  },
  // Estilos para os cards de propostas
  propostaCard: {
    marginVertical: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'column',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  infoContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  propostaHeader: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  propostaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  propostaBody: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  propostaRow: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 2,
  },
  propostaLabel: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: 'left',
  },
  propostaValue: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'left',
  },
  propostaValueHighlight: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary,
  },
  propostaActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  detailsButton: {
    backgroundColor: Colors.primary,
    height: 40,
    borderRadius: 8,
    flex: 1,
  },
  detailsButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  propostaButtonAccept: {
    flex: 1,
    backgroundColor: Colors.secondary,
    height: 40,
  },
  propostaButtonReject: {
    flex: 1,
    backgroundColor: Colors.error,
    height: 40,
  },
  servicoEmAndamentoCard: {
    opacity: 0.95,
  },
  servicoEmAndamentoHeader: {
    backgroundColor: Colors.warning,
  },
  servicoEmAndamentoActions: {
    width: '100%',
  },
});
