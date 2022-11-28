import React from "react";
import { View,Text, Image, TouchableOpacity,StyleSheet } from "react-native";
import AddPostIcon from 'react-native-vector-icons/MaterialIcons'

const PostHeader = ({onAddPostPress, navigation}) => {
    return(
        <View style={styles.Container}>
            <View style={styles.Drawer}>
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()}
                >
                    <Image style={{width:25,height:25,marginLeft:10}} 
                        source={require("../../assets/icons/menu.png")}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.Title}>
                <Text style={{textAlign:"center",fontSize:22,color:"#FFFFFF",fontWeight:"500"}}>Bài viết</Text>
            </View>

            <View style={styles.addPost}>
                <TouchableOpacity onPress={onAddPostPress}>
                    <AddPostIcon name="post-add" style={styles.Icon}/>
                </TouchableOpacity>
            </View>
                
            {/* <View style={{flex:1}}></View> */}
        </View>
    );
};

export default PostHeader;
const styles = StyleSheet.create({
    Container:{
        flexDirection:"row",
        height:50,
        backgroundColor:"#337954",
        // justifyContent:"space-around"
    },
    Drawer:{
        justifyContent:"center",
        // backgroundColor:"red",
        width:"20%",
    },
    Title:{
        justifyContent:"center",
        // backgroundColor:"blue",
        width:"60%",
    },
    addPost:{
        // backgroundColor:"yellow",
        width:"20%",
        alignItems:"flex-end",
        justifyContent:"center"
    },
    Icon:{
        padding:10,
        fontSize:30,
        color:"#fff"
    },
})