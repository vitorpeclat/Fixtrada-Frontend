import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    padding: 5,
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  sectionContent: {
    flex: 1,
  },
  arrowIcon: {
    width: 15,
    height: 15,
  },
  verifiedIcon: {
    width: 15,
    height: 15,
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.black,
  },
  sectionValue: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  sectionValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
