import React, { useContext, useEffect, useState } from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "./TabNavigator";
import Login from "../screens/Login"
import Profile from "../screens/Profile"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LogoutIcon from 'react-native-vector-icons/MaterialIcons'
import { SafeAreaView, ScrollView,TouchableOpacity,Text,StatusBar,StyleSheet,View, Image, Alert } from "react-native";
import { Auth } from "./StackNavigator";
import { AuthContext } from "../context/AuthContext";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const {logout,userInfo} = useContext(AuthContext)
  const openLogoutModal = () => {
    props.navigation.toggleDrawer();
    Alert.alert(
      'Bạn muốn đăng xuất?',
      '',
      [
        {
          text: 'Xác nhận',
          onPress: () => {
            logout()
            props.navigation.navigate('Home');
          },
        },
        {
          text: 'Hủy',
          onPress: () => {
            return null;
          },
        },  
      ],
      {cancelable: false},
    );
  }
  
  return(
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{marginTop:20}}/>
        <View>
          <TouchableOpacity onPress={() => props.navigation.navigate("Home")}
            style={styles.tabContainer}
          >
            <FontAwesome name="home" style={styles.icon}/>
            <View style={styles.tabButton}>
              <Text style={styles.text}>Trang chủ</Text>
            </View>
          </TouchableOpacity>
          {
            !userInfo ?
            (
              <TouchableOpacity onPress={() => props.navigation.navigate("Auth")}
              style={styles.tabContainer}
              >
              <FontAwesome name="user-circle-o" style={styles.icon}/>
              <View style={styles.tabButton}>
                <Text style={styles.text}>Đăng nhập</Text>
              </View>
              </TouchableOpacity>
            )
            :
            (
            <>
              <TouchableOpacity onPress={() => props.navigation.navigate("Profile")}
                  style={styles.tabContainer}
                >
                  <FontAwesome name="user-circle-o" style={styles.icon} />
                  <View style={styles.tabButton}>
                    <Text style={styles.text}>Hồ sơ</Text>
                  </View>
                </TouchableOpacity><View
                  style={{ flex: 1, height: 50, flexDirection: "row", alignItems: 'flex-end', backgroundColor: "green" }}
                >
                    <TouchableOpacity onPress={openLogoutModal}
                      style={styles.tabContainer}
                    >
                      <LogoutIcon name="logout" style={styles.icon} />
                      <View style={styles.tabButton}>
                        <Text style={{ fontSize: 20 }}>Đăng xuất</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
              </> 
            )

          }
         
        </View>
      </ScrollView>
   
     
    </SafeAreaView>
  )
}



const DrawerNavigator = () => {
  const {userInfo} = useContext(AuthContext)
  return (
    <Drawer.Navigator
      initialRouteName="Trang chủ"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor:"transparent",
          elevation: 0,
          shadowOpacity: 0,
          // backgroundColor: "#9AC4F8"
        },
      }}
      drawerContent={props => CustomDrawerContent(props)}
    >
      <Drawer.Screen name="Main" component={BottomTabNavigator} />
      {/* <Drawer.Screen name="Auth" component={Auth} /> */}
      {
        !userInfo ? ( <Drawer.Screen name="Auth" component={Auth} />) : null
      }

      {/* <Drawer.Screen name="Thêm cây" component={NewPlant} /> */} 

    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      marginTop:StatusBar.currentHeight,
      backgroundColor:"#575757",
  },
  tabContainer:{
    flex:1, 
    flexDirection:"row",
    padding:10,
    // backgroundColor:"red"
  },
  tabButton:{
    fontSize:20,
    marginLeft:10,
  },
  text: {
    color: "#FFFFFF",
    fontSize:20
  },
  icon: {
    fontSize: 28,
    marginLeft:5,
    color:"#FFFFFF"
  }
});

export default DrawerNavigator;