from flask import Flask,session, request, redirect,jsonify
from firebase_config import firebase
import json
db = firebase.database()
storage = firebase.storage()


def get_key_by_name(name):
    data = db.child("PlantSolver").child("Plants").order_by_child("name").equal_to(name).get()
    data = data.val()
    key = list(data)
    return key[0]

def get_password_by_email(email):
    data = db.child("PlantSolver").child("Users").order_by_child("email").equal_to(email).get()
    data = data.val()
    key = list(data)
    key = key[0]
    password = db.child("PlantSolver").child("Users").child(key).child("password").get()
    password = password.val()
    return password

def get_latest_id():
    all_id = db.child("PlantSolver").child("Users").shallow().get()
    all_id = all_id.val()
    latest_id = int(list(all_id)[-1])
    return latest_id

def upload_and_getUrl(image):
    storage.child("PlantSolver").child(image).put(image)
    # url = storage.child(target).child(image).get_url(user['idToken'])
    url = storage.child("PlantSolver").child(image).get_url()
    return url

def ODict_to_Json(ODict):
    ODict = ODict.val()
    ODict = ODict.values()
    toJSON = list(ODict)
    return toJSON

def merge_two_dicts(x, y):
    z = x.copy()   
    z.update(y)    
    return z

def get_Post_LikeCount(postID): #get num of post like
    likedList = db.child("PlantSolver").child("Posts").child(postID).child("liked").get()
    likedList = likedList.val()
    if(not likedList): 
        return 0
    else:
        return len(likedList)
# get_Post_LikeCount("-NI8sFpXStSu59wqE0y_")

def get_Post_CommentCount(postID): #get num of post like
    likedList = db.child("PlantSolver").child("Comments").child(postID).get()
    likedList = likedList.val()
    if(not likedList): 
        return 0
    else:
        return len(likedList)
# print(get_Post_CommentCount("-NI8sFpXStSu59wqE0y_"))

def toggleLike(postID,userID): #set post like or unlike
    check = db.child("PlantSolver").child("Posts").child(postID).child("liked").child(userID).get()
    check = check.val()
    if(not check):
        likeID = {userID: True}
        return db.child("PlantSolver").child("Posts").child(postID).child("liked").update(likeID)
    else:
        return db.child("PlantSolver").child("Posts").child(postID).child("liked").child(userID).remove()
# toggleLike("-NI8sFpXStSu59wqE0y_","tu")

def merge_Posts_Users():
    final_post_data = []
    data = db.child("PlantSolver").child("Posts").get()
    post_Data = ODict_to_Json(data)
   
    for index,post in enumerate(post_Data):
        key = data[index].key() #get father key
        data_with_key_merge = merge_two_dicts(post,{"key":key}) #put key to object
        cmtCount = get_Post_CommentCount(key)
        data_with_cmtCount_merge = merge_two_dicts(data_with_key_merge,{"cmtCount":cmtCount})
        uid = post['uid'] #get user id
       
        userInfo = db.child("PlantSolver").child("Users").order_by_child("email").equal_to(uid).get()
        userInfo = ODict_to_Json(userInfo)[0] #get user info
        userInfo.pop('password', None) #take out the password

        mergeData = merge_two_dicts(data_with_cmtCount_merge,userInfo) #put user info to object
        final_post_data.append(mergeData) #put object to array
    
    return final_post_data #return final array data
# print(type(merge_Posts_Users()))


def get_posts_comments(postID):
    arrayData = []
    data = db.child("PlantSolver").child("Comments").child(postID).get()
    commentData = ODict_to_Json(data)
    # print(commentData)
    for index,comment in enumerate(commentData):
        key = data[index].key() #get father key
        data_with_key_merge = merge_two_dicts(comment,{"key":key}) #put key to object
       
        uid = comment['uid'] #get user id

        userInfo = db.child("PlantSolver").child("Users").order_by_child("email").equal_to(uid).get()
        userInfo = ODict_to_Json(userInfo)[0] #get user info
        userInfo.pop('password', None) #take out the password

        mergeData = merge_two_dicts(data_with_key_merge,userInfo) #put user info to object
        arrayData.append(mergeData) #put object to array
    # print("final data:",arrayData)
    return arrayData
# print(type(get_posts_comments("-NI8sFpXStSu59wqE0y_")))

def addComment(postID,commentID,userID,message,timeStamp):
    data = {
        "message": message,
        "timeStamp": timeStamp,
        "uid": userID
    }
    return db.child("PlantSolver").child("Comments").child(postID).child(commentID).set(data)

def change_password(userID,newPass):
    key = db.child("PlantSolver").child("Users").order_by_child("email").equal_to(userID).get()
    key = key.val() ## 
    key = list(key)[0] ## TO GET THE PARENT KEY
    return db.child("PlantSolver").child("Users").child(key).update({"password":newPass})

def count_user_post(userID):
    data = db.child("PlantSolver").child("Posts").order_by_child("uid").equal_to(userID).get()
    data = data.val()
    return len(data)

def count_user_like(userID):
    data = db.child("PlantSolver").child("Posts").order_by_child("uid").equal_to(userID).get()
    total = 0
    for ea in data:
        if("liked" in ea.val()):
            like = len(ea.val()['liked'])
            total += like
    return total

def PostLikeCount(userID):
    post = count_user_post(userID)
    like = count_user_like(userID)
    return {"post": post,"like": like}

def update_avatar(userID,avtURL):
    key = db.child("PlantSolver").child("Users").order_by_child("email").equal_to(userID).get()
    key = key.val()
    key = list(key)[0]
    return db.child("PlantSolver").child("Users").child(key).child("info").update({"avatar":avtURL})

def update_name(userID,name):
    key = db.child("PlantSolver").child("Users").order_by_child("email").equal_to(userID).get()
    key = key.val()
    key = list(key)[0]
    return db.child("PlantSolver").child("Users").child(key).child("info").update({"name":name})