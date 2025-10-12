// src/screens/HomeScreen/index.tsx

import { Car } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button } from '@/components';
import { Colors } from '@/theme/colors';
import { styles } from './styles';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    return (
        // Container principal que ocupa toda a tela
        <View style={styles.pageContainer}>
            {/* ScrollView para o conteúdo da página */}
            <ScrollView
                style={[styles.scrollContainer, { paddingTop: insets.top + 20 }]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {/* Cartão de Ação Principal */}
                <View style={styles.card}>
                    <Car size={48} color={Colors.primary} style={styles.cardIcon} />
                    <AppText style={styles.cardTitle}>
                        Seu veículo precisa de atenção?
                    </AppText>
                    <AppText style={styles.cardSubtitle}>
                        Agende um serviço de forma rápida e encontre os melhores profissionais perto de você.
                    </AppText>
                    <Button
                        title="Agendar um Serviço"
                        onPress={() => console.log('Iniciar fluxo de agendamento')}
                        containerStyle={{ width: '100%' }}
                    />
                </View>

                {/* Adicione mais conteúdo aqui se necessário */}

            </ScrollView>
        </View>
    );
}