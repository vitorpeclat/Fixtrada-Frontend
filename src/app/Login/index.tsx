import { Image, View } from "react-native";

import { Input } from "@/components/Input";
import { KeyboardShiftView } from "@/components/KeyboardShiftView";

import { styles } from "./styles";

export default function Login() {
  return (
    <View style={styles.container}>
      <KeyboardShiftView style={styles.content}>
        <Image source={require("@/assets/logo-fixtrada.png")} style={styles.logo} resizeMode="contain"/>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="exemplo@domínio.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Senha"
            placeholder="Digite sua senha"
            secureTextEntry
          />
        </View>
      </KeyboardShiftView>
    </View>
  );
}