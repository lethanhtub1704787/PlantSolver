import React from "react";
import { View,Text,SafeAreaView,StyleSheet,StatusBar,TouchableOpacity, TextInput } from "react-native";

import CustomHeader from "../components/CustomHeader";

const Login = ({navigation}) => {
    return(
        <SafeAreaView style={styles.container}>
            <CustomHeader title="Đăng nhập" isBack={true} navigation={navigation}/>
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <View style={styles.loginBox}>
                    <Text style={styles.loginBox.text}>Tài khoản: </Text>
                    <TextInput placeholder="Tên tài khoản" style={{fontSize:20}}/>
                </View>
                <View style={styles.loginBox}>
                    <Text style={styles.loginBox.text}>Mật khẩu: </Text>
                    <TextInput placeholder="Mật khẩu" style={{fontSize:20}}/>
                </View>
            
                <TouchableOpacity>
                    <Text style={styles.loginBox.text}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text  style={styles.loginBox.text}>Đăng ký</Text>
                </TouchableOpacity>
                
     
               
            </View>
        </SafeAreaView>
   
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:StatusBar.currentHeight,
        backgroundColor:"#FFFFFF"
    },
    loginBox: {
        flexDirection:"row",
        alignItems:"center",
        text:{
            fontSize:25
        }
    }
  });

export default Login;