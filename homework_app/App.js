import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./src/Home"
import URL_page from "./src/URL_page"
import Homework from "./src/Homework"
import AssignmentDetails from "./src/AssignmentDetails";
import Deadlines from "./src/Deadlines"

const Stack = createStackNavigator();

export default class App extends React.Component{
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator>
          {/* Below Removes the 'Home Button' will eventually do that but need to add */}
          {/* Buttons to do so, so remove the top stack navigator and uncomment button when done */}
        {/* <Stack.Navigator screenOptions={{headerShown: false}}> */}
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="URL_page" component={URL_page} />
          <Stack.Screen name="Homework" component={Homework} />
          <Stack.Screen name="AssignmentDetails" component={AssignmentDetails} />
          <Stack.Screen name="Deadlines" component={Deadlines} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}