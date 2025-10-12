// src/screens/HomeScreen/index.tsx

import { Car, CircleUser } from 'lucide-react-native'; // 1. Importar CircleUser
import { TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 2. Importar hook para a área segura

import { AnimatedView, AnimationProvider, AppText, Button } from '@/components';
import { Colors } from '@/theme/colors';
import { styles } from './styles';

function HomeContent() {
    const insets = useSafeAreaInsets(); // 3. Obter os espaçamentos da área segura

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.headerIcon, { top: insets.top + 10 }]} // Posiciona abaixo da barra de status
                onPress={() => console.log('Abrir perfil do usuário')}
                activeOpacity={0.7}
            >
                <CircleUser size={45} color={Colors.primary} />
            </TouchableOpacity>

            <Animatable.View style={styles.content} animation="fadeIn" duration={400} delay={100}>
                <AnimatedView>
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
                </AnimatedView>
            </Animatable.View>
        </View>
    );
}

export default function HomeScreen() {
    return (
        <AnimationProvider>
            <HomeContent />
        </AnimationProvider>
    );
}