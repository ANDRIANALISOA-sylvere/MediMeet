import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button } from '@ui-kitten/components'
import React from 'react'
import { Text, View } from 'react-native'

function AccountScreen({ navigation }: any) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    navigation.navigate('Login');
  }
  return (
    <View>
      <Button onPress={handleLogout}>
        Logout
      </Button>
    </View>
  )
}

export default AccountScreen
