import React from "react";
import { View, Button, Text, StyleSheet, TextInput, Platform,Image,TouchableOpacity, SafeAreaView, StatusBar,Alert} from "react-native";
import { useState,useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import CustomHeader from "../components/CustomHeader";
import Loading from "../components/Loading";
import ImagePickerModal from "../components/Image-Picker-Modal";
import PlantSelect_Modal from "../components/PlantSelect_Modal";
import host from "../../assets/host";

const bg_image = 'https://s2.best-wallpaper.net/wallpaper/iphone/1807/Red-rose-green-leaves-water-drops_iphone_1080x1920.jpg';

const Home = ({navigation}) => {
    const [scanning,setScanning] = useState(false)
    const [imgPicked,setimgPicked] = useState("")
    const [typePicked,settypePicked] = useState("")
    const [typePicker,settypePicker] = useState(false)
    const [imgPicker,setimgPicker] = useState(false)
    const getJson = (name) => {
        const apiURL = `${host}/get_name/${name}`;
        fetch(apiURL,{
            method: 'GET'
        })
        .then((res) => res.json())
        .then((resJson) => {
            find_this_plant(resJson)
        }).catch((error) => {
            Alert.alert("","Không tìm thấy dữ liệu. Vui lòng chọn ảnh khác")
            setScanning(false)
            console.log("Fruit data not found")
            console.log('Request Data by name error: ', error);
            return
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
            family: data.family,
            order: data.order, 
            image: data.image,
        })
        setScanning(false)
    }
    const Predict = () => {
        const url = `${host}/predict`;
        const formData = new FormData();
        formData.append('image',{
            uri: imgPicked.uri,
            name: `${typePicked}.jpg`,
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
            if(label=="not found"){
                alert("not found")
                console.log("not found");
                return
            }
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
            setimgPicker(false)   
            settypePicker(true)
            setimgPicked(pickerResult)
        }
    }

    const openCamera = async ()  => {
        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your camera!");
            return;
        }

        const cameraResult = await ImagePicker.launchCameraAsync();

        if (!cameraResult.cancelled) {
            setimgPicker(false)   
            settypePicker(true)
            setimgPicked(cameraResult);
        }
    }

    const set_TypePicked = (type) => {
        settypePicked(type)
        settypePicker(false)
    }

    const Scan = () => { 
        setScanning(true)
        Predict()
    }

    // const test = () => { 
    //     settypePicker(true)
    // }

    // const consolelog = () => {
    //     console.log(typePicked)
    // }

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
            {
                imgPicked ? 
                <View>
                    <Text style={styles.picked_Text}>Ảnh đã chọn</Text>
                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.picked_Text}>Loại: </Text>
                        <View style={{backgroundColor:"white",alignItems:"center",justifyContent: 'center',borderRadius:30,width:60}}>
                            <Text style={[styles.picked_Text,{color:"green",marginTop:0}]}>{typePicked == "fruit" ? "Quả" : "Hoa"}</Text>
                        </View>
                    </View>
             
                </View>
                :
                null
            }
         
            
 
            <View style={{flexDirection:"row",marginTop:50}}>
                <TouchableOpacity onPress={() => setimgPicker(true)} >
                    <View style={styles.button}>
                        <Text style={{fontSize:28,color:"#FFFFFF"}}>Chọn ảnh/Chụp</Text>
                    </View>
                
                </TouchableOpacity>

                <TouchableOpacity disabled={!imgPicked ? true : false} onPress={() => Scan()} >
                    <View style={[styles.button,!imgPicked ? styles.disable_button : null]}>
                        <Text style={{fontSize:28,color:"#FFFFFF"}}>Nhận diện</Text>
                    </View>
             
                </TouchableOpacity>
            </View>
            {/* <Button title="Test" onPress={() => test()}/>
            <View> 
                <Button title="Log" onPress={() => consolelog()}/>
            </View> */}
           
        </View>
        </SafeAreaView>
        <ImagePickerModal
            imgPicker={imgPicker}
            onClose={() => setimgPicker(false)}
            onImageLibraryPress={selectImage}
            onCameraPress={openCamera}
        />
        <PlantSelect_Modal
            typePicker={typePicker}
            onFruitTypePress={() => set_TypePicked("fruit")}
            onFlowerTypePress={() => set_TypePicked("flower")}
        />

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
    },
    picked_Text:{
        color:"red",
        fontSize:20,
        marginTop:10,
        fontWeight:"700"
    }
});

export default Home;