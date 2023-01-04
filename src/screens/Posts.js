import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { View,Text,SafeAreaView,StyleSheet,StatusBar,TouchableOpacity, TextInput,Image,Dimensions,FlatList, Alert } from "react-native";
import firebaseConfig from "../components/firebase";
import {initializeApp} from "firebase/app"

import {getDatabase,ref,onValue,get,push,set,child, equalTo,query,orderByChild,remove,update} from "firebase/database"
import CommentModal from "../components/UserPosts/CommentModal";
import Loading from "../components/Loading";
import PostHeader from "../components/PostHeader";
import { AuthContext } from "../context/AuthContext";
import host from "../../assets/host";
import 'moment/locale/vi'
import PostItem from "../components/UserPosts/PostItem";
const moment = require("moment")
const widthScreen = Dimensions.get("window").width
initializeApp(firebaseConfig)

const Posts = ({navigation,route}) => {
    const {userInfo} = useContext(AuthContext)
    const [postData,setpostData] = useState("")

    const [cmtVisible,setcmtVisible] = useState(false)
    const [isCmtLoading,setisCmtLoading] = useState(false)
    const [commentData,setcommentData] = useState([])
    const [postId,setpostId] = useState('')
    const [isLoading,setisLoading] = useState(true)
  
    // const post_reference = ref(getDatabase(), 'PlantSolver/Posts');

    useEffect(() => {
        if(route.params?.content){
            const newPost = [...postData]
            let newPostData = {
                cmtCount: 0,
                content: route.params.content,
                image: route.params.image,
                timeStamp: route.params.timeStamp,
                key: route.params.key,
                uid: userInfo.userId,
                info: {avatar:userInfo.avatar,name:userInfo.name},                   
            }
            newPost.splice(0,0,newPostData)
            setpostData(newPost)
            console.log("added new post")
        }else{
            API_getPostData()
        }

        // onValue(post_reference, () => {
            
        // })
    }, [route.params?.content])

    const API_getPostData = () => {
        console.log("loading posts data...")
        const apiURL = `${host}/getPosts`;
        fetch(apiURL,{
            method: 'GET'
        })
        .then((res) => res.json())
        .then((resJson) => {
            // console.log(resJson)
            setpostData(resJson.reverse())
        }).catch((error) => {
            console.log('Request Post Data API error: ', error);
        }).finally(() => setisLoading(false)) // re-render (1)
    }

    const API_getCommentData = (postID) => {
        const apiURL = `${host}/getComment/${postID}`;
        fetch(apiURL,{
            method: 'GET'
        })
        .then((res) => res.json())
        .then((resJson) => {
            // console.log(resJson)
            if(resJson.status){
                setcommentData(resJson.data)
            }else{
                setcommentData([])
            }
        }).catch((error) => {
            console.log('Request Comment API error: ', error);
        }).finally(() => setisLoading(false)) // re-render (2)
    }

    const handleComment = useCallback((picked_postId,newCmtData) => {
        console.log("loading comments...")
        setcmtVisible(true)
        setisCmtLoading(true)
        setpostId(picked_postId)
        setcommentData(newCmtData) 
        // newCmtData ? setcommentData(newCmtData) : API_getCommentData(picked_postId)
        setisCmtLoading(false)
        // API_getPostData()
        // API_getPostData()
    },[])



    const getCommentCount = () => {
        return commentData.length
    }
    // {
    //     onGoBack: () => this.refresh()
    const handleLike = useCallback((key) =>{
        // updateLike(key)
        let postID = key
        const dataToSend = {
            "postID" : postID,
            "userID" : userInfo.userId,
        }
        console.log("data like:",dataToSend)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        };
        fetch(`${host}/likePost`, requestOptions)
        .then(response => response.json())
        .then(responseJson => {
            console.log(responseJson);
        })
        .catch((error) => {
            console.log(error);
        });
    },[])


    const updateComment = (data) => {
        // console.log({commentData})
        if(commentData.length===0){
            setcommentData([data])
        }else{
            const newComment = [...commentData]
            newComment.push(data)
            setcommentData(newComment);
        }
    }

    const addComment = async (cmtInputText) => {
        let thisTime = moment().format()
        const commentPostRef = ref(getDatabase(), 'PlantSolver/Comments/'+postId);
        const newCommentKey = push(commentPostRef).key;
        // console.log(newCommentKey)
        const data_to_Update = {
            "uid": userInfo.userId,
            "info":{"name": userInfo.name, "avatar": userInfo.avatar},
            "message": cmtInputText,
            "timeStamp": thisTime,
            "key": newCommentKey,
        }
        
        updateComment(data_to_Update)
      
        // console.log("current comment data:",commentData)
        // console.log(data_to_Update)
        // updateComment(data_to_Update)
       
        const commentData = {
            "postID":postId,
            "uid": userInfo.userId,
            "message": cmtInputText,
            "timeStamp": thisTime,
            "commentID": newCommentKey,
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData)
        };
        fetch(`${host}/addComment`, requestOptions)
        .then(response => response.json())
        .then(responseJson => {
            console.log(responseJson);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const handleSendComment = async (cmtInputText) => {
        setisCmtLoading(true)
        await addComment(cmtInputText)
        setisCmtLoading(false)
    }
    
    const handleDelete = useCallback((itemID) => {
        Alert.alert(
            'Bạn có muốn xóa bài viết?',
            '',
            [
              {
                text: 'Xác nhận',
                onPress: () => {
                    let data = [...postData]
      
                    let objIndex = data.findIndex((obj => obj.key == itemID)) //find item index
                  
                    if (objIndex > -1) { 
                        data.splice(objIndex, 1); // remove item index
                    }
                    setpostData(data)
            
                    let removePost_ref =  ref(getDatabase(), 'PlantSolver/Posts'+ '/' + itemID);
                    let removeCmtPost_ref =  ref(getDatabase(), 'PlantSolver/Comments'+ '/' + itemID);
                    remove(removePost_ref)
                    remove(removeCmtPost_ref)

                    alert(
                        "Đã xóa bài viết!"
                      );
                },
              },
              {
                text: 'Hủy',
                onPress: () => {
                  return
                },
              },  
            ],
            {cancelable: false},
          );
    },[postData])

    const handleAddPost = () => {
        userInfo ? navigation.navigate("AddPost",{
            userId: userInfo.userId,
            name: userInfo.name,
            avatar: userInfo.avatar,
        })
        : alert("Bạn cần đăng nhập để đăng bài!")
    }

    return(
        <>
        <Loading loading={isLoading}/>
        <CommentModal
            isVisible={cmtVisible}
            onClose={() => setcmtVisible(false)}
            postId={postId}
            commentData={commentData}
            isCmtLoading={isCmtLoading}
            onSendComment={handleSendComment}
            getCommentData={API_getCommentData}
        />
        <View>
            <PostHeader 
                navigation={navigation}
                onAddPostPress={() => handleAddPost()}         
            />
        </View>
            <View style={styles.container}>
                {
                    postData===""&&isLoading===false? <Text style={{fontSize:20}}>Chưa có bài viết</Text> : 
                    (
                        <FlatList
                            data={postData}
                            renderItem={({item}) => 
                                <PostItem Posts={item} onDelete={handleDelete} onLike={handleLike} onComment={handleComment}/>
                            }
                            keyExtractor={item => item.key}
                        />
                    )
                    
                }
              
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#FFF",
        alignItems:"center",
        justifyContent:"center"
        // padding:10,
    },
  });

export default Posts;