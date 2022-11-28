import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { HomeStackNavigator, FindStackNavigator, PostStack } from "./StackNavigator";
import Entypo from 'react-native-vector-icons/Entypo'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
const fontColor = "#337954"
const Tab = createBottomTabNavigator();

const getRouteName = route => {
  const routeName = getFocusedRouteNameFromRoute(route)
  // console.log((routeName))
  if(routeName?.includes("AddPost"))
    return 'none';
  return 'flex';
}

const BottomTabNavigator = () => {
  // const hide_tabBar = props.routeName != "Posts"
  return (
    <Tab.Navigator
        screenOptions={{
          headerShown: false,
          // showLabel: false
        }}
    >
      <Tab.Screen 
        name="Trang Chủ" 
        component={HomeStackNavigator} 
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <View style={styles.container}>
              <Entypo name="home" style={{
                fontSize: 35,
                fontWeight: 500,
                color: focused ? fontColor : "#ADC8B7"
              }}/>

              {/* <Text style={focused ? styles.iconFocused : styles.iconUnFocused}>Trang chủ</Text> */}

            </View>
          ),
        
        }}
      />
      <Tab.Screen name="Tìm Kiếm" component={FindStackNavigator} 
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <View style={styles.container}>
              <AntIcon name="search1" style={{
                fontSize: 35,
                color: focused ? fontColor : "#ADC8B7"
              }}/>

              {/* <Text style={focused ? styles.iconFocused : styles.iconUnFocused}>Tìm kiếm </Text> */}
            </View>
          ),
        }}
      />
      <Tab.Screen name="Social" component={PostStack} 
           options={
            ({route}) => (
            {
              tabBarStyle: {display: getRouteName(route)}, // to hide or show tab Bar
              tabBarShowLabel: false,
              tabBarIcon: ({focused}) => (
                <View style={styles.container}>
                  <MaterialCommunityIcons name="post-outline" style={{
                    fontSize: 35,
                    color: focused ? fontColor : "#ADC8B7"
                  }}/>
                </View>
              ),
            })
          }
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems:"center"
  },
  iconFocused: {
    color: "#337954",
    fontWeight: "900",
    fontSize: 15
  },
  iconUnFocused:{
    color: "#ADC8B7",
    fontSize: 16
  }

})


export default BottomTabNavigator;