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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginHorizontal: 0,
    marginVertical: 16,
    marginTop: 4,
  },
  // --- Novo design moderno do card ---
  propostaCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.lightGray,
    borderLeftWidth: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeAndStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cardCode: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.secondary,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
    marginLeft: 'auto',
  },
  cardStatusPill: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  prestadorSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  prestadorName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  infoGrid: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoPair: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  cardActionsFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonSmall: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  actionButtonSmallText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
  },
  // --- Fallback styles ---
  logoPlaceholder: {
    display: 'none',
  },
  infoContainer: {
    display: 'none',
  },
  cardRow: {
    display: 'none',
  },
  cardMetaSeparator: {
    display: 'none',
  },
  propostaRow: {
    display: 'none',
  },
  propostaTitle: {
    display: 'none',
  },
  cardStatusBadge: {
    display: 'none',
  },
  propostaActions: {
    display: 'none',
  },
  detailsButton: {
    display: 'none',
  },
  detailsButtonText: {
    display: 'none',
  },
  propostaButtonAccept: {
    display: 'none',
  },
  propostaButtonReject: {
    display: 'none',
  },
  servicoEmAndamentoCard: {
    display: 'none',
  },
});
