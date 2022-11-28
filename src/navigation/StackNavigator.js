import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../screens/Home";
import Details from "../screens/Details";
import Find from "../screens/Find";
import Login from "../screens/Login"
import Profile from "../screens/Profile";
import SignUp from "../screens/SignUp";
import Posts from "../screens/Posts";
import AddPost from "../screens/AddPost";

const Stack = createStackNavigator();
const FindStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenFind}>
      <Stack.Screen name="Tìm kiếm" component={Find} />
      <Stack.Screen name="Chi tiết" component={Details} />
    </Stack.Navigator>
  );
}

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenHome}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Chi tiết" component={Details} />
    </Stack.Navigator>
  );
}

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator screenOptions={screenFind} initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
      />
    </Stack.Navigator>
  );
};

const PostStack = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Posts">
      <Stack.Screen
        name="Posts"
        component={Posts}
      />
      <Stack.Screen
        name="AddPost"
        component={AddPost}
      />
    </Stack.Navigator>
  );
};

const screenHome = {
  headerShown: false,
  // headerStyle: {
  //   backgroundColor: "#9AC4F8",
  // },
  // headerTintColor: "black",
  // headerBackTitle: "Back",
};

const screenFind = {
  headerShown: false,
  // headerStyle: {
  //   backgroundColor: "#9AC4F8",
  // },
  // headerTintColor: "black",
  // headerBackTitle: "Back",
};

export { FindStackNavigator,HomeStackNavigator,Auth,PostStack };