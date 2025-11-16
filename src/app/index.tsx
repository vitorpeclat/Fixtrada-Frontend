import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function AppEntry() {
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const checkToken = async () => {
      console.log("Checking token...");
      const storedToken = await AsyncStorage.getItem("userToken");
      console.log("Stored token:", storedToken);
      setToken(storedToken);
    };

    checkToken();
  }, []);

  console.log("Rendering AppEntry, token:", token);

  if (token === undefined) {
    console.log("Token is undefined, showing loading view");
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (token) {
    console.log("Token exists, redirecting to /Home");
    return <Redirect href="/Home" />;
  }
  console.log("No token, redirecting to /Login");
  return <Redirect href="/Login" />;
}