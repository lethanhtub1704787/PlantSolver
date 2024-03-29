import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import { createContext,useState } from 'react'
import host from '../../assets/host'

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [isLoading,setisLoading] = useState(false)
    const [userInfo,setuserInfo] = useState('')
    const [errorText,setErrortext] = useState('')

    const signUp = (name,email,password,userRePassword) => {
        if (!name) {
            setErrortext('Xin hãy điền tên')
            return;
        }
        if (!email) {
            setErrortext('Xin hãy điền Email')
            return;
        }
        if (!password) {
            setErrortext('Xin hãy điền Mật khẩu')
            return;
        }
        if (!userRePassword) {
          setErrortext('Xin hãy nhập lại mật khẩu')
          return;
      }
        if (password!==userRePassword) {
          setErrortext('Nhập lại mật khẩu chưa đúng')
          return;
        }
        setisLoading(true)
        const dataToSend = {
            "name" : name,
            "email" : email,
            "password" : password
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        };
        fetch(`${host}/signup`, requestOptions)
        .then(response => response.json())
        .then(responseJson => {
            console.log("response signup: ",responseJson);
            setisLoading(false)
            if (responseJson.status) {
                setuserInfo(responseJson.data)
                save(JSON.stringify(responseJson.data))
              } else {
                setErrortext(responseJson.error);
                console.log('Please check your email id or password');
              }
        })
        .catch((error) => {
            setisLoading(false)
            console.error(error);
        });
    }

    const login = (email,password) => {
        // console.log("user info:",userInfo)
        if (!email) {
            setErrortext('Xin hãy điền Email')
            return;
        }
        if (!password) {
            setErrortext('Xin hãy điền Mật khẩu')
            return;
        }
        // console.log("email:",email)
        // console.log("password:",password)
        setisLoading(true)
        const dataToSend = {
            "email" : email,
            "password" : password
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        };
        fetch(`${host}/login`, requestOptions)
        .then(response => response.json())
        .then(responseJson => {
            console.log("response login: ",responseJson);  
            setisLoading(false)   
            if (responseJson.userId) {
                setuserInfo(responseJson)
                save(JSON.stringify(responseJson))
                console.log("loggin success")
              } else {
                setErrortext(responseJson.error);
                console.log('Please check your email id or password');
              }          
        })
        .catch((error) => {
            // console.log("response: ",responseJson);
            console.error(error);
            setisLoading(false)
        })
    }


    const save = async (userInfo) => {
        try{
          await AsyncStorage.setItem("userInfo",userInfo)
          load()
          console.log("saved new userinfo")
        }catch(err){
          alert(err)
        }
      }
    
    const load = async () => {
        try{
          let user = await AsyncStorage.getItem("userInfo")
          if (user !== null){
            console.log("loaded token:",user)
            let to_obj = JSON.parse(user)
            setuserInfo(to_obj)
          }else{
            console.log("token not found")
          }
        }catch(err){
          alert(err)
        }
      }
    
    const logout = async () => {
        try{
          await AsyncStorage.removeItem("userInfo")
          setuserInfo("")
          console.log("logged out:",userInfo)
        }catch(err){
          alert(err)
        }
      }


    useEffect(() => {
        load()
    }, []);


  return (
    <AuthContext.Provider value={{signUp,login,logout,save,isLoading,userInfo,errorText}}>
        {children}
    </AuthContext.Provider>    
  )
}

