import React, { useState } from "react";
import { View,Text,SafeAreaView,StyleSheet,StatusBar,TouchableOpacity, TextInput,Image,Button } from "react-native";
import CustomHeader from "../components/CustomHeader";


const Posts = ({navigation}) => {

    return(
        <SafeAreaView style={styles.container}>
            <CustomHeader title="Bài viết" isBack={false} navigation={navigation}/>
            <View style={styles.center}>
                <View>
                    <Text>Bài viết</Text>
                </View>
            </View>
       
            
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:StatusBar.currentHeight,
        backgroundColor:"#FFFFFF",
    },
    center:{
        justifyContent: 'center',
        alignItems:"center",
        flex:1
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

export default Posts;