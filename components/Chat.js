import React from "react";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { View, Text, Platform, KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import NetInfo from "@react-native-community/netinfo";
import CustomActions from "./CustomActions";
import MapView from 'react-native-maps';

const firebase = require("firebase");
require("firebase/firestore");
// The application’s main Chat component that renders the chat UI export default class Chat extends Component

export default class Chat extends React.Component {
  // Initializing the state in order to send, receive and display messages
  constructor(props) {
    super(props);
    // Initializing state for messages, user, user ID, image and location
    this.state = {
      messages: [],
      user: {
        _id: "",
        avatar: "",
        name: "",
      },
      uid: 0, 
      loggedInText: "",
      image: null,
      location: null,
      isConnected: false,
    };
    // Referencing to the Firestore database.
    if (!firebase.apps.length) {
      firebase.initializeApp({
        // insert my Firestore database credentials here!
        // firebaseConfig =
        
        apiKey: "AIzaSyB1qQS4FD9L56EFpl_7kZ7K0jEgJXMcnLk",
        authDomain: "chattownapp.firebaseapp.com",
        projectId: "chattownapp",
        storageBucket: "chattownapp.appspot.com",
        messagingSenderId: "759665951924",
        appId: "1:759665951924:web:9d5b057d27eb78d51cc3e1",
        measurementId: "G-9EJECEB77W"
      })
    }

    // create a reference to my messages collection of the database
    this.referenceMessageUser = null;
    this.referenceMessages = firebase.firestore().collection("messages");

    // Initializing state for messages, user, user ID, image and location
  }

  // Async functions: the user should be able to read messages offline
  // You need to create getMessages before you can use it: add it above componentDidMount()
  // loading messages from local storage
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async componentDidMount() {
    //Find out users connection status with NetInfo
    NetInfo.fetch().then((state) => {
      // Authenticates the user, setting the state to send messages and pass them.
      var isConnected = state.isConnected;
      this.setState({
        isConnected,
      });
      if (isConnected) {
        // use if statement to make sure that references aren't undefined or null. (Always check this).
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              try {
                await firebase.auth().signInAnonymously();
              } catch (error) {
                console.log(error.message);
              }
            }

            // update user state with currently active user data
            this.setState({
              isConnected: true,
              user: {
                _id: user.uid,
                avatar: "https://placeimg.com/140/140/any",
                name: this.props.route.params.name,
              },
              loggedInText: `${this.props.route.params.name} has entered the chat`,
              messages: [],
            });
            // delete original listener as you no longer need it
            this.unsubscribe = this.referenceMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    });
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
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || "",
        location: data.location,
      });
    });
    this.setState({
      messages,
    });
  };
// disconnect on closing the app
  componentWillUnmount() {
    if (this.state.isConnected) {
      // stop listening to authentication
      this.authUnsubscribe();
      //stop listening for collectionchanges
      this.unsubscribe();
    }
  }
  // function onSend is called upon sending a message in order to store the message
  // "previousState" references the component's state at the time the change is applied.
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
        this.saveMessages();
      }
    );
  }

  addMessages = () => {
    // add new messages to the chat history. Push messages to firestore database
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || "",
      location: message.location || null,
    });
  };

  // Async functions:
  // save messages to async storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  // delete messages to async storage
  async deleteMessage() {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  }

  // Customize styling of the chat bubble like background color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#3dd8ff",
          },
          left: {
            backgroundColor: "#ff3dd8",
          },
        }}
      />
    );
  }
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return ( 
      <InputToolbar {...props} />
      );
    }
  }
 // check if current message contains location data
 renderCustomView(props) {
   const { currentMessage } = props;
   if (currentMessage.location) {
     return (
       <View>
        <MapView
            style={{width: 150,
             heigth: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      );
}
return null;
}

  // give CustomAction Class a render function that renders the action button
  renderCustomActions(props) {
    return (
      <CustomActions
      {...props}
      />
    );
  }

  // Wrap entire GiftedChat component into a view and add condition for KeyboardAvoidingView
  // Initializing state user
  render() {
    // Defining variables from Start screen
    let { name, colorSelect } = this.props.route.params;
    let { messages, uid } = this.state;
    // Set a default username in case the user didn't enter one
    //if (!user || user === '') user.name = 'User';
    // Display user's name in the navbar at the top of the chat screen
    this.props.navigation.setOptions({ title: name });

    return (
      <View
        style={{
          flex: 1,
          color: "#fff",
          backgroundColor: colorSelect,
        }}
      >
        {/* <Text style={{ color:'#fff', marginTop: 50,  alignSelf: 'center',}} > Hey { name}, nice background!</Text> */}
        {/* <Text style={{ color:'#fff', marginTop: 50,  alignSelf: 'center',}} > {this.state.loggedInText}</Text> */}

        {/* rendering chat interface with gifted Chat component, a third party tool */}
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView.bind(this)}
          messages={messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
          image={this.state.image}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    )
  }
}
