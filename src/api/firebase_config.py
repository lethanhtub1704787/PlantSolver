import pyrebase
from Crypto.Cipher import AES 

config = {
  "apiKey": "AIzaSyDlD2RPi05_cfmrwr4aHezS82qZWCKmikM",
  "authDomain": "plants-solver.firebaseapp.com",
  "databaseURL": "https://plants-solver-default-rtdb.firebaseio.com",
  "projectId": "plants-solver",
  "storageBucket": "plants-solver.appspot.com",
  "messagingSenderId": "31539596907",
  "appId": "1:31539596907:web:80cee8e559e100af78ab2e",
  "measurementId": "G-L0N5H9J32Q"
}

firebase = pyrebase.initialize_app(config)
