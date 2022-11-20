import React, { useState } from "react";
import { View,Text,SafeAreaView,StyleSheet,StatusBar,TouchableOpacity, TextInput,Image,Button } from "react-native";
import CustomHeader from "../components/CustomHeader";


const Profile = ({navigation}) => {

    return(
        <SafeAreaView style={styles.container}>
            <CustomHeader title="Hồ sơ" isBack={true} navigation={navigation}/>
            <View style={{justifyContent:"center",alignItems:"center",marginBottom:50}}>
                <Text>Profile</Text>
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
    },
    image_box:{
        width:280,
        height:280, 
        borderRadius:20,
        resizeMode:"stretch",
        borderWidth:2,
        justifyContent:"center",
        alignItems:"center"
    },
  });

export default Profile;