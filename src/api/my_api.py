from flask import Flask,session, request, redirect,jsonify
from firebase_config import firebase
from flask_bcrypt import Bcrypt
import pyrebase
import json
import os
import my_predict as my_pred
from keras import models
import my_function as my_f
from pyngrok import ngrok
db = firebase.database()
# auth = firebase.auth()

# email = "test@gmail.com"
# password = "123456"
# user = auth.sign_in_with_email_and_password(email,password)


app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config['UPLOAD_FOLDER'] = "images_upload"
app.secret_key="123456abc"
#get all
@app.route('/get',methods=['POST','GET'])
def get_all():
    try:
        data = db.child("PlantSolver").child("Plants").get()
        data = my_f.ODict_to_Json(data)
        
        return data, 200
    except Exception as e:
        return f"Error: {e}"

#get all comments
@app.route('/getAllComment',methods=['GET'])
def getAllComment():
    try:
        _postID = str()
        data = my_f.get_posts_comments(_postID)
        if(data):
            return data, 200
        else:
            return jsonify({"status": False}), 200
    except Exception as e:
        return jsonify({"status": False})

#get all
@app.route('/get/<id>',methods=['GET'])
def get_by_id(id):
    try:
        _id = int(id)
        data =  db.child("PlantSolver").child("Plants").order_by_child("id").equal_to(_id).get()
        data = my_f.ODict_to_Json(data)
        return data, 200
    except Exception as e:
        return "Not found"

#get by name
@app.route('/get_name/<name>',methods=['GET'])
def get_by_name(name):
    try:
        _name = str(name)
        data =  db.child("PlantSolver").child("Plants").order_by_child("name").equal_to(_name).get()
        data = my_f.ODict_to_Json(data)
        return data, 200
        # return _name
    except Exception as e:
        return f"Error: {e}"

#get by name
@app.route('/getComment/<postID>',methods=['GET'])
def getComment(postID):
    try:
        _postID = str(postID)
        data = my_f.get_posts_comments(_postID)
        if(data):
            return jsonify({"status":True,"data":data}), 200
        else:
            return jsonify({"status": False}), 200
    except Exception as e:
        return jsonify({"status": False})

        #get by name
#get all
@app.route('/getPosts',methods=['GET'])
def get_Posts():
    try:
        data = my_f.merge_Posts_Users()
        return data, 200
    except Exception as e:
        return f"Error: {e}"

#get all
@app.route('/PostLikeCount/<uid>',methods=['GET'])
def PostLikeCount(uid):
    try:
        _uid = str(uid)
        data = my_f.PostLikeCount(_uid)
        return data, 200
    except Exception as e:
        return jsonify({"error":e})

 
# add new plant
# @app.route('/add',methods=['POST'])
# def add_new():
#     try:
#         latest_id = get_latest_id()
#         id =  latest_id + 1
#         data = {
#             "id": id,
#             "name": request.json['name'],
#             "genus": request.json['genus'],
#             "family": request.json['family'],
#             "order": request.json['order'],
#             "image": request.json['image'],
#             "info": request.json['info']
#         }
#         db.child("PlantSolver").child("Plants").push(data)
#         return jsonify({"success": True}), 200
#     except Exception as e:
#         return f"Error: {e}"

# @app.route('/addpost',methods=['POST'])
# def addPost():
#     try:
#         email = request.json['email']
#         password = request.json['password']
#         name = request.json['name']
#         check_mail =  db.child("PlantSolver").child("Users").order_by_child("email").equal_to(email).get()
#         mail_exist = check_mail.val()
#         if(not mail_exist):
#             user_data = {
#                 "email": email,
#                 "password":password,
#                 "name": name,
#             }
#             # info = {
#             #     "birthday": request.json['info']['birthday'],
#             #     "avatar": request.json['info']['avatar'],
#             #     "name": request.json['info']['name'],
#             #     "address": request.json['info']['address']
#             # }
#             # user_data = {
#             #     "email": email,
#             #     "password":password,
#             #     "info": info,
#             # }
#             # db.child("PlantSolver").child("Users").child(i).set(user)
#             db.child("PlantSolver").child("Users").push(user_data)

#             return jsonify({"success": True,"user":user_data,"token":"abc123"}),200
#         else:
#             return jsonify({"error": "This email exist"})
#     except Exception as e:
#         return f"Error: {e}"

#likePost
@app.route('/likePost',methods=['POST'])
def LikePost():
    try:
        postID = request.json['postID']
        userID = request.json['userID']
        # data = {
        #     "postID": postID,
        #     "userID": userID,
        # }
        # return jsonify(data),200
        my_f.toggleLike(postID,userID)
        return jsonify({"status":"like success"}),200
    except Exception as e:
        return jsonify({"status":"like failed"}),400

