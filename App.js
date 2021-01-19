import React, { Component } from 'react';

import Start from './components/Start';
import Chat from './components/Chat';
// import react native gesture handler
import 'react-native-gesture-handler';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const firebase = require('firebase');
require('firebase/firestore');

// Create the navigator
const Stack = createStackNavigator();


export default class App extends Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          //First screen to load upon launching the app - value has to be one of the Stack.Screen-s
          initialRouteName="Start"
        >
          <Stack.Screen
            // Name doesn't have to match the component's name
            name="Home"
            component={Start}
          />
          <Stack.Screen
              name="Chat"
              component={Chat}
            />
          </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
