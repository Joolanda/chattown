import React, { Component } from 'react';

import Start from './components/Start';
import Chat from './components/Chat';
// import react native gesture handler
import 'react-native-gesture-handler';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// Create the navigator
const Stack = createStackNavigator();


export default class App extends React.Component {

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

/* TEMPLATE Initial code
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello Chat World!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); */