#add Comment
@app.route('/addComment',methods=['POST'])
def AddComment():
    try:
        postID = request.json['postID']
        commentID = request.json['commentID']
        userID = request.json['uid']
        message = request.json['message']
        timeStamp = request.json['timeStamp']
       
        check = my_f.addComment(postID,commentID,userID,message,timeStamp)
        if(check):
            return jsonify({"status":"Success"}),200
        else:
            return jsonify({"status":"add comment error"}),200
    except Exception as e:
        return jsonify({"error":e})


#signup
@app.route('/signup',methods=['POST'])
def signUp():
    try:
        email = request.json['email']
        password = request.json['password']
        name = request.json['name']
        check_mail =  db.child("PlantSolver").child("Users").order_by_child("email").equal_to(email).get()
        mail_exist = check_mail.val()
        if(not mail_exist):
            user_data = {
                "email": email,
                "password":password,
                "info": {"name":name, "avatar":""}
            }
            # info = {
            #     "birthday": request.json['info']['birthday'],
            #     "avatar": request.json['info']['avatar'],
            #     "name": request.json['info']['name'],
            #     "address": request.json['info']['address']
            # }
            # user_data = {
            #     "email": email,
            #     "password":password,
            #     "info": info,
            # }
          
            db.child("PlantSolver").child("Users").push(user_data)

            responseData = {
                "userId" : user_data['email'],
                "name" : user_data['info']['name'],
                "avatar" : user_data['info']['avatar']
            }   
            return jsonify({"status":True,"data":responseData}),200
        else:
            return jsonify({"status":False,"error": "Email đã tồn tại"})
    except Exception as e:
        return f"Error: {e}"

#login
@app.route('/login',methods=['POST'])
def login():
    try:
        email = request.json['email']
        password = request.json['password']
        check_mail =  db.child("PlantSolver").child("Users").order_by_child("email").equal_to(email).get()
        mail_exist = check_mail.val()
        if(not mail_exist):
            return jsonify({"error": "Email không tồn tại:"})
        userInfo = my_f.ODict_to_Json(check_mail)
        check_password = userInfo[0]['password']
        # check_password = get_password_by_email(email)
        if(password != check_password):
            return jsonify({"error": "Sai mật khẩu"})

        responseData = {
            "userId" : email,
            "name" : userInfo[0]['info']['name'],
            "avatar" : userInfo[0]['info']['avatar']
        }   
  
        return jsonify(responseData),200
    except Exception as e:
        return f"Error: {e}"

#change name
@app.route('/changeName',methods=['POST'])
def UpdateName():
    try:
        uid = request.json['userID']
        name = request.json['userName']
        my_f.update_name(uid,name)
        return jsonify({"response":"Cập nhật name thành công"}),200
    except Exception as e:
        return jsonify({"response":"Cập nhật name thất bại"}),400

#change password
@app.route('/updateAvatar',methods=['POST'])
def UpdateAvatar():
    try:
        avatar = request.json['avatar']
        uid = request.json['uid']
        my_f.update_avatar(uid,avatar)
        return jsonify({"response":"Cập nhật avatar thành công"}),200
    except Exception as e:
        return jsonify({"response":"Cập nhật avatar thất bại"}),400

#change password
@app.route('/changePassword',methods=['POST'])
def ChangePassword():
    try:
        uid = request.json['userID']
        oldPassword = request.json['oldPassword']
        newPassword = request.json['newPassword']
        check_mail =  db.child("PlantSolver").child("Users").order_by_child("email").equal_to(uid).get()
        # mail_exist = check_mail.val()
        # if(not mail_exist):
        #     return jsonify({"error": "Email không tồn tại:"})
        userInfo = my_f.ODict_to_Json(check_mail)
        check_password = userInfo[0]['password']
        # check_password = get_password_by_email(email)
        if(oldPassword != check_password):
            return jsonify({"Incorrect": True})

        my_f.change_password(uid,newPassword) 
  
        return jsonify({"response":"Cập nhật mật khẩu thành công"}),200
    except Exception as e:
        return jsonify({"error": e})

#predict
@app.route('/predict',methods=['POST','GET'])
def predict():
    image = request.files['image']
    name = image.filename
    image_path = app.config['UPLOAD_FOLDER'] + "/" + name
    image.save(image_path)
    type = os.path.splitext(name)[0]
    if(type == "flower"):
        model = flower_model
        classes = my_pred.flower_classes 
    else:
        model = fruit_model
        classes = my_pred.fruit_classes
    label = my_pred._predict(image_path,model,classes)   
    return label

if __name__ == '__main__':
    flower_model = models.load_model('models/flowers-model.h5')
    fruit_model = models.load_model('models/fruit-retrain-2.h5')
    # app.run(host="0.0.0.0")
    # url = ngrok.connect(5000).public_url
    # app.run(host="192.168.1.3",port=3000,debug=True)
    app.run(port=5000,debug=False)