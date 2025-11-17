// app/Servicos/styles.ts

import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Estilos reutilizados da Home para consistência
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerIcon: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  // Novos estilos para a tela de Serviços
  contentContainer: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    marginHorizontal: 20,
  },
  tab: {
    paddingVertical: 16,
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.gray,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  activeTabIndicator: {
    height: 3,
    width: '100%',
    backgroundColor: Colors.primary,
    position: 'absolute',
    bottom: -1,
  },
  bodyContainer: {
    flex: 1,
    flexDirection: "row",
  },
  tabContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    gap: 24,
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    minHeight: 300,
    borderRadius: 12,
    overflow: 'hidden',
  },
  carImage: {
    marginBottom: 16,
  },
  messageText: {
    fontSize: 18,
    color: Colors.darkGray,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    width: '80%',
    alignSelf: 'center',
  },
  // Bottom sheet
  sheetHeader: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
    gap: 2,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.darkGray,
  },
  sheetSubtitle: {
    fontSize: 16,
    color: Colors.gray,
  },
  sheetList: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardAvatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAvatar: {
    width: 48,
    height: 48,
  },
  cardAvatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.darkGray,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  cardMeta: {
    fontSize: 15,
    color: Colors.gray,
  },
  cardAddress: {
    fontSize: 15,
    color: Colors.gray,
    marginTop: 2,
  },
  // Radius filter
  radiusFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  radiusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
  },
  radiusPillActive: {
    backgroundColor: Colors.primary,
  },
  radiusPillText: {
    fontSize: 16,
    color: Colors.darkGray,
    fontWeight: '700',
  },
  radiusPillTextActive: {
    color: Colors.white,
  },
});