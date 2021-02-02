import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const firebase = require('firebase');

// Integration of communication features. 
// User gets a list of options...accesory bar through the action button at 
// the left of inputfield on the chat screen
export default class CustomActions extends React.Component {
  constructor() {
    super()
  }

    onActionPress = () => { 
      const options = ['Pick a photo from library', 'Take a photo', 'Send location', 'Cancel'];
      const cancelButtonIndex = options.length -1;

      this.context.actionSheet().showActionSheetWithOptions(
        {
       options,
        cancelButtonIndex,
        },
        async(buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              return this.pickImage();
            case 1:
              return this.takePhoto();
            case 2:
              return this.getLocation();
            default:
          }
        },
      );
    };
  
    //Permission request for photo library
  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if(status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));
 
      if (!result.cancelled) {
        this.setState({
          image: result
        });  
      }
    }
  }

    render() {
      return (
        <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
          </View> 
        </TouchableOpacity>
      );
    }
  }
  
    const styles = StyleSheet.create({
      container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
      },
      wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
      },
      iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
      },
    });

    CustomActions.contextTypes = {
      actionSheet: PropTypes.func,
    };   
