import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
//import * as Location from 'expo-location';

const firebase = require('firebase');

// Integration of communication features. 
// User gets a list of options...accesory bar through the action button at 
// the left of inputfield on the chat screen
export default class CustomActions extends React.Component {
  constructor() {
    super()
  }

    onActionPress = () => { 
      const options = ['Image from library', 'Take a picture', 'Share location', 'Cancel'];
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
    try {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      if(status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
        }).catch(error => console.log(error));
 
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl});
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }

  // permission request for camera and photo library
  takePhoto = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY);
      if(status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));
 
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl});
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }

  // create a get Location method ask users (async) permission to use location
  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if(status === 'granted') { 
        try {
          let result = await Location.getCurrentPositionAsync({});
          if(location) {
            this.props.onSend({ 
              location: {
                latitude:location.coords.latitude,
                longitude: location.coords.longitude,
              },
            });
          }   
        } catch (error) {
        console.log(error);
      }
    }  
  };

  // Retrieve image url from user with fetch methode and covert this content into a blob. Create a reference to the file
  // Turn the image file into a blob and retrieve image url from the server with getDownloadURL()
  // (upload image to Storage with XMLHttpRequest)
  uploadImage = async(uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
          xhr.onload = function() {
          resolve(xhr.response);
          };
          xhr.onerror = function(e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', uri, true);
          xhr.send(null);
        });
        // this will generate a unique filename for each image uploaded
        // get image name with uriParts
        const getUriParts = uri.split('/'); 
        const myImage = getUriParts[getUriParts.lenght -1];
        //create a reference to the file
        const ref = firebase.storage().ref().child(`${myImage}`);
        // put the blob into the just created reference
        const snapshot = await ref.put(blob);
        // close the connection
        blob.close();
        // to get the image url from storage use async method getDoewnloadURL()
        // upload image with fetch() and blob()
        const imageUrl = await snapshot.ref.getDownloadURL();
        return imageUrl;
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
