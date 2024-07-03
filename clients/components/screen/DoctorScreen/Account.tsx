import React from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button } from '@ui-kitten/components'

function Account({ navigation }: any) {
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

export default Account
