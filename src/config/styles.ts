import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Idealmente um cinza claro ou branco
  },
  headerIcon: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  // Estilos do Card
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    // Sombra para dar o efeito de "card" suspenso
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  cardLogoContainer: {
    marginRight: 12,
  },
  cardLogo: {
    width: 70,
    height: 70,
    borderRadius: 35, // Circular
    backgroundColor: Colors.lightGray,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366', // Azul escuro semelhante à imagem
    marginBottom: 4,
  },
  cardSubtitle: {
    fontWeight: 'normal',
    color: '#003366',
  },
  cardValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003366',
    marginRight: 4,
  },
  starsRow: {
    flexDirection: 'row',
  },
  // Botões
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#0066FF', // Azul vibrante
  },
  rejectButton: {
    backgroundColor: '#FF4D4D', // Vermelho/Coral vibrante
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
});