import React, {useState, createRef, useContext} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Back from 'react-native-vector-icons/Ionicons';
import Loading from '../components/Loading';

const bg_image = 'https://s2.best-wallpaper.net/wallpaper/iphone/1807/Red-rose-green-leaves-water-drops_iphone_1080x1920.jpg';
const SignUp = ({props,navigation}) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
 
  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const {signUp,errorText,isLoading,userInfo} = useContext(AuthContext)
  // const [
  //   isRegistraionSuccess,
  //   setIsRegistraionSuccess
  // ] = useState(isRegistered);
  
  if (userInfo.token) {
    // navigation.navigate('Home')
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#307ecc',
          justifyContent: 'center',
        }}>
        <Text style={styles.successTextStyle}>
          Đăng ký thành công!
        </Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => {
            navigation.navigate('Home')
          }}>
          <Text style={styles.buttonTextStyle}>Đến trang chủ</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{flex: 1}}>
      {/* {userInfo.token ? navigation.navigate('Home') : null} */}
      <Loading loading={isLoading}/>
      <Image
            source={{uri: bg_image}}
            style={StyleSheet.absoluteFill}
            blurRadius={80}
        />
    <TouchableOpacity style={{justifyContent:"center",marginTop:StatusBar.currentHeight}}
        onPress={() => navigation.goBack()}
    >
        <Back name="arrow-back" style={{fontSize:35,marginLeft:10,color:"white"}}/>
    </TouchableOpacity>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <KeyboardAvoidingView enabled>
          <View style={{alignItems:"center",marginBottom:80}}>
              <Text style={{fontWeight:"700",fontSize:45,color:"#7DE24E"}}>PlantSolver</Text>
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserName) => setUserName(UserName)}
              underlineColorAndroid="#f000"
              placeholder="Enter Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current &&
                passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPassword) =>
                setUserPassword(UserPassword)
              }
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={() =>
                ageInputRef.current &&
                ageInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          {errorText != '' ? (
            <Text style={styles.errorTextStyle}>
              {errorText}
            </Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={() => signUp(userName,userEmail,userPassword)}>
            <Text style={styles.buttonTextStyle}>Đăng ký</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default SignUp;
 
const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 50,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    fontSize:20
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
    fontSize:20
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});