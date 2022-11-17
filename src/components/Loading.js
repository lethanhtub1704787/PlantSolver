import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'


const Loading = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject,styles.container]}>
      <LottieView source={require('../../assets/loading.json')} autoPlay loop/>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex:1,
  }
})

export default Loading