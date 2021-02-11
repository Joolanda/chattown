/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-use-before-define */
import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// storage for images and location data
const firebase = require('firebase');

/**
* @class CustomActions
* @requires react
* @requires react-native
* @requires prop-types
* @requires expo-permissions
* @requires eypo-image-picker
* @requires expo-location
* @requires firebase
* @requires firestore
*/

export default class CustomActions extends React.Component {
    /**
     * Integration of communcation features
     * List of options through action '+' button
     * @function onActionPress
     * @returns {actionSheet}  - select action from accesory bar
     */
    onActionPress = () => {
      const options = ['Image from library', 'Take a picture', 'Share location', 'Cancel'];
      const cancelButtonIndex = options.length - 1;

      this.context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
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

  /**
   * Permission request for photo library
   * @async
   * @function pickImage
   */
  pickImage = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    } catch (e) {
      console.log('error in permissions');
    }
    if (status === 'granted') {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
        });
      } catch (e) {
        console.log('error in imagePicker');
      }
      if (!result.cancelled) {
        const imageUrl = await this.uploadImage(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  }

  /**
   * permission request for camera and photo library
   * @async
   * @function takePhoto
   */
  takePhoto = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY);
    } catch (e) {
      console.log('error in permissions');
    }
    if (status === 'granted') {
      try {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: 'Images',
        });
      } catch (e) {
        console.log('error in imagePicker');
      }
      if (!result.cancelled) {
        const imageLink = await this.uploadImage(result.uri);
        this.props.onSend({ image: imageLink });
      }
    }
  }

  /**
   * Premission request to get users location
   * @async
   * @function getLocation
   */
  getLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
    } catch (e) {
      console.log('error in permissions');
    }
    if (status === 'granted') {
      try {
        const result = await Location.getCurrentPositionAsync({});
      } catch (e) {
        console.log('error in getting current location');
      }
      if (result) {
        this.props.onSend({
          location: {
            latitude: result.coords.latitude,
            longitude: result.coords.longitude,
          },
        });
      }
    }
  }

  /**
   * Storage implementation for image urls in Google Firestore, as follows
   * Upload image to firebase Storage with XMLHttpRequest
   * Using fetch and blob
   * Turn image file into blob and retrieve image url from the server with getDownloadURL()
   * Create a reference to the image file
   * Upload image to firebase Storage with XMLHttpRequest
   * @async
   * @function uploadImage
   */
  uploadImage = async (uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        // Opens connection and get method
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
        // this will generate a unique filename for each image uploaded
        // get image name with uriParts
      const getUriParts = uri.split('/');
      const myImage = getUriParts[getUriParts.length - 1];
      // create a reference to the file
      const ref = firebase.storage().ref().child(`images/${myImage}`);
      // put the blob into the just created reference
      const snapshot = await ref.put(blob);
      // close the connection
      blob.close();
      // to get the image url from storage use async method getDownloadURL()
      // upload image with fetch() and blob()
      const imageURL = await snapshot.ref.getDownloadURL();
      return imageURL;
    } catch (error) {
      console.log(error);
    }
  };

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
    borderRadius: 15,
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
