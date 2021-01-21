import React from 'react';
// Bubble is a third party tool to customize styling of the gifted chat bubble 
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
// By importing keyboardAvoidingView you can solve the issue with keyboard position on Android devices
import { View, Text, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
// Local Storage Options in React Native with asyncStorage
import AsyncStorage from '@react-native-community/async-storage';
// establish connection to Firestore 
const firebase = require('firebase');
require('firebase/firestore');
// The application’s main Chat component that renders the chat UI export default class Chat extends Component

export default class Chat extends React.Component {
  // Initializing the state in order to send, receive and display messages
  
  constructor() {
    super();


  
  // Referencing to the Firestore database. 
  if (!firebase.apps.length){
    firebase.initializeApp(
      // insert my Firestore database credentials here!
       firebaseConfig =
        {
        apiKey: "AIzaSyCQ_70Di8C75S2XuCtyUS-HS21-da4Fpq8",
        authDomain: "chatapp-ee057.firebaseapp.com",
        databaseURL: "https://chatapp-ee057.firebaseio.com", 
        projectId: "chatapp-ee057",
        storageBucket: "chatapp-ee057.appspot.com",
        messagingSenderId: "1035133300241",
        appId: "1:1035133300241:web:6657ee87bf23bc781ecbb0",
        //measurementId: "G-QVZVZ3F4Z8" is optional
        });
      }
      // create a reference to my messages collection of the database
      this.referenceMessages = firebase.firestore().collection("messages");

    // Initializing state for messages, user, user ID, image and location
    this.state = {
      messages: [],
      user: {
        _id:"",
        avatar: "",
        name: "",
      },
       uid: 0,
      loggedInText: "",
      //isConnected: false,
    };
  }
  componentDidMount() {
  //listen to authentication events
  // use if statement to make sure that references aren't undefined or null. (Always check this).
  //if (state.isConnected) {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      try {
      await firebase.auth().signInAnonymously();
      } catch (error) {
      console.log(error.message);
      }
    }
    // update user state with currently active user data
    this.setState({
      // isConnected: true,
      user: {
        _id: user.uid, 
        name: this.props.route.params.name,
        avatar: 'https://placeimg.com/140/140/any',
      },
      loggedInText: `${this.props.route.params.name} has entered the chat`,
      messages:[],
    }); 
    // delete original listener as you no longer need it
    this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
    });
    /* }  else {
    this.setState({
      isConnected: false,
      });
      // this.getMessages();
  // } */
  }

  componentWillUnmount() {
    // if(this.state.isConnected){
  // stop listening to authentication
    this.authUnsubscribe();
  //stop listening for collectionchanges
    this.unsubscribe();
  //}
}
// function onSend is called upon sending a message.
// "previousState" references the component's state at the time the change is applied.
  onSend(messages = []) {
      this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessages();
    }
    
    );
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages,
    });
  };
    
  addMessages = () => {
    // add new messages to the chat history. Push messages to firestore database
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      uid: this.state.uid,
    });
  }

  // Customize styling of the chat bubble like background color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

 // Wrap entire GiftedChat component into a view and add condition for KeyboardAvoidingView
  // Initializing state user
  render() {
    // Defining variables from Start screen
    let { name, colorSelect }= this.props.route.params;
    // Set a default username in case the user didn't enter one
    // if (!user || user === '') user = 'User';
    // Display user's name in the navbar at the top of the chat screen
    this.props.navigation.setOptions({ title: name });

    return (
      <View 
        style={{
          flex:1, 
          color: '#fff',
          backgroundColor: colorSelect,
        }}>
          {/* <Text style={{ color:'#fff', marginTop: 50,  alignSelf: 'center',}} > Hey { name}, nice background!</Text> */}
          {/* <Text style={{ color:'#fff', marginTop: 50,  alignSelf: 'center',}} > {this.state.loggedInText}</Text> */}

         {/* rendering chat interface with gifted Chat component, a third party tool */}
         <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
         />
         { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}
