import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { HomeStackNavigator, FindStackNavigator } from "./StackNavigator";
import Entypo from 'react-native-vector-icons/Entypo'
import AntIcon from 'react-native-vector-icons/AntDesign'
const fontColor = "#337954"
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
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
                fontSize: 30,
                fontWeight: 500,
                color: focused ? fontColor : "#ADC8B7"
              }}/>

              <Text style={focused ? styles.iconFocused : styles.iconUnFocused}>Trang chủ</Text>

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
                fontSize: 28,
                color: focused ? fontColor : "#ADC8B7"
              }}/>

              <Text style={focused ? styles.iconFocused : styles.iconUnFocused}>Tìm kiếm </Text>
            </View>
          ),
        }}
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