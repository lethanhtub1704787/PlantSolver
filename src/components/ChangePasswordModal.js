import { SafeAreaView, StyleSheet, Text, View,TouchableOpacity,Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import Modal from 'react-native-modal';


const ChangePasswordModal = ({
    isVisible,
    onClose,
    onChangePasswordPress,
}) => {
    const [oldPass,setoldPass] = useState("")
    const [newPass,setnewPass] = useState("")
    const [reNewPass,setreNewPass] = useState("")

  return (
        <Modal
            isVisible={isVisible}
        >
            <SafeAreaView style={styles.centeredView}>
                <View style={[styles.mainContainer]}>
                    <View style={{alignContent:"center",justifyContent:"center"}}>
                     
                            <TextInput
                                style={styles.pwInput}
                                secureTextEntry={true}
                                onChangeText={(text) => setoldPass(text)}
                                placeholder='Mật khẩu cũ'
                            />
                    
                       
                            <TextInput
                                style={styles.pwInput}
                                secureTextEntry={true}
                                onChangeText={(text) => setnewPass(text)}
                                placeholder='Mật khẩu mới'
                            />
                       
                    
                            <TextInput
                                style={styles.pwInput}
                                secureTextEntry={true}
                                onChangeText={(text) => setreNewPass(text)}
                                placeholder='Nhập lại mật khẩu mới'
                            />
                 
                    </View>
                    <View style={{flexDirection:"row",marginTop:20}}>
                        <TouchableOpacity style={styles.button} onPress={() => onChangePasswordPress(oldPass,newPass,reNewPass)}>
                            <Text style={styles.buttonText}>
                                Xác nhận
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button,{marginLeft:20,backgroundColor:"red"}]}
                            onPress={onClose}
                        >
                            <Text style={[styles.buttonText]}>
                                Hủy bỏ
                            </Text>
                        </TouchableOpacity>
                    </View>
                  
                </View>
            </SafeAreaView>
        </Modal>
  )
}

export default ChangePasswordModal

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor:"blue", //remove
        // height:300 //remove
    },
    mainContainer:{
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:"white",
        width:300,
        height:300,
        borderRadius:10,
    },
    pwInput:{
        width:280,
        marginTop:10,
        fontSize:25,
        padding:10,
        borderWidth:2,
        borderRadius:10,
        borderColor:"#337954"
    },
    button:{
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#337954",
        width:100,
        height:50,
        borderRadius:5
    },
    buttonText:{
        fontSize:20,
        color:"white",
    }
})