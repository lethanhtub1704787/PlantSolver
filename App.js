
import { StyleSheet, Text, View} from 'react-native';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./src/navigation/TabNavigator";
import DrawerNavigator from "./src/navigation/DrawnerNavigator";
import Login from './src/screens/Login';
import { PredictStackNavigator } from './src/navigation/StackNavigator';

const App = () => {

  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}


export default App; 