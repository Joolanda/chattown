/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/no-unused-state */
import React from 'react';
import {
  ImageBackground, View, Text, TextInput, StyleSheet, TouchableOpacity,
} from 'react-native';

// Importing the background image from the assets folder
const image = require('../assets/background-image.png');

/**
 * @class Start
 * @requires React
 * @requires react-native
 */

export default class Start extends React.Component {
  constructor() {
    super();
    this.state = { name: '', colorSelect: '' };
  }

  render() {
  /**
   * Display user's name in the navigation bar at the top of the chat screen
   * User can choose a background color for the chat screen by touching a TouchableOpacity
   */
    return (
      // Setting the background image to cover the whole screen
      <ImageBackground source={image} style={styles.backgroundImage}>
        <Text style={styles.title}>
          Chat App!
        </Text>
        <View style={styles.container}>
          <TextInput
            style={styles.nameBox}
            // eslint-disable-next-line react/jsx-boolean-value
            accessible={true}
            accessibilityLabel="Input"
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
            placeholder="Your Name"
          />
          <Text style={{
            alignSelf: 'center', width: '88%', marginBottom: 10, fontSize: 16, fontWeight: '300', color: '#757083', opacity: 100,
          }}
          >
            Choose Background Color:
          </Text>
          <View style={styles.colorSelection}>
            <TouchableOpacity
              onPress={() => this.setState({ colorSelect: '#090C08' })}
              style={[styles.colorButton, styles.color1]}
            />
            <TouchableOpacity
              onPress={() => this.setState({ colorSelect: '#474056' })}
              style={[styles.colorButton, styles.color2]}
            />
            <TouchableOpacity
              onPress={() => this.setState({ colorSelect: '#8A95A5' })}
              style={[styles.colorButton, styles.color3]}
            />
            <TouchableOpacity
              onPress={() => this.setState({ colorSelect: '#B9C6AE' })}
              style={[styles.colorButton, styles.color4]}
            />
          </View>
          <View style={styles.startChattingButton}>
            <TouchableOpacity
              // eslint-disable-next-line react/jsx-boolean-value
              accessible={true}
              accessibilityLabel="start chatting"
              style={{ color: '#FFFFFF' }}
              title="Start Chatting"
              color="#757083"
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, colorSelect: this.state.colorSelect })}
            >
              <Text style={{
                color: '#FFFFFF', fontSize: 16, fontWeight: '600', alignSelf: 'center',
              }}
              >
                start chatting
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
/**
 * Creating Styling with Stylesheet component of react native,
 * and using the Design Specifications;
 * with Flexbox.
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: '88%',
    height: '44%',
    marginBottom: 30,
  },
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    flex: 1,
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: 60,
  },
  nameBox: {
    fontSize: 16,
    fontWeight: '300',
    width: '88%',
    height: 55,
    borderColor: 'gray',
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderRadius: 3,
    opacity: 50,
    // eslint-disable-next-line no-dupe-keys
    borderWidth: 1,
    // eslint-disable-next-line no-dupe-keys
    marginBottom: 20,
  },
  colorSelection: {
    flex: 3,
    width: '88%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  colorButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  color1: {
    backgroundColor: '#090C08',
  },
  color2: {
    backgroundColor: '#474056',
  },
  color3: {
    backgroundColor: '#8A95A5',
  },
  color4: {
    backgroundColor: '#B9C6AE',
  },
  textColorSelection: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
    alignSelf: 'auto',
    marginBottom: 10,
  },
  startChattingButton: {
    color: '#FFFFFF',
    backgroundColor: '#757083',
    width: '88%',
    height: 50,
    marginBottom: 20,
    padding: 10,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center',
    color: '#FFFFFF',
    backgroundColor: '#757083',
  },
});
