from flask import Flask,session, request, redirect,jsonify
from firebase_config import firebase
from flask_bcrypt import Bcrypt
import pyrebase
import json
import os
import my_predict as my_pred
from keras import models



db = firebase.database()
storage = firebase.storage()
target = "PlantSolver"

# auth = firebase.auth()

# email = "test@gmail.com"
# password = "123456"
# user = auth.sign_in_with_email_and_password(email,password)

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
    # all_id = db.child("PlantSolver").child("Plants").order_by_key().get()
    # all_id = all_id.val()
    # latest_id = list(all_id)[-1]
    # id_path = db.child("PlantSolver").child("Plants").child(latest_id).get()
    # return id_path.val()['id']
    all_id = db.child("PlantSolver").child("Users").shallow().get()
    all_id = all_id.val()
    latest_id = int(list(all_id)[-1])
    return latest_id

def upload_and_getUrl(image):
    storage.child(target).child(image).put(image)
    # url = storage.child(target).child(image).get_url(user['idToken'])
    url = storage.child(target).child(image).get_url()
    return url

def ODict_to_Json(data):
    data = data.val()
    data = data.values()
    toJSON = list(data)
    return toJSON


app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config['UPLOAD_FOLDER'] = "images_upload"
app.secret_key="123456abc"
#get all
@app.route('/get',methods=['POST','GET'])
def get_all():
    try:
        data = db.child("PlantSolver").child("Plants").get()
        data = ODict_to_Json(data)
        return data, 200
    except Exception as e:
        return f"Error: {e}"

#get all
@app.route('/get/<id>',methods=['GET'])
def get_by_id(id):
    try:
        _id = int(id)
        data =  db.child("PlantSolver").child("Plants").order_by_child("id").equal_to(_id).get()
        data = ODict_to_Json(data)
        return data, 200
    except Exception as e:
        return "Not found"

#get by name
@app.route('/get_name/<name>',methods=['GET'])
def get_by_name(name):
    try:
        _name = str(name)
        data =  db.child("PlantSolver").child("Plants").order_by_child("name").equal_to(_name).get()
        data = ODict_to_Json(data)
        return data, 200
        # return _name
    except Exception as e:
        return f"Error: {e}"


#login
# @app.route('/likePost',methods=['POST'])
# def login():
#     try:
#         email = request.json['email']
#         password = request.json['password']
#         check_mail =  db.child("PlantSolver").child("Users").order_by_child("email").equal_to(email).get()
#         mail_exist = check_mail.val()
#         if(not mail_exist):
#             return jsonify({"error": "Email không tồn tại"})
#         check_password = get_password_by_email(email)
#         if(password != check_password):
#             return jsonify({"error": "Sai mật khẩu"})
#         user = "im_user"
#         return jsonify({"success": True,"user":user,"token":"abc123"}),200
#     except Exception as e:
#         return f"Error: {e}"
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
                "name": name,
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
            # db.child("PlantSolver").child("Users").child(i).set(user)
            db.child("PlantSolver").child("Users").push(user_data)

            return jsonify({"success": True,"user":user_data,"token":"abc123"}),200
        else:
            return jsonify({"error": "This email exist"})
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
        userInfo = ODict_to_Json(check_mail)
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
    app.run(host="0.0.0.0")
    # app.run(host="0.0.0.0",port=3000,debug=false)