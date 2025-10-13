import { Colors } from '@/theme/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function AppEntry() {
  const [userToken, setUserToken] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token)
      } catch (e) {
        console.error("Falha ao buscar o token de usuário:", e);
        setUserToken(null)
      }
    }

    checkUserToken()
  }, [])

  if (userToken === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  if (userToken) {
    return <Redirect href="/Home" />
  }

  return <Redirect href="/Login" />
}
