
import { StyleSheet, Text, View} from 'react-native';
import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./src/navigation/TabNavigator";
import DrawerNavigator from "./src/navigation/DrawnerNavigator";

import { AuthContext, AuthContextProvider } from './src/context/AuthContext';

const App = () => {
  return (
    <AuthContextProvider>
      <NavigationContainer
      >
        <DrawerNavigator />
      </NavigationContainer>
    </AuthContextProvider>
  );
}


export default App; 