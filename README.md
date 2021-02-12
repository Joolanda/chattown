# Chattown – a React Native chat app

A chat app for mobile devices using React Native, Expo, Google's Firebase/Firestore and gifted-chat library.
The app will provide users with a chat interface and the possibility to share images (take a picture or choose from media library) and their location with others.

##### Key Features
- Select background color before starting a chat
- Ask for permission to use location data and share images
- take a new picture or choose one from your media library
- Datastorage online in firebase Cloud and local storage offline

### Getting started
First you need to set up your development environment. Make sure you have the latest version of [Node]https://nodejs.org/en/ and install [Expo]https://expo.io/
```sh
$ npm install expo-cli --global
 ```
For testing the app you can use XCode as an iOS Simulator or [Android-Studio]https://developer.android.com/studio emulator. You will need Expo to run the app on your mobile device (iOS/Android Smartphone) or use the emulator (or simulator). Download the Expo app from App or Play store onto your device.
Create [your-Expo-account] https://expo.io/signup.

Now you can set up your React Native App! Make sure you are working in your projects folder.
```sh
$ expo init hello-world
```
Back in your terminal choose the blank template - but not the TypeScript blank

Go to your project's directory using cd project-name and start with npm start or expo start. This will launch the https server "Metro Bundler in a new tab. You can also hit the in terminal "?" to see all options for running the app. 

Nice work!

### Setting up your Database
Storage of realtime conversations in the Firestore Database. With [Firebase]https://firebase.google.com/docs you can authenticate the users anonymously 

```sh
$ npm install --save firebase@7.9.0
```
(Etcetera...currently working on this README file:)

#### Dependencies 
 "@react-native-community/async-storage",
    "@react-native-community/masked-view",
    "@react-native-community/netinfo",
    "@react-navigation/native",
    "@react-navigation/stack",
    "expo",
    "expo-image-picker",
    "expo-location",
    "expo-permissions",
    "expo-status-bar",
    "firebase",
    "prop-types",
    "react",
    "react-dom",
    "react-native",
    "react-native-gesture-handler",
    "react-native-gifted-chat",
    "react-native-maps",
    "react-native-reanimated",
    "react-native-safe-area-context",
    "react-native-screens,
    "react-native-web",
    "react-navigation"

#### Libraries
The app uses [GiftedChat] (https://github.com/FaridSafi/react-native-gifted-chat)

#### Project Management
Using a simple [Kanban Board]https://trello.com/b/51GCsgP5/native-react-chat-app to visualize and optimize my workflow. Contain the user stories, story points for time estimation, and other handoff deliverables. 

 ## Happy Coding!