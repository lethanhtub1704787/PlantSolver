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
initializeApp(firebaseConfig)
const widthScreen = Dimensions.get("window").width
const moment = require("moment")
const AddPost = ({navigation,route}) => {
    // const {userInfo} = useContext(AuthContext)
    const [imgPicker,setimgPicker] = useState(false)
    const [post,setPost] = useState('')
    const [imgPicked,setimgPicked] = useState('')
    const [imgUrl,setimgUrl] = useState('')
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
            setimgPicked(cameraResult);
        }
    }

    // const push_post = async (userId, content, Image) => {
    //     let target_ref = ref(getDatabase(), 'PlantSolver/Posts');
    //     const newPostKey = push(target_ref).key;
    //     if(Image){
    //         await uploadImage(Image,newPostKey)
    //     }
    //     const postData = {
    //         content: content,
    //         uid: userId,
    //         image: imgUrl,
    //         likeCount: 0,
    //         cmtCount: 0,
    //         timeStamp: moment().format()
    //     };
    //       // Write the new post's data simultaneously in the posts list and the user's post list.
    //     const updates = {};
    //     updates[newPostKey] = postData;

    //     // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    //     return update(target_ref, updates);
    // }

    // const uploadImage = async (image,name) => {

    // }   

    const handlePost = async (user,content,imgPicked) => {
        if(!content){
            alert("Xin nhập nội dung")
            return
        }
        try{
            const target_ref = ref(getDatabase(), 'PlantSolver/Posts');
            const newPostKey = push(target_ref).key;
            const my_storage = MyStorage.getStorage()
            const upload_ref = MyStorage.ref(my_storage,'Posts/'+newPostKey+".jpg")
            // console.log("ref:",ref)
            const img = await fetch(imgPicked.uri)
            const bytes = await img.blob()
            await uploadBytes(upload_ref,bytes).then((snapshot) => {
                let url_ref = snapshot.ref
                getDownloadURL(url_ref).then(
                    (url) => {
                        const postData = {
                            content: content,
                            uid: user.userId,
                            image: url,
                            likeCount: 0,
                            cmtCount: 0,
                            timeStamp: moment().format()
                        };
                          // Write the new post's data simultaneously in the posts list and the user's post list.
                        const updates = {};
                        updates[newPostKey] = postData;       
                        // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
                        update(target_ref, updates);
                    }
                )
            });            
        }catch(err){
            alert(err)
        }
        navigation.goBack()
    }

    return (
    <>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackIcon name="arrow-back" style={styles.backIcon}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePost(route.params,post,imgPicked)}>
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
                        <Image source={{uri : imgPicked.uri}}
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
        marginTop:StatusBar.currentHeight,
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