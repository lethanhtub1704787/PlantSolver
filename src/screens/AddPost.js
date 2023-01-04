import { Dimensions, StyleSheet, Text, TouchableOpacity, View,Image,StatusBar,TextInput,TouchableWithoutFeedback, Keyboard, MaskedViewComponent } from 'react-native'
import React, { useState } from 'react'
import BackIcon from 'react-native-vector-icons/Ionicons'
import AddIcon from 'react-native-vector-icons/Ionicons'
import ImagePickerModal from '../components/Image-Picker-Modal'
import * as ImagePicker from 'expo-image-picker';
import {getDatabase,ref,onValue,get,push,set,child,update} from "firebase/database"
import * as MyStorage from "firebase/storage"
import firebaseConfig from "../components/firebase";
import {initializeApp} from "firebase/app"
import { uploadBytes,getDownloadURL } from 'firebase/storage'
import Loading from '../components/Loading'
initializeApp(firebaseConfig)
const widthScreen = Dimensions.get("window").width
const moment = require("moment")
const AddPost = ({navigation,route}) => {
    // const {userInfo} = useContext(AuthContext)
    const [isLoading,setisLoading] = useState(false)
    const [imgPicker,setimgPicker] = useState(false)
    const [post,setPost] = useState('')
    const [imgPicked,setimgPicked] = useState('')
    
    const user = route.params
    const selectImage = async () => { 
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality:1
        });
        
        if(!pickerResult.canceled){
            setimgPicker(false)   
            let uri = pickerResult.assets[0].uri
            setimgPicked(uri)
        }
    }
    const openCamera = async ()  => {
        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your camera!");
            return;
        }

        const cameraResult = await ImagePicker.launchCameraAsync(
            {
                quality:1
            }
        );

        if (!cameraResult.canceled) {
            setimgPicker(false)   
            let uri = cameraResult.assets[0].uri
            setimgPicked(uri)
        }
    }

    function getCurrentTime(){
        // moment.locale('vi');
        let time = moment().format()
        return time
    }

    const handlePost = async (content,imgPicked) => {
        if(!content){
            alert("Xin nhập nội dung")
            return
        }
        setisLoading(true)
    
        try{
            const target_ref = ref(getDatabase(), 'PlantSolver/Posts');
            const newPostKey = push(target_ref).key;
            const image = []
            const nowTime = getCurrentTime()
            if(imgPicked){
                console.log("uploading image")
                const my_storage = MyStorage.getStorage()
                const upload_ref = MyStorage.ref(my_storage,'Posts/'+newPostKey+".jpg")
                // console.log("ref:",ref)
                const img = await fetch(imgPicked)
                const bytes = await img.blob()
                const uploadImage = await uploadBytes(upload_ref,bytes).catch((error) => {
                    console.error(error)
                    setisLoading(false)
                })
                let url_ref = uploadImage.ref
                let urlLink = await getDownloadURL(url_ref)
                console.log(urlLink)
                image.push(urlLink)
                // .then((url) => {
                //     console.log(url)
                //     image.push(url)
                // })
            }
           
            const postData = {
                content: content,
                uid: user.userId,
                image: image[0] ? image[0] : "",
                timeStamp: nowTime,
            };
                // Write the new post's data simultaneously in the posts list and the user's post list.
            const updates = {};
            updates[newPostKey] = postData;       
            // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
            update(target_ref, updates);
            // navigation.goBack()
            navigation.navigate("Posts",{
                content: postData.content,
                image: postData.image,
                timeStamp: postData.nowTime,
                key: newPostKey
            })
            setisLoading(false)            
        }catch{
            (error) => console.log(error)
        }
    }

    return (
    <>
        <Loading loading={isLoading}/>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackIcon name="arrow-back" style={styles.backIcon}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePost(post,imgPicked)}>
                <Text style={styles.postButton}>Đăng</Text>
            </TouchableOpacity>
        </View>
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
            <View style={styles.Container}>
                <View style={styles.inputWrapper}>
                    {/* {image != null ? <AddImage source={{uri: image}} /> : null} */}
                    <TextInput style={styles.inputStyle}
                        placeholder="Bạn muốn chia sẻ gì?"
                        multiline
                        // numberOfLines={4}
                        value={post}
                        onChangeText={(content) => setPost(content)}
                    />
                </View>
                <TouchableOpacity style={styles.imageContainer} onPress={() => setimgPicker(true)}>
                    {
                        imgPicked ? 
                        <Image source={{uri : imgPicked}}
                            style={styles.image_box} 
                        /> 
                    : (
                        <>
                            <AddIcon name="add" style={styles.addIcon} />
                            <Text>Thêm ảnh / Chụp</Text>
                        </>
                        )
                    }
                        
                </TouchableOpacity>
               
            </View>
        </TouchableWithoutFeedback>
        <ImagePickerModal 
          imgPicker={imgPicker}
          onClose= {() => setimgPicker(false)}
          onImageLibraryPress = {selectImage}
          onCameraPress = {openCamera}
        />
    </>
  )
}

const styles = StyleSheet.create({
    Container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: "space-between",
        backgroundColor: "#2e64e515"
        // backgroundColor:"red"
    },
    header:{
        // marginTop:StatusBar.currentHeight,
        flexDirection:"row",
        justifyContent:"space-between",
        paddingHorizontal:20,
        paddingVertical:12,
        borderBottomWidth:1,
        borderBottomColor: "#D8D9DB"
    },
    backIcon:{
        fontSize:30,
    },
    postButton:{
        fontSize:18,
        fontWeight:"600"
    },
    inputWrapper:{
        // flex: 1,
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
    },
    inputStyle:{
        justifyContent:"center",
        alignItems:"center",
        textAlign:"center",
        fontSize:24,
        width:"90%",
        marginTop:160
        // backgroundColor:"red"
    },
    imageContainer:{
        // backgroundColor:"red",
        width:"90%",
        borderWidth:1,
        height:250,
        borderRadius:30,
        marginBottom:30,
        alignItems:"center",
        justifyContent:"center"
    },
    addIcon:{
        fontSize:40
    },
    image_box:{
        height:250,
        width:"100%",
        borderRadius:30
    }
})
export default AddPost