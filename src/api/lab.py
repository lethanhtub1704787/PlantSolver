from flask import Flask,session, request, redirect,jsonify
from firebase_config import firebase
import json
db = firebase.database()

# auth = firebase.auth()

# email = "test@gmail.com"
# password = "123456"
# user = auth.sign_in_with_email_and_password(email,password)
# def get_password_by_email(email):
#     data = db.child("PlantSolver").child("Users").order_by_child("email").equal_to(email).get()
#     data = data.val()
#     key = list(data)
#     key = key[0]
#     password = db.child("PlantSolver").child("Users").child(key).child("password").get()
#     password = password.val()
#     return password

# pw = get_password_by_email("abc@gmail.com")

# print(pw)



# all_id = db.child("PlantSolver").child("Plants").order_by_key().get()
#     all_id = all_id.val()
#     latest_id = list(all_id)[-1]
#     id_path = db.child("PlantSolver").child("Plants").child(latest_id).get()
#     return id_path.val()['id']


# def get_post_by_ID(id):
#     data =  db.child("PlantSolver").child("Posts").order_by_child("id").equal_to(id).get()
#     key = list(data.val())[0]
#     return data.val(),key

def get_post_by_id():
    data =  db.child("PlantSolver").child("Posts").get()
    post_Data = ODict_to_Json(data)
    for ea in post_Data:
        print(ea)
    # return data.val()

def get_info_by_userId(id):
    data =  db.child("PlantSolver").child("Users").child().get()
    data = data.val()
    return data

def ODict_to_Json(ODict):
    ODict = ODict.val()
    ODict = ODict.values()
    toJSON = list(ODict)
    return toJSON

def merge_two_dicts(x, y):
    z = x.copy()   
    z.update(y)    
    return z


def getLikeAndComment_Count():
    likedArray = []
    data =  db.child("PlantSolver").child("Posts").get()
    postData = ODict_to_Json(data)
    for index,ea in enumerate(postData):
        key = data[index].key()
        userLiked = ea['liked']
        likedArray.append({key: {"liked" :userLiked}})
    return likedArray
    # return data.val()
# "-NI8sFpXStSu59wqE0y_"
# array = getLikeAndComment_Count()
# print(array[0])
# print(len((array[0]['-NI8sFpXStSu59wqE0y_']['liked'])))



def toggleLike(postID,userID): #set post like or unlike
    check = db.child("PlantSolver").child("Posts").child(postID).child("liked").child(userID).get()
    check = check.val()
    if(not check):
        likeID = {userID: True}
        return db.child("PlantSolver").child("Posts").child(postID).child("liked").update(likeID)
    else:
        return db.child("PlantSolver").child("Posts").child(postID).child("liked").child(userID).remove()
# toggleLike("-NItz6G2UxJYAHtvRaFk","Tony")


def get_Post_CommentCount(postID): #get num of post like
    likedList = db.child("PlantSolver").child("Comments").child(postID).get()
    likedList = likedList.val()
    if(not likedList): 
        return 0
    else:
        return len(likedList)

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
# print(merge_Posts_Users())

def addComment(postID,commentID,userID,message,timeStamp):
    data = {
        "message": message,
        "timeStamp": timeStamp,
        "uid": userID
    }
    return db.child("PlantSolver").child("Comments").child(postID).child(commentID).set(data)

def change_password(userID,newPass):
    key = db.child("PlantSolver").child("Users").order_by_child("email").equal_to(userID).get()
    key = key.val()
    key = list(key)[0]
    return db.child("PlantSolver").child("Users").child(key).update({"password":newPass})
    # return db.child("PlantSolver").child("Users").child(key).child("password").set(newPass)
# print(change_password("Tony","111"))

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

# count_user_like("Tony")
# print(count_user_like("Tony"))

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

update_name("tu","TUUUUUUUUUU")
# update_avatar("tu","https://cdnimg.vietnamplus.vn/uploaded/mzdic/2022_04_19/ronaldo1904.jpg")
# addComment("-NI8sFpXStSu59wqE0y_","newComment","tu","new message","new time")

# print(get_Post_CommentCount("-NI8sFpXStSu59wqE0y_"))

# print(merge_Posts_Users())



# check_mail =  db.child("PlantSolver").child("Users").order_by_child("email").equal_to("tu").get()
# check_mail = check_mail.val() # this is OrderedDict
# check_mail = check_mail.values() # this is ODict Value

# data = list(check_mail)
# toJSON = json.dumps(list(check_mail))
# data = json.loads(toJSON)
# items = list(check_mail.items()) # convert to list
# list = list(check_mail.val())
# print(ODict_to_Json(check_mail))
# print(data[0]['info']['name'])


# print(get_info_by_userId("tu"))

# db.child("PlantSolver").child("Test").push(user)

# data,key = get_post_by_ID(4)
# print(key)
# email="abc@gmail.com"
# check_mail =  db.child("PlantSolver").child("Users").order_by_child("email").equal_to(email).get()
# mail_exist = check_mail.val()
# print(mail_exist)
# if(not mail_exist):
#     print("true")
# else:
#     print("false")

# data =  db.child("PlantSolver").child("Users").child(1).get()
# data = data.val()
# print(data)

# all_id = db.child("PlantSolver").child("Users").shallow().get()
# all_id = all_id.val()
# if(all_id==""):
#     print("empty")
# print(all_id)
# latest_id = int(list(all_id)[-1])
# print("latest id:",type(latest_id))

# latest_id = list(all_id)[-1]
# print(latest_id)
# for i in range(1,5):
#     db.child("PlantSolver").child("Users").child(i).set(user)
# db.child("PlantSolver").child("Users").child().remove()
# db.child("PlantSolver").child("Users").child(1).set(user)



# db.child("PlantSolver").child("Users").push(user)

############################# check email exist
# check_mail =  db.child("PlantSolver").child("Users").order_by_child("email").equal_to("tu@gmail.com").get()
# data = check_mail.val()

# # print(type(data))
# if(not data):
#     print("not found")
# else:
#     print(data)


############################# how request.json retrieve data
# data = request.json
# data = data['info'].get('name')
# # email = data.email
# return str(data)