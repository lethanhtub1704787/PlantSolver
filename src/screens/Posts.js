import React, { useContext, useEffect, useState } from "react";
import { View,Text,SafeAreaView,StyleSheet,StatusBar,TouchableOpacity, TextInput,Image,Dimensions,FlatList, Alert } from "react-native";
import firebaseConfig from "../components/firebase";
import {initializeApp} from "firebase/app"
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommentIcon from 'react-native-vector-icons/EvilIcons'
import {getDatabase,ref,onValue,get,push,set,child, equalTo,query,orderByChild,remove,update} from "firebase/database"
import CommentModal from "../components/UserPosts/CommentModal";
import Loading from "../components/Loading";
import PostHeader from "../components/PostHeader";
import { AuthContext } from "../context/AuthContext";

import 'moment/locale/vi'
const moment = require("moment")
const widthScreen = Dimensions.get("window").width
initializeApp(firebaseConfig)

const Posts = ({navigation}) => {
    const {userInfo} = useContext(AuthContext)
    const [postData,setpostData] = useState("")

    const [cmtVisible,setcmtVisible] = useState(false)
    const [isCmtLoading,setisCmtLoading] = useState(false)
    const [commentData,setcommentData] = useState([])
    const [postId,setpostId] = useState('')

    const [isLoading,setisLoading] = useState(true)
    const [itemUserName,setitemUserName] = useState('')

    const [likeCount,setlikeCount] = useState(0)
    const reference = ref(getDatabase(), 'PlantSolver/Posts');
    // moment.locale('vi');
    useEffect(() => {
        getPostData()
    }, [])

    const getPostData = async () => {
        console.log("rendering")
        onValue(reference, async (snapshot) => {
            let data = []
            snapshot.forEach(function(childSnapshot) {
                let key = childSnapshot.key;
                let childData = childSnapshot.val();
                let finalData = Object.assign(childData, {key: key});
                data.push(finalData);
            })
            // let finalPostData = await getCmtData(data) 
            console.log("re-rendering")
            setpostData(data.reverse());
            // setpostData(finalPostData.reverse());
        }
        // ,{
        //     onlyOnce: true
        // }
        )
        setisLoading(false)
    }

    const updateComment = (data) => {
        setcommentData([...commentData, data]);
    }

    // const getLikeCount = (postId) => {
    //     const post_ref = ref(getDatabase(), 'PlantSolver/Posts/'+ postId); // get post ref
    //     let count = 0
    //     get(child(post_ref,"/liked")).then((snapshot) => {
    //         // console.log(snapshot.val())
    //         snapshot.forEach((ea) => {
    //             count++
    //         })
          
    //         // console.log(count)
    //     })
    //     setlikeCount(count)
    // }

    const like_handle = async (item) =>{
        if(!userInfo){
            alert("Bạn cần đăng nhập")
            return
        }
        // updateLike(item.key)

        let postId = item.key
        // getLikeCount(postId)
        console.log("post id:",postId)
        const post_ref = ref(getDatabase(), 'PlantSolver/Posts/'+ postId); // get post ref
        get(child(post_ref,`/liked/${userInfo.userId}`)).then((snapshot) => {
            const liked = snapshot.val() // get liked or not (true or false)
            console.log("liked read:",liked)
            get(child(post_ref,"/likeCount")).then((snapshot) => {
                let likeCount = Number(snapshot.val())
                liked ? likeCount-- : likeCount++

                const updates = {};
                updates[`liked/${userInfo.userId}`] = liked ? false : true
                updates[`likeCount`] = likeCount
                // listRemove(item)
                update(post_ref,updates);
                // console.log(value)
            })
        })
    }
    const updateLike = (key) => {
        let uid = userInfo.userId
        let data = [...postData]
        // console.log("before update:",data)
        let objIndex = data.findIndex((obj => obj.key == key));
        let isLiked = data[objIndex]['liked'][userInfo.userId] ? true : false
        let toAssign = {
            [uid]: isLiked ? false : true
        }
        let assignData = Object.assign(data[objIndex]['liked'], toAssign);
        data[objIndex]['liked'] = assignData //  insert new user like
        let like_count = data[objIndex]['likeCount']
        data[objIndex]['likeCount'] = isLiked ? like_count-- : like_count++ // update like count
        console.log("like updated")

        setpostData(data)
    }

    const addComment = async (cmtInputText) => {
        let thisTime = moment().format()
        const commentPostRef = ref(getDatabase(), 'PlantSolver/Comments/'+postId);
        const newCommentKey = push(commentPostRef).key;
        const data_to_Update = {
            uid: userInfo.userId,
            name: userInfo.name,
            avatar: userInfo.avatar,
            message: cmtInputText,
            timeStamp: thisTime,
            key: newCommentKey,
        }
        updateComment(data_to_Update)
       
        const commentData = {
            uid: userInfo.userId,
            message: cmtInputText,
            timeStamp: thisTime
        };
        const updates = {};
        updates[newCommentKey] = commentData;       
        // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
        await update(commentPostRef, updates)
        
        const post_ref = ref(getDatabase(), 'PlantSolver/Posts/'+ postId); // get post ref
        get(child(post_ref,"/cmtCount")).then((snapshot) => {
            let cmtCount = Number(snapshot.val())
            cmtCount++
            const updates = {};
            updates['cmtCount'] = cmtCount
            // listRemove(item)
            return update(post_ref,updates);
            // console.log(value)
        })

     

    }

    // function getCommentCount(postId){
    //     var count=0
    //     const cmt_ref = ref(getDatabase(), 'PlantSolver/Comments/');
    //     get(child(cmt_ref,postId)).then((snapshot) => {
    //         snapshot.forEach((childSnapshot) => {
    //             console.log(childSnapshot.val())
    //             count++
    //             console.log(count)
    //         })
    //         return count
    //     })
    // }

    const onSendCommentPress = async (cmtInputText) => {
        setisCmtLoading(true)
        await addComment(cmtInputText)
        setisCmtLoading(false)
    }

    async function getUserInfo(id){ // using Firebase querry
        var obj = {
            name:"",
            avatar:""
        }
        const target_ref = ref(getDatabase(), 'PlantSolver/Users');
        // console.log("id to finddd:",id)
        const name = query(target_ref, orderByChild('email'),equalTo(id));
        let snapshot = await get(name).catch((error) => {console.error(error)});
        if (snapshot.exists()) {
            // console.log("user snapshot:",snapshot.val())
            let data
            if(snapshot.val()[0]!=undefined){
                data = snapshot.val()[0]
            }else{
                data = snapshot.val()[1]
            }
            // console.log("snapshot.val()[1]",snapshot.val()[1])
            let username = data['info']['name']
            let avatar = data['info']['avatar']
            obj.name = username
            obj.avatar = avatar
            
        } else {
            console.log("No data available");
        }
        return obj
    }

    async function getCmtData(array){
        let data = []
        console.log("getting user info")
        for(const item of array){
            let userInfo = await getUserInfo(item.uid)
            let toPush = Object.assign(item, { avatar: userInfo.avatar, name: userInfo.name})
            data.push(toPush)
            // console.log(data)
        }
        return data
    }

    const comment_handel = async (picked_postId) => {
        setcmtVisible(true)
        setisCmtLoading(true)
        setpostId(picked_postId)
        const commentRef = ref(getDatabase(), 'PlantSolver/Comments/');
        const snapshot = await get(child(commentRef,picked_postId)).catch((err) => console.log(err))
        let data = []
        snapshot.forEach((childSnapshot) =>{
            let key = childSnapshot.key;
            let childData = childSnapshot.val();    
            let finalData = Object.assign(childData, { key: key}) //asign the key to item
            data.push(finalData);
        })
        console.log("comment list:",data)
        let finalData = await getCmtData(data) //to asign user info to data
        // console.log("Done")
        setcommentData(finalData)
        setisCmtLoading(false)
    }

    const delete_post = async (itemID) => {
        let data = [...postData]
      
        let objIndex = data.findIndex((obj => obj.key == itemID)) //find item index
      
        if (objIndex > -1) { 
            data.splice(objIndex, 1); // remove item index
        }
        console.log("after: ",data)
        setpostData(data)

        let removePost_ref =  ref(getDatabase(), 'PlantSolver/Posts'+ '/' + itemID);
        let removeCmtPost_ref =  ref(getDatabase(), 'PlantSolver/Comments'+ '/' + itemID);
        await remove(removePost_ref)
        await remove(removeCmtPost_ref)
    }

    const delete_handle = (itemID) => {
        Alert.alert(
            'Bạn có muốn xóa bài viết?',
            itemID,
            [
              {
                text: 'Xác nhận',
                onPress: () => {
                    delete_post(itemID)
                    alert(
                        "Đã xóa bài viết!"
                      );
                    // setTimeout(() => {
                        
                    //   }, 1000);
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
    }

    const handle_AddPost = () => {

        userInfo ? navigation.navigate("AddPost",{
            userId: userInfo.userId,
            name: userInfo.name,
            avatar: userInfo.avatar,
        })
        : alert("Bạn cần đăng nhập để đăng bài!")
    }
    
    function getCurrentTime(timeStamp){
        moment.locale('vi');
        let time = moment(timeStamp).fromNow()
        return time
    }

    async function getNameById(uid){
        const target_ref = ref(getDatabase(), 'PlantSolver/Users');
        const name = query(target_ref, orderByChild('email'),equalTo(uid));
        let snapshot = await get(name).catch((error) => {console.error(error)});
        console.log(snapshot.val())
        let data
        if(snapshot.val()[0]!=undefined){
            data = snapshot.val()[0]
        }else{
            data = snapshot.val()[1]
        }
        // console.log("snapshot.val()[1]",snapshot.val()[1])
        let username = data['info']['name']
        return username
    }

    const renderItem = ({item}) => {
        // getNameById(item.uid)
        // getName_byUserID(item.uid)
        // getLikeCount(item.key)
        // console.log("re-render flatlist")
        return(
            <View style={styles.Card}>
                <View style={styles.UserInfo}>
                    {item.avatar ? (
                        <Image style={styles.UserImg} 
                            source={{uri: item.avatar}}
                        />
                    ) :
                        (
                        <Image style={styles.UserImg} 
                            source={require('../../assets/icons/user.png')}
                        />
                        )
                    }
                    <View style={styles.UserText}>
                        <Text style={[styles.UserName,{color: userInfo.userId == item.uid ? "red" : null}]} > {item.uid}</Text>
                        <Text style={styles.PostTime}> {getCurrentTime(item.timeStamp)}</Text>
                    </View>
                    {
                        userInfo.userId == item.uid ? (
                            <View style={styles.deleteContainer}>
                                <TouchableOpacity onPress={() => {delete_handle(item.key)}} style={styles.deleteButton}>
                                    <View>
                                        <AntDesign name="closecircleo" style={styles.deleteIcon}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ) : null
                    }
                
                </View>

                <Text style={styles.PostText}>{item.content}</Text>
                {
                    item.image ? (
                        <Image style={styles.PostImg}
                            // source={require('../../assets/icons/street.png')}
                            source={{uri: item.image}}
                            // source={item.image}
                        />
                    ) : 
                    // null
                    <View style={styles.divider}></View>
                    // <Image style={styles.PostImg}
                    //     source={require('../../assets/icons/street.png')}
                    // />
                }
           
                <View style={styles.InteractionWrapper}>
                    <TouchableOpacity style={styles.InteractionButton} onPress={() => like_handle(item)}>
                        <AntDesign name={item.liked[userInfo.userId] ? "heart" : "hearto"} 
                            style={[styles.AntDesign,{color:item.liked? item.liked[userInfo.userId] ? "blue" : null : null}]}
                        />
                        <Text style={[styles.InteractionText,{color:item.liked? item.liked[userInfo.userId] ? "blue" : null : null}]}>{item.likeCount} Thích</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.InteractionButton} onPress={() => comment_handel(item.key)}>
                        <CommentIcon name="comment" style={styles.commentIcon}/>
                        <Text style={[styles.InteractionText,{marginLeft:0}]}>{item.cmtCount} Bình luận</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
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
            onSendCommentPress={onSendCommentPress}
        />
        <View style={{marginTop:StatusBar.currentHeight}}>
            <PostHeader 
                navigation={navigation}
                onAddPostPress={() => handle_AddPost()}         
            />
            {/* <CustomHeader title="Bài viết" isBack={false} navigation={navigation}/> */}
        </View>
            <View style={styles.container}>
                <FlatList
                    data={postData}
                    renderItem={renderItem}
                    // keyExtractor={item => `key-${item.id}`}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#FFF",
        alignItems:"center",
        // padding:10,
    },
    Card:{
        backgroundColor: "#f8f8f8",
        width:widthScreen,
        marginBottom: 20,
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
        fontSize:14,
        paddingLeft: 15,
        paddingRight: 15,
    },
    PostImg:{
        width:"100%",
        height: 250,
        marginTop:15
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
        borderBottomColor: "#dddddd",
        borderBottomWidth: 1,
        width:"92%",
        alignSelf:"center",
        marginTop:5
    }
  });

export default Posts;