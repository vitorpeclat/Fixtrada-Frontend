import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function AppEntry() {
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setToken(storedToken);
    };

    checkToken();
  }, []);

  if (token === undefined) {
    return <View />;
  }

  if (token) {
    return <Redirect href="/Home" />;
  }
  return <Redirect href="/Home" />;
}
