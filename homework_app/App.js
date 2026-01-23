import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./src/Home"
import URL_page from "./src/URL_page"
import Homework from "./src/Homework"
import Deadlines from "./src/Deadlines"

const Stack = createStackNavigator();

export default class App extends React.Component{
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="URL_page" component={URL_page} />
          <Stack.Screen name="Homework" component={Homework} />
          <Stack.Screen name="Deadlines" component={Deadlines} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}