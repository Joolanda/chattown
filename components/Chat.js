/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-empty */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-const */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

// Importing Firebase
const firebase = require('firebase');
require('firebase/firestore');

/**
 * @class Chat
 * @requires React
 * @requires React-native
 * @requires react-native-gifted-chat
 * @requires CustomActions from './CustomActions'
 * @requires firebase
 * @requires firestore
 */

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    // Initializing state for messages, user, user ID, image and location
    this.state = {
      messages: [],
      user: {
        _id: '',
        avatar: '',
        name: '',
      },
      uid: 0,
      loggedInText: '',
      image: null,
      location: null,
      isConnected: false,
    };
    // Referencing to the Firestore database.
    if (!firebase.apps.length) {
      firebase.initializeApp({
        // insert my Firestore database credentials here!
        // firebaseConfig =
        apiKey: "AIzaSyADUhSkyP-cc43fU9TYUeaNG6klBiaU78s",
        authDomain: "chat-town-app.firebaseapp.com",
        projectId: "chat-town-app",
        storageBucket: "chat-town-app.appspot.com",
        messagingSenderId: "675503354374",
        appId: "1:675503354374:web:dceb8dd1ba687938238987",
        measurementId: "G-WH1S538D21"
      });
    }

    // create a reference to my messages collection of the database
    this.referenceMessageUser = null;
    this.referenceMessages = firebase.firestore().collection('messages');
  }

  /**
   * @function componentDidMount
   * NetInfo checks connection status of the user
   * Set state accordingly
   * Use if-statement to make sure that references aren't undefined or null
   */
  async componentDidMount() {
    // Find out users connection status with NetInfo
    NetInfo.fetch().then((state) => {
      // Authenticates the user, setting the state to send messages and pass them.
      const { isConnected } = state;
      this.setState({
        isConnected,
      });
      if (isConnected) {
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
                avatar: 'https://placeimg.com/140/140/any',
                name: this.props.route.params.name,
              },
              loggedInText: `${this.props.route.params.name} has entered the chat`,
              messages: [],
            });
            // delete original listener as you no longer need it
            this.unsubscribe = this.referenceMessages
              .orderBy('createdAt', 'desc')
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

  // disconnect on closing the app
  componentWillUnmount() {
    if (this.state.isConnected) {
    // stop listening to authentication
      this.authUnsubscribe();
      // stop listening for collectionchanges
      this.unsubscribe();
    }
  }

  /**
   * Updates state with new message
   * @function onCollectionUpdate
   * @param {*} querySnapshot
   * @param {string} _id
   * @param {string} text
   * @param {date} createdAt
   * @param {string} user
   * @param {string} image - uri of image
   * @param {number} location geo data
   */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || '',
        location: data.location,
      });
    });
    this.setState({
      messages,
    });
  };

  /**
   * function onSend is called upon sending a message in order to store the message.
   * "previousState" references the component's state at the time the change is applied.
   * @param {*} messages
   * @returns {state}
   */
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
        this.saveMessages();
      },
    );
  }

  /**
   * loads all messages from AsyncStorage
   * @async
   * @function getMessage
   * @param {string}
   * @returns messages {Promise<string>} ,the data from storage
   */
  async getMessages() {
    // You need to create getMessages before you can use it: above componentDidMount()
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * Add new messages to the chat history.
   * Push messages to firestore database.
   * @function addMessages
   * @param {number} _id
   * @param {string} text
   * @param {date} createdAt
   * @param {string} user
   * @param {image} image
   * @param {number} location geo data
   */
  addMessages = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || '',
      location: message.location || null,
    });
  };

  // Async functions:
  /**
   * Save messages to async storage
   * @function saveMessages
   * @async
   * @returns {Promise<string>} stringifies messages
   */
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages),
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * Deletes messages from async storage
  * @function deleteMessage
  * @async
  */
  async deleteMessage() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * Customize styling of the chat bubble like background color
   * @function renderBubble
   * @param {*} props
   * @returns {Bubble}
   */
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#3dd8ff',
          },
          left: {
            backgroundColor: '#ff3dd8',
          },
        }}
      />
    );
  }

  /**
  * Renders the action '+' button
  * @function renderInputToolbar
  * @param {*} props
  * @returns {InputToolbar}
  */
  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
    } else {
      return (
        <InputToolbar {...props} />
      );
    }
  }

  /**
  * Renders MapView if current message contains location data
  * @function renderCustomView
  * @param {*} props
  * @returns {MapView}
  */
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  /**
   * Renders the action '+' button
   * @function renderCustomActions
   * @param {*} props
   * @returns {InputToolbar}
   */
  renderCustomActions = (props) => <CustomActions {...props} />;

  // Wrap entire GiftedChat component into a view and add condition for KeyboardAvoidingView
  // Initializing state user
  render() {
    // Defining variables from Start Screen
    let { name, colorSelect } = this.props.route.params;
    let { messages } = this.state;
    // Set a default username in case the user didn't enter one
    // if (!user || user === '') user.name = 'User';
    // Display user's name in the navbar at the top of the chat screen
    this.props.navigation.setOptions({ title: name });

    return (
      // Styling chat screen
      <View
        style={{
          flex: 1,
          color: '#fff',
          backgroundColor: colorSelect,
        }}
      >
        {/* rendering chat interface with gifted Chat component, a third party tool */}
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView.bind(this)}
          messages={messages}
          // eslint-disable-next-line no-shadow
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
          image={this.state.image}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
}
