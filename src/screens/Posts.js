import React, { useContext, useEffect, useState } from "react";
import { View,Text,SafeAreaView,StyleSheet,StatusBar,TouchableOpacity, TextInput,Image,Dimensions,FlatList, Alert } from "react-native";
import CustomHeader from "../components/CustomHeader";
import firebaseConfig from "../components/firebase";
import {initializeApp} from "firebase/app"
import LikeIcon from 'react-native-vector-icons/AntDesign'
import CommentIcon from 'react-native-vector-icons/EvilIcons'
import {getDatabase,ref,onValue,get,push,set,child, equalTo,query,orderByChild} from "firebase/database"
import CommentModal from "../components/UserPosts/CommentModal";
import Loading from "../components/Loading";
import PostHeader from "../components/PostHeader";
import { AuthContext } from "../context/AuthContext";
const widthScreen = Dimensions.get("window").width
initializeApp(firebaseConfig)
const moment = require("moment")


const Posts = ({navigation}) => {
    const {userInfo} = useContext(AuthContext)
    const [postData,setpostData] = useState("")
    const [cmtVisible,setcmtVisible] = useState(false)
    const [cmtData,setcmtData] = useState('')
    const [cmtPostId,setcmtPostId] = useState('')
    const [isLoading,setisLoading] = useState(true)
    const [itemUserName,setitemUserName] = useState('')
    const reference = ref(getDatabase(), 'PlantSolver/Posts');

    useEffect(() => {
        onValue(reference, (snapshot) => {
            let data = []
            snapshot.forEach(function(childSnapshot) {
                let key = childSnapshot.key;
                let childData = childSnapshot.val();
                let finalData = Object.assign(childData, {key: key});
                data.push(finalData);
            })
            setpostData(data);
        }
        // ,{
        //     onlyOnce: true
        // }
        )
        setisLoading(false)
    }, [])

    const comment_handel = (postId) => {
        setcmtPostId(postId)
        setcmtVisible(true)
    }

    const like_handle = (itemID) =>{
        // find the item with itemID then change the {liked} status
        // if liked = false: {increase num of likes by 1 , change status to true}
        // else: {decrease num of likes by 1 , change status to false}

        // const postData = {
        //     user: itemID.userName,
        //     uid: uid,
        //     body: body,
        //     title: title,
        //     starCount: 0,
        //     authorPic: picture
        //   };

    }

    const getName_byUserID = (id) => { // using Firebase querry
        const target_ref = ref(getDatabase(), 'PlantSolver/Users');
        const name = query(target_ref, orderByChild('email'),equalTo(id));
        get(name).then((snapshot) => {
        if (snapshot.exists()) {
            let name = snapshot.val()[0]['info']['name']
            setitemUserName(name)
            // console.log(typeof(snapshot.val()))
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        console.error(error);
        });
    }

    const handle_AddPost = (userInfo) => {
        // getName_byUserID(userInfo.userId)
        userInfo ? navigation.navigate("AddPost",{
            userId: userInfo.userId,
            name: userInfo.name,
            avatar: userInfo.avatar,
        })
        : alert("Bạn cần đăng nhập để đăng bài!")
    }


    renderItem = ({item}) => {
        getName_byUserID(item.uid)
        return(
            <View style={styles.Card}>
                <View style={styles.UserInfo}>
                    <Image style={styles.UserImg} 
                        source={require('../../assets/icons/user.png')}
                        // source={item.userImg}
                    />
                    <View style={styles.UserText}>
                        <Text style={styles.UserName} > {itemUserName}</Text>
                        <Text style={styles.PostTime}> {moment(item.timeStamp).fromNow()}</Text>
                    </View>
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
                    <TouchableOpacity style={styles.InteractionButton} onPress={() => like_handle(item.id)}>
                        <LikeIcon name={item.liked ? "heart" : "hearto"} 
                            style={[styles.likeIcon,{color:item.liked ? "blue" : null}]}
                        />
                        <Text style={[styles.InteractionText,{color:item.liked ? "blue" : null}]}>{item.likeCount} Thích</Text>
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
        <View style={{marginTop:StatusBar.currentHeight}}>
            <PostHeader 
                navigation={navigation}
                onAddPostPress={() => handle_AddPost(userInfo)}         
            />
            {/* <CustomHeader title="Bài viết" isBack={false} navigation={navigation}/> */}
        </View>
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={postData}
                    renderItem={renderItem}
                    // keyExtractor={item => `key-${item.id}`}
                />
            </SafeAreaView>
            <CommentModal
                isVisible={cmtVisible}
                onClose={() => setcmtVisible(false)}
                postId={cmtPostId}
            />
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
    likeIcon:{
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