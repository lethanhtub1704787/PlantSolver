import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../screens/Home";
import Details from "../screens/Details";
import Find from "../screens/Find";
import Login from "../screens/Login"
import Profile from "../screens/Profile";

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
      <Stack.Screen name="Trang chủ" component={Home} />
      <Stack.Screen name="Đăng nhập" component={Login} />
      <Stack.Screen name="Hồ sơ" component={Profile} />
      <Stack.Screen name="Chi tiết" component={Details} />
    </Stack.Navigator>
  );
}

const PredictStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenHome}>
      <Stack.Screen name="HomePage" component={Home} />
      <Stack.Screen name="Predicted" component={Details} />
    </Stack.Navigator>
  );
}

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

export { FindStackNavigator,HomeStackNavigator,PredictStackNavigator };