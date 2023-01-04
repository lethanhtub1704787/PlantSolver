import React, { createRef, useContext, useEffect, useState } from "react";
import { View,Text,SafeAreaView,StyleSheet,StatusBar,TouchableOpacity, TextInput,Image,Button, ScrollView } from "react-native";
import CustomHeader from "../components/CustomHeader";
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import { AuthContext } from "../context/AuthContext";
import host from "../../assets/host";
import {getDatabase,ref,push} from "firebase/database"
import * as MyStorage from "firebase/storage"
import firebaseConfig from "../components/firebase";
import {initializeApp} from "firebase/app"
import { uploadBytes,getDownloadURL } from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker';
import ImagePickerModal from "../components/Image-Picker-Modal";
import ChangePasswordModal from "../components/ChangePasswordModal";

initializeApp(firebaseConfig)
const Profile = ({navigation}) => {
    const {userInfo,save} = useContext(AuthContext)
    const [isEdit,setisEdit] = useState(false)
    const [editName,seteditName] = useState(false)
    const [imgPicker,setimgPicker] = useState(false)
    const [countData,setcountData] = useState({})
    const [Avatar,setAvatar] = useState(userInfo.avatar)
    const [userName,setuserName] = useState(userInfo.name)
    const [changePasswordModal,setchangePasswordModal] = useState(false)
    const nameInputRef = createRef();

    useEffect(() => {
        getPostLikeCount()
    },[])
    
    const getPostLikeCount = () => {
        const apiURL = `${host}/PostLikeCount/${userInfo.userId}`;
        fetch(apiURL,{
            method: 'GET'
        })
        .then((res) => res.json())
        .then((resJson) => {
            console.log(resJson)
            setcountData(resJson)
        }).catch((error) => {
            console.log('Request API error: ', error);
        })
    }

    const changeAvatar = async (avatar) => {
   
        const my_storage = MyStorage.getStorage()
        console.log("uploading image")
        const upload_ref = MyStorage.ref(my_storage,'Users/'+userInfo.userId+".jpg")
        const img = await fetch(avatar)
        const bytes = await img.blob()
        const uploadImage = await uploadBytes(upload_ref,bytes).catch((error) => {
            console.error(error)
        })
        let url_ref = uploadImage.ref
        let urlLink = await getDownloadURL(url_ref)
        // console.log(urlLink)


        const dataToSend = {
            "uid" : userInfo.userId,
            "avatar" : urlLink,
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        };
        fetch(`${host}/updateAvatar`, requestOptions)
        .then(response => response.json())
        .then(responseJson => {
            console.log(responseJson)
            const newUserInfo = {
                "userId": userInfo.userId,
                "name": userInfo.name,
                "avatar": urlLink
            }
            save(JSON.stringify(newUserInfo))
        })
        .catch((error) => {
            console.error(error);
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
            quality: 1
        });
        
        if(!pickerResult.canceled){
            setimgPicker(false)   
            let uri = pickerResult.assets[0].uri
            setAvatar(uri)
            changeAvatar(uri)
        }
    }

    const openCamera = async ()  => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your camera!");
            return;
        }

        const cameraResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality:1
        }
        );

        if (!cameraResult.canceled) {
            setimgPicker(false)   
            let uri = cameraResult.assets[0].uri
            setAvatar(uri)
            changeAvatar(uri)
        }
    }

    const editUserName = () => {
        setisEdit(!isEdit)
        seteditName(!editName)
        if(isEdit){
            const newUserInfo = {
                "userId": userInfo.userId,
                "name": userName,
                "avatar": userInfo.avatar
            }
            save(JSON.stringify(newUserInfo))
            const dataToSend = {
                "userID": userInfo.userId,
                "userName": userName,
            }
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            };
            fetch(`${host}/changeName`, requestOptions)
            .then(response => response.json())
            .then(responseJson => {
                console.log("change name: ",responseJson);         
            })
            .catch((error) => {
                console.error(error);
            })
            alert("Đổi tên thành công")
        }
    }

    const handleChangePassword = (oldPass,newPass,reNewPass) => {
        if(!oldPass){
            alert("Xin hãy nhập mật khẩu cũ")
            return
        }
        if(!newPass){
            alert("Xin hãy nhập mật khẩu mới")
            return
        }
        if(!reNewPass){
            alert("Xin hãy nhập lại mật khẩu mới")
            return
        }
        if(newPass!==reNewPass){
            alert("Nhập lại mật khẩu chưa đúng")
            return
        }
        const dataToSend = {
            "userID": userInfo.userId,
            "oldPassword": oldPass,
            "newPassword": newPass,
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        };
        fetch(`${host}/changePassword`, requestOptions)
        .then(response => response.json())
        .then(responseJson => {
            console.log("change password: ",responseJson); 
            if(responseJson.Incorrect){
                alert("Mật khẩu cũ chưa đúng")
            }else{
                setchangePasswordModal(false)
                alert("Đổi mật khẩu thành công")
            } 
        })
        .catch((error) => {
            console.error(error);
        })
        // alert("Đổi tên thành công")
    }

    return(
        <SafeAreaView style={styles.container}>
            <ImagePickerModal
                imgPicker={imgPicker}
                onClose={() => setimgPicker(false)}
                onImageLibraryPress={selectImage}
                onCameraPress={openCamera}
            />
            <ChangePasswordModal
                isVisible={changePasswordModal}
                onClose={() => setchangePasswordModal(false)}
                onChangePasswordPress={handleChangePassword}
            />
            <CustomHeader title="Hồ sơ" isBack={true} navigation={navigation}/>
            <ScrollView>
            <View style={{padding:10,width:"100%",backgroundColor:"#337954",height:100,alignItems:"center"}}>
              
                <TouchableOpacity style={styles.imgButton} onPress={() => setimgPicker(true)}>
                    {
                        Avatar? 
                            <Image style={styles.UserImg} 
                                source={{uri : Avatar}}
                            /> :
                        <Image style={styles.UserImg} 
                            source={require('../../assets/icons/user.png')}
                        />
                    }
                   
                    <AntDesign name="edit" style={{fontSize:25,marginLeft:100,marginTop:-15}}/>
                </TouchableOpacity>
            </View> 

            <View style={{flexDirection:"row",marginTop:50,alignItems:"center",marginTop:100,justifyContent:"center"}}>
                <View style={styles.circleBox}>
                    <View style={styles.circle}>
                        <Text style={{fontSize:30}}>{countData?.post}</Text>
                    </View>
                    <View >
                        <Text style={{fontSize:20}}>Bài viết</Text>
                    </View>
                </View>

                <View style={[styles.circleBox,{marginLeft:70}]}>
                    <View style={styles.circle}>
                    <Text style={{fontSize:30}}>{countData?.like}</Text>
                    </View>
                    <View >
                    <Text style={{fontSize:20}}>Like</Text>
                    </View>
                </View>
            </View>
            <View style={{width:"100%",padding:20}}>
                <View style={{}}>
                    <View><Text>Tên người dùng:</Text></View>
                    <View style={{flexDirection:"row"}}>
                        <View style={styles.userInfoTag}>
                            <TextInput style={[styles.userInfoText,{color: isEdit? "white" : null}]}
                                editable={isEdit}
                                onChangeText={(text) => setuserName(text)}
                                // autoFocus={isEdit}
                                // selectTextOnFocus={isEdit}
                                ref={nameInputRef}
                            >
                                {userName}
                            </TextInput>
                        </View>
                        <TouchableOpacity onPress={() => editUserName()}>
                        {!isEdit ? 
                            <AntDesign name="edit" style={styles.editIcon}/>
                            :
                            <Entypo name="check" style={styles.editIcon}/>
                        }
                            
                        </TouchableOpacity>
                    </View> 
                </View>

                <View style={{marginTop:30}}>
                    <View><Text>Tên tài khoản:</Text></View>
                    <View style={styles.userInfoTag}>
                        <Text style={[styles.userInfoText,{height:30,color:"black"}]}>
                            {userInfo.userId}
                        </Text>
                    </View>
                    {/* <AntDesign name="edit" style={styles.editIcon}/> */}
                </View>
            
                
                {/* <View style={{marginTop:30}}>
                    <View><Text>etc:</Text></View>
                    <View style={styles.userInfoTag}>
                        <Text style={styles.userInfoText}>
                           
                        </Text>
                    </View>
                </View> */}
            </View>
            <View style={{height:180,justifyContent:"flex-end",alignItems:"center"}}>
                <TouchableOpacity style={styles.updateButton} onPress={() => setchangePasswordModal(true)}>
                    <Text style={{fontSize:20,color:"white"}}>
                        Đổi mật khẩu
                    </Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop:StatusBar.currentHeight,

        backgroundColor:"#FFFFFF"
    },
    imgButton:{
        // width:140,
        // height:140,
        borderRadius:100,
        marginTop:25,
        backgroundColor:"white"
    },
    UserImg:{
        width:140,
        height:140,
        borderRadius:100,
        // marginTop:25
    },
    userInfoTag:{
        // flex:1,
        flexDirection:"row",
        // backgroundColor:"red",
        backgroundColor:"#337954",
        height:50,
        alignItems:"center",
        borderRadius:15,
        width:"90%",
        padding:10
    },
    userInfoText:{
        fontSize:20,
        color:"#8b9cb5",
        flex:1,
        height:50
        // backgroundColor:"red"
    },
    editIcon:{
        fontSize:25,
        marginLeft:5,
        marginTop:15
    },
    updateButton:{
        backgroundColor:"green",
        width:"80%",
        borderRadius:20,
        height:50,
        justifyContent:"center",
        alignItems:"center",
        marginBottom:30
    },
    circleBox:{
        alignItems:"center",
        justifyContent:"center"
    },
    circle:{
        borderRadius:100,
        borderWidth:1,
        width:80,
        height:80,
        justifyContent:"center",
        alignItems:"center"
    }
   
  });

export default Profile;