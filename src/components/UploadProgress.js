import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import * as Progess from 'react-native-progress'

const UploadProgress = ({progress}) => {
  return (
    <View>
      <Progess.Bar progress={progress} width={200}/>
    </View>
  )
}

export default UploadProgress

const styles = StyleSheet.create({})