import React from "react";
import { View, Button, Text, StyleSheet, TextInput, Platform,Image,TouchableOpacity, SafeAreaView, StatusBar} from "react-native";
import { useState,useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FS from "expo-file-system";
import CustomHeader from "../components/CustomHeader";
import Loading from "../components/Loading";

const bg_image = 'https://s2.best-wallpaper.net/wallpaper/iphone/1807/Red-rose-green-leaves-water-drops_iphone_1080x1920.jpg';

const Home = ({navigation}) => {
    const [scanning,setScanning] = useState(false)
    const [imgPicked,setimgPicked] = useState("")

    const getJson = (name) => {
        const apiURL = `http://192.168.1.7:3000/get_name/${name}`;
        fetch(apiURL,{
            method: 'GET'
        })
        .then((res) => res.json())
        .then((resJson) => {
            const label = JSON.stringify(resJson)
            if(label=="Not found"){
                console.log("Not found")
            }
            // console.log(resJson)
            find_this_plant(resJson)
        }).catch((error) => {
            console.log('Request API error: ', error);
        })
    }
    const find_this_plant = (data) => {
        data = data[0]
        // console.log("data params:",data[0].name)
        navigation.navigate("Chi tiết", {
            id: data.id,
            name: data.name,
            info: data.info, 
            genus: data.genus,
            familiy: data.familiy,
            order: data.order, 
            image: data.image,
        })
    }
    const Predict = () => {
        const url = "http://192.168.1.7:3000/predict";
        const formData = new FormData();
        formData.append('image',{
            uri: imgPicked.uri,
            name: "fruit.jpg",
            type: 'image/jpeg'
        })
        const options = {
            method: 'POST',
            body: formData,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
        };
        // console.log(formData);
        fetch(url, options)
        .then(function(body){
            return body.text(); 
        }).then(function(label) {
            console.log("Predicted:",label);
            getJson(label)
        });
    }

    const selectImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        
        if(!pickerResult.cancelled){
            setimgPicked(pickerResult)     
        }
    }

    const Scan = () => { 
        setScanning(true)
        Predict()
        setScanning(false)
    }
    return (
        <>
        <SafeAreaView style={styles.container}>
            <CustomHeader title="Trang chủ" isBack={false} navigation={navigation}/>
            <View style={styles.center}>
                <Image
                    source={{uri: bg_image}}
                    style={StyleSheet.absoluteFill}
                    blurRadius={50}
                /> 
                <Text style={{fontSize:30,color:"white",marginTop:20}}>Welcome to PlantSolver!!!</Text>
            <View style={[{marginTop:50},styles.image_box]}>
                {imgPicked ? 
                <Image source={{uri : imgPicked.uri}}
                    style={styles.image_box} 
                /> 
                : null
                // : <Text style={{fontSize:30,color:"white"}}>Vui lòng chọn ảnh để tìm kiếm</Text> 
                }
            </View>
 
            <View style={{flexDirection:"row",marginTop:50}}>
                <TouchableOpacity onPress={() => selectImage()} >
                    <View style={styles.button}>
                        <Text style={{fontSize:28,color:"#FFFFFF"}}>Chọn ảnh/Chụp</Text>
                    </View>
                
                </TouchableOpacity>

                <TouchableOpacity disabled={!imgPicked ? true : false} onPress={() => Scan()} >
                    <View style={[styles.button,!imgPicked ? styles.disable_button : null]}>
                        <Text style={{fontSize:28,color:"#FFFFFF"}}>Scan</Text>
                    </View>
             
                </TouchableOpacity>
            </View>
        </View>
        </SafeAreaView>
        {
            scanning ? <Loading/> : null
        }
        </>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
        // textAlign: "center",
    },
    container: {
        flex: 1,
        marginTop:StatusBar.currentHeight
    },
    button: {
        backgroundColor:"#337954",
        margin:10,
        borderRadius: 20,
        width: 150,
        height: 120,
        alignItems:"center",
        justifyContent:"center"
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
    disable_button:{
        backgroundColor:"gray",
    }
});

export default Home;