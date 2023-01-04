// import { StatusBar } from "expo-status-bar";
import React from "react";
import { View,Text, Image, TouchableOpacity,StatusBar } from "react-native";

const CustomHeader = ({title, isBack, navigation}) => {
    return(
        <>
        <StatusBar barStyle={"light-content"}/>
        <View style={{flexDirection:"row",height:50,backgroundColor:"#337954"}}>
            {
                isBack?
                    <TouchableOpacity style={{flex:1,justifyContent:"center"}}
                        onPress={() => navigation.goBack()}
                    >
                        <Image style={{width:25,height:25,marginLeft:10}} 
                            source={require("../../assets/icons/back.png")}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                :
                    <TouchableOpacity style={{flex:1,justifyContent:"center"}}
                        onPress={() => navigation.openDrawer()}
                    >
                        <Image style={{width:25,height:25,marginLeft:10}} 
                            source={require("../../assets/icons/menu.png")}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
            }
 
              
            <View style={{flex:1.5,justifyContent:"center"}}>
                <Text style={{textAlign:"center",fontSize:22,color:"#FFFFFF",fontWeight:"500"}}>{title}</Text>
            </View>
                
            <View style={{flex:1}}></View>
        </View>
        </>
    );
};

export default CustomHeader;