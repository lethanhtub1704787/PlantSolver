
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, Image, StyleSheet,TouchableOpacity,View,FlatList, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import SendCmtIcon from 'react-native-vector-icons/MaterialIcons'
import firebaseConfig from "../firebase"
import {initializeApp} from "firebase/app"
import {getDatabase,ref,onValue,get,push,set,child} from "firebase/database"
import Loading from "../Loading"
import CloseIcon from 'react-native-vector-icons/Fontisto'


initializeApp(firebaseConfig)

export default CommentModal = ({
    isVisible,
    onClose,
    postId
    }) => {
    const [cmtInputText,setcmtInputText] = useState('')
    const [isCmtLoading,setisCmtLoading] = useState(true)
    const [commentData,setcommentData] = useState('')

    const reference = ref(getDatabase(), 'PlantSolver/Comments');
    useEffect(() => {
        onValue(reference, (snapshot) => {
            let data = []
            snapshot.forEach(function(childSnapshot) {
                let key = childSnapshot.key;
                let childData = childSnapshot.val();
                let finalData = Object.assign(childData, {key: key});
                data.push(finalData);
            })
            setcommentData(data)
        })
        setisCmtLoading(false)
    }, [])

    const onSendCommentPress = (text) => {
        alert(postId + " " + text)
        setcmtInputText('')
    }

    renderItem = ({item}) => {
        return(
            <View style={styles.Card}>
                <View style={styles.UserInfo}>
                    <Image style={styles.UserImg} 
                        source={require('../../../assets/icons/user.png')}
                        // source={item.userImg}
                    />
                    <View style={styles.cmtBox}>
                        <View style={styles.UserText}>
                            <Text style={styles.UserName}>{item.userName}</Text>
                            <View style={styles.cmtContainer}>
                                <Text style={styles.textComment}>{item.commentText}</Text>
                            </View>
                        </View>
                        <Text style={styles.cmtTime}>11 giờ</Text>
                    </View>
                    
                </View>
            </View>
        )
    }

    return(
        <Modal
            isVisible={isVisible}
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
            style={styles.modal}
        >
            <TouchableOpacity onPress={onClose}>
                <View style={styles.ontopClose}>
                    <CloseIcon name="close" style={styles.closeIcon}/>
                </View>
            </TouchableOpacity>
          
            <SafeAreaView style={styles.container}>
                
                <FlatList
                    data={commentData}
                    renderItem={renderItem}
                />
                <View style={styles.writeCmtBox}>
                    <TextInput style={styles.cmtInput}
                        placeholder="Viết bình luận"
                        multiline
                        value={cmtInputText}
                        onChangeText={(text) =>
                            setcmtInputText(text)
                        }
                    />
                    <TouchableOpacity onPress={() => onSendCommentPress(cmtInputText)}>
                        <SendCmtIcon name="send" style={styles.sendIcon}/>
                    </TouchableOpacity>    
                </View>
            </SafeAreaView>
            <Loading loading={isCmtLoading}/>
        </Modal>
    );
}
        
const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        // flex: 1,
        backgroundColor:"#fff",
        // backgroundColor:"red",
        alignItems:"center",
        height:"60%"
        // paddingLeft:10,
    },
    ontopClose:{
        height:40,
        backgroundColor:"#E8F0FE",
        justifyContent: 'center',
        alignItems:'center',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
    },
    closeIcon:{
        fontSize:20
    },
    Card:{
        // backgroundColor: "gray",
        width:"100%",
        marginTop: 5,
        borderRadius: 20,
    },
    UserInfo:{
        flexDirection:"row",
        justifyContent: "flex-start",
        padding:5
    },
    UserImg:{
        width:50,
        height:50,
        borderRadius:25
    },
    UserText:{
        flexDirection:"column",
        justifyContent:"center",
        marginLeft:5,
        // backgroundColor:"#ECEDEF",
        backgroundColor:"#E8F0FE",
        // backgroundColor:"red",
        borderRadius: 10,
        padding:5,
        alignSelf: 'flex-start'
        // borderWidth:1
    },
    cmtBox:{
        width:"84%",
    },
    UserName:{
        fontSize:17,
        fontWeight:"bold"
    },
    cmtContainer:{
        // backgroundColor:"red"
    },
    textComment:{
        fontSize:17
    },
    cmtTime:{
        fontSize:14,
        color: "#666",
        marginLeft:15
    },
    writeCmtBox:{
        width:"100%",
        height:60,
        backgroundColor:"gray",
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        alignSelf: 'flex-start'
    },
    cmtInput:{
        color: 'white',
        paddingLeft:15,
        paddingRight:15,
        paddingVertical:5,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#dadae8',
        width:"80%",
        fontSize:18,
        height:40,
        
    },
    sendIcon:{
        padding:10,
        color:"white",
        fontSize:30
    }

}); 