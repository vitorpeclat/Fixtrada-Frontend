import { useState } from "react";
import { Image, View } from "react-native";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { KeyboardShiftView } from "@/components/KeyboardShiftView";
import { FilterStatus } from "@/types/FilterStatus";

import { styles } from "./styles";

export default function Login() {
    const [passwordStatus, setPasswordStatus] = useState(FilterStatus.HIDE);

    function handleTogglePasswordVisibility() {
        setPasswordStatus(prevState => 
            prevState === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE
        );
    }

    return (
        <View style={styles.container}>
            <KeyboardShiftView style={styles.content}>
                <Image source={require("@/assets/logo-fixtrada.png")} style={styles.logo} resizeMode="contain" />

                <View style={styles.form}>
                  <Input
                    label="Email"
                    placeholder="exemplo@domínio.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    containerStyle={{ width: '90%' }}
                  />
                  <Input
                    label="Senha"
                    placeholder="Digite sua senha"
                    status={passwordStatus}
                    onEyeIconPress={handleTogglePasswordVisibility}
                    secureTextEntry={passwordStatus === FilterStatus.HIDE}
                    containerStyle={{ width: '90%' }}
                  />
                 <Button 
                    title="Logar-se"
                    containerStyle={{ width: '50%' }} 
                    //onPress={() => Alert.alert("Falha no Login", "email e/ou senha inválidos")}
                  />
                </View>
            </KeyboardShiftView>
        </View>
    );
}