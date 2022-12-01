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

info = { ############## push user data
    "name":"tu",
    "birthday":"",
    "address":"",
    "avatar":"",
}
user = {
    "id":1,
    "email":"tu@gmail.com",
    "password":"12345",
    "info":info,
}

def get_post_by_ID(id):
    data =  db.child("PlantSolver").child("Posts").order_by_child("id").equal_to(id).get()
    key = list(data.val())[0]
    return data.val(),key

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
    z = x.copy()   # start with keys and values of x
    z.update(y)    # modifies z with keys and values of y
    return z

def get_Post_LikeCount(id):


def merge_Posts_Users():
    final_post_data = []
    data = db.child("PlantSolver").child("Posts").get()
    post_Data = ODict_to_Json(data)
    # print(post_Data)
    for index,user in enumerate(post_Data):
        key = data[index].key()
        
        data_with_key_merge = merge_two_dicts(user,{"key":key})
        # print(merge_key)
        uid = user['uid']

        userInfo = db.child("PlantSolver").child("Users").order_by_child("email").equal_to(uid).get()
        userInfo = ODict_to_Json(userInfo)[0]
        userInfo.pop('password', None)

        mergeData = merge_two_dicts(data_with_key_merge,userInfo)
        final_post_data.append(mergeData)
        # print(mergeData)
    print(final_post_data)
    return final_post_data
merge_Posts_Users()
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