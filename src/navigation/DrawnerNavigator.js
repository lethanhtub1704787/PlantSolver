import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "./TabNavigator";
import Login from "../screens/Login"
import Profile from "../screens/Profile"
import NewPlant from "../screens/NewPlant"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { SafeAreaView, ScrollView,TouchableOpacity,Text,StatusBar,StyleSheet,View, Image } from "react-native";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  return(
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{marginTop:20}}/>

        <TouchableOpacity onPress={() => props.navigation.navigate("Trang chủ")}
          style={styles.tabContainer}
        >
          <FontAwesome name="home" style={styles.icon}/>
          <View style={styles.tabButton}>
            <Text style={styles.text}>Trang chủ</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => props.navigation.navigate("Đăng nhập")}
          style={styles.tabContainer}
        >
          <FontAwesome name="user-circle-o" style={styles.icon}/>
          <View style={styles.tabButton}>
            <Text style={styles.text}>Đăng nhập</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate("Hồ sơ")}
          style={styles.tabContainer}
        >
          <Image style={{width:25,height:25,marginLeft:5}} 
            source={require("../../assets/icons/home.png")}
            resizeMode="contain"
          />
          <View style={styles.tabButton}>
            <Text style={{fontSize:20}}>Hồ sơ</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
   
     
    </SafeAreaView>
  )
}

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Trang chủ"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor:"transparent",
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: "#9AC4F8"
        },
      }}
      drawerContent={props => CustomDrawerContent(props)}
    >
      <Drawer.Screen name="Trang chính" component={BottomTabNavigator} />
      <Drawer.Screen name="Đăng nhập" component={Login} />
      {/* <Drawer.Screen name="Hồ sơ" component={Profile} />
      <Drawer.Screen name="Thêm cây" component={NewPlant} /> */}

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