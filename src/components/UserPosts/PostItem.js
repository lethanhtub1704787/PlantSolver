import { StyleSheet, Text, View,Dimensions,Image,TouchableOpacity } from 'react-native'
import React, { useContext,memo, useState, useEffect } from 'react'
import 'moment/locale/vi'
import { AuthContext } from '../../context/AuthContext'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommentIcon from 'react-native-vector-icons/EvilIcons'
import host from '../../../assets/host'
import {getDatabase,ref,onValue,get,push,set,child, equalTo,query,orderByChild,remove,update} from "firebase/database"
const widthScreen = Dimensions.get("window").width
const moment = require("moment")

const PostItem = ({Posts,onDelete,onLike,onComment,getCommentDataAPI}) => {
    const {userInfo} = useContext(AuthContext)
    // const [isLiked,setisLiked] = useState(Posts.liked ? Posts.liked[userInfo.userId] ? true : false : false)
    const [isLiked,setisLiked] = useState(userInfo? Posts.liked? Posts.liked[userInfo.userId]? true : false : false : false)
    const [likeCount,setlikeCount] = useState(!Posts['liked'] ? 0 : Object.keys(Posts['liked']).length)
    const [commentData,setcommentData] = useState([])
    const [cmtCount,setcmtCount] = useState(Posts.cmtCount? Posts.cmtCount : 0)
    const comment_ref =  ref(getDatabase(), 'PlantSolver/Comments/'+Posts.key);
    const like_ref =  ref(getDatabase(), 'PlantSolver/Posts/'+Posts.key+"liked");
    console.log("re-render flatlist")
     useEffect(() => {
        onValue(comment_ref, () => {
            API_getCommentData()
            
        })
    },[])
  
    const API_getCommentData = () => {
        const apiURL = `${host}/getComment/${Posts.key}`;
        fetch(apiURL,{
            method: 'GET'
        })
        .then((res) => res.json())
        .then((resJson) => {
            if(resJson.status){
                setcommentData(resJson.data)
                setcmtCount(resJson.data.length)
            }else{
                setcommentData([])
            }
        }).catch((error) => {
            console.log('Request Comment API error: ', error);
        }) // re-render (2)
    }

    

    function getCurrentTime(timeStamp){
        moment.locale('vi');
        let time = moment(timeStamp).fromNow()
        return time
    }

    const onLikePress = (key) => {
        if(!userInfo){
            alert("Bạn cần đăng nhập")
            return
        }
        setisLiked(!isLiked)
        setlikeCount(isLiked ? likeCount-1 : likeCount+1)
        onLike(key)
    }

    const onCommentPress = (key,commentData) => {
        onComment(key,commentData)
    }


    return(
        <View style={styles.Card}>
            <View style={styles.UserInfo}>
                {
                    Posts.uid == userInfo.userId && userInfo.avatar ? 
                        <Image style={styles.UserImg} 
                            source={{uri: userInfo.avatar}}
                        />
                    :
                    Posts.info?.avatar ? (
                        <Image style={styles.UserImg} 
                            source={{uri: Posts.info.avatar}}
                        />
                    ) :
                    (
                        <Image style={styles.UserImg} 
                            source={require('../../../assets/icons/user.png')}
                        />
                    )
                }
                <View style={styles.UserText}>
                    <Text style={[styles.UserName,{color: userInfo.userId == Posts.uid ? "red" : null}]} > {Posts.info.name}</Text>
                    <Text style={styles.PostTime}> {getCurrentTime(Posts.timeStamp)}</Text>
                </View>
                {
                    userInfo.userId == Posts.uid ? (
                        <View style={styles.deleteContainer}>
                            <TouchableOpacity onPress={() => {onDelete(Posts.key)}} style={styles.deleteButton}>
                                <View>
                                    <AntDesign name="closecircleo" style={styles.deleteIcon}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }
            
            </View>

            <Text style={styles.PostText}>{Posts.content}</Text>
            {
                Posts.image ? (
                    <View style={styles.PostImg}>
                        <Image style= {{flex:1 ,  width: '100%',height: '100%',resizeMode: 'contain',}}  
                            source={{uri: Posts.image}}
                        />
                    </View>
                ) : null
            }
            <View style={styles.divider}></View>
       
            <View style={styles.InteractionWrapper}>
                <TouchableOpacity style={styles.InteractionButton} onPress={() => {onLikePress(Posts.key)}}>
                    <AntDesign name={isLiked ? "heart" : "hearto"} 
                        style={[styles.AntDesign,{color:isLiked ? "#337954" : null}]}
                    />
                    <Text style={[styles.InteractionText,{color:isLiked ? "#337954" : null}]}>
                        {likeCount} Thích
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.InteractionButton} onPress={() => {onCommentPress(Posts.key,commentData)}}>
                    <CommentIcon name="comment" style={styles.commentIcon}/>
                    <Text style={[styles.InteractionText,{marginLeft:0}]}>{cmtCount} Bình luận</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    Card:{
        backgroundColor: "#E2E2E2",
        width:widthScreen,
        marginTop:10,
        // marginBottom: 20,
        borderRadius: 10,
    },
    UserInfo:{
        flexDirection:"row",
        justifyContent: "flex-start",
        padding:15
    },
    UserImg:{
        width:50,
        height:50,
        borderRadius:25
    },
    UserText:{
        flexDirection:"column",
        justifyContent:"center",
        marginLeft:10
    },
    UserName:{
        fontSize:14,
        fontWeight:"bold"
    },
    PostTime:{
        fontSize:12,
        color: "#666"
    },
    deleteContainer:{
        // backgroundColor:"red",
        width:195,
        justifyContent: "flex-start",
        alignItems:"flex-end",
        // padding:10
    },
    deleteButton:{
        width:30,
        height:30,
        justifyContent:"center",
        alignItems:"center",
        marginRight:5
    },
    deleteIcon:{
        fontSize:22
    },
    PostText:{
        fontSize:16,
        paddingLeft: 15,
        paddingRight: 15,
    },
    PostImg:{
        width:"100%",
        height: 250,
        // marginTop:15
    },
    InteractionWrapper:{
        flexDirection:"row",
        justifyContent:"space-around",
        padding:15
    },
    InteractionButton:{
        flexDirection:"row",
        alignItems:"center",
    },
    AntDesign:{
        fontSize:28,
    },
    InteractionText:{
        marginLeft:5,
        fontSize:12,
        color:"#333",
        fontWeight:"bold"
    },
    commentIcon:{
        fontSize:42
    },
    divider:{
        borderBottomColor: "#A9A9A9",
        borderBottomWidth: 1,
        width:"92%",
        alignSelf:"center",
        marginTop:5
    }
})

export default memo(PostItem) 