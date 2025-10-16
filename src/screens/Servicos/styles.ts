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
    fontSize: 16,
    fontWeight: '500',
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
});