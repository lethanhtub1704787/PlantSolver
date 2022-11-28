import React, {useState, createRef, useContext} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar
} from 'react-native';
 
import { AsyncStorage } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import Loading from '../components/Loading';
import Back from 'react-native-vector-icons/Ionicons';
import host from '../../assets/host';
import { AuthContext } from '../context/AuthContext';


const bg_image = 'https://s2.best-wallpaper.net/wallpaper/iphone/1807/Red-rose-green-leaves-water-drops_iphone_1080x1920.jpg';
const Login = ({navigation}) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const passwordInputRef = createRef();
  const {isLoading,login,errorText,userInfo} = useContext(AuthContext)

  return (
    <View style={styles.mainBody}>
    {/* {userInfo.token ? navigation.navigate('Home') : null} */}
    {/* <CustomHeader title="Đăng nhập" isBack={true} navigation={navigation}/> */}
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
       

        <View>
        <KeyboardAvoidingView enabled>
            <View style={{alignItems:"center",marginBottom:80}}>
                <Text style={{fontWeight:"700",fontSize:45,color:"#7DE24E"}}>PlantSolver</Text>
            </View>
 
            <View style={{alignItems: 'center'}}>
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={[styles.inputStyle,styles.textSize]}
                onChangeText={(UserEmail) =>
                  setUserEmail(UserEmail)
                }
                placeholder="Email" //dummy@abc.com
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={[styles.inputStyle,styles.textSize]}
                onChangeText={(UserPassword) =>
                  setUserPassword(UserPassword)
                }
                placeholder="Mật khẩu" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
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
              onPress={() => login(userEmail,userPassword)}>
              <Text style={[styles.buttonTextStyle,styles.textSize]}>Đăng nhập</Text>
            </TouchableOpacity>
            <View style={{flexDirection:"row",justifyContent:"center"}}>
              <Text
                style={[styles.registerTextStyle,{fontSize:16,color:"#FFFFFF"}]}
              >
                Chưa có tài khoản?
              </Text>
              <TouchableOpacity
                style={{}}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={[styles.buttonTextStyle,styles.textSize,{color:"#7DE24E"}]}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
      
            
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default Login;
 
const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignContent: 'center',
    // backgroundColor: '#307ecc',
    // marginTop:StatusBar.currentHeight,
  },
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
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  textSize:{
    fontSize:20
  }
});