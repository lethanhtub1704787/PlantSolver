from flask import Flask,session, request, redirect,jsonify
from firebase_config import firebase
import pyrebase
import json
import os
import my_predict as my_pred
from keras import models


db = firebase.database()

db = firebase.database()
storage = firebase.storage()
target = "PlantSolver"

auth = firebase.auth()

email = "test@gmail.com"
password = "123456"
user = auth.sign_in_with_email_and_password(email,password)

def data_to_json(data):
    return json.dumps(data.val())

def get_key_by_name(name):
    data = db.child("PlantSolver").child("Plants").order_by_child("name").equal_to(name).get()
    data = data.val()
    key = list(data)
    return key[0]

def get_latest_id():
    all_id = db.child("PlantSolver").child("Plants").order_by_key().get()
    all_id = all_id.val()
    latest_id = list(all_id)[-1]
    id_path = db.child("PlantSolver").child("Plants").child(latest_id).get()
    return id_path.val()['id']

def upload_and_getUrl(image):
    storage.child(target).child(image).put(image)
    url = storage.child(target).child(image).get_url(user['idToken'])
    return url

def ODict_to_Json(data):
    data = data.val()
    data = data.values()
    toJSON = json.dumps(list(data))
    data = json.loads(toJSON)
    return data

app = Flask(__name__)
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
        return "Not found"

# get by id
@app.route('/add',methods=['POST'])
def add_new():
    try:
        latest_id = get_latest_id()
        id =  latest_id + 1
        data = {
            "id": id,
            "name": request.json['name'],
            "genus": request.json['genus'],
            "family": request.json['family'],
            "order": request.json['order'],
            "image": request.json['image'],
            "info": request.json['info']
        }
        db.child("PlantSolver").child("Plants").push(data)
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"Error: {e}"

#predict
@app.route('/predict',methods=['POST','GET'])
def predict():
    # if(request.method == "POST"):
    #     bytesOfImage = request.get_data()
    #     img_path = 'images_upload/image.jpeg'
    #     with open(img_path, 'wb') as out:
    #         out.write(bytesOfImage)
    #     label = my_pred._predict(img_path,flower_model)
    #     return label
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
    # return jsonify({"image name": name})

if __name__ == '__main__':
    flower_model = models.load_model('models/flowers-model.h5')
    fruit_model = models.load_model('models/fruits-model.h5')
    app.run(host="192.168.1.7",port=3000,debug=True)