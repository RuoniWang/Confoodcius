import React from 'react';
import '../shim';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Permissions, ImagePicker } from 'expo';


export default class CameraPage extends React.Component {
    camera = null;

    state = {
      captures: null,
      // setting flash to be turned off by default
      hasCameraPermission: null,
    };

    async componentDidMount() {
      const camera = await Permissions.askAsync(Permissions.CAMERA);
      const cameraroll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      const hasCameraPermission = (camera.status === 'granted' && cameraroll.status === 'granted');

      this.setState({ hasCameraPermission });
    }


    // call API later
    getRecipe = async () => {
      const { captures } = this.state;

      const data = new FormData();
      data.append('data', captures.base64);

      const results = await fetch('https://desolate-plateau-16252.herokuapp.com/upload', {
        method: 'POST',
        body: data,
      }).then((res) => {
        // this should be the query string
        console.log(JSON.stringify(res));
        return res.json();
      }).catch((err) => { console.log(err); });

      this.props.navigation.navigate('Result', { result: results, captures, navigation: this.props.navigation });

      this.setState({ captures: null });
    }

    retake=() => this.setState({ captures: null });

    chooseImagePress = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true,
        aspect: [4, 3],
      });

      if (!result.cancelled) {
        this.setState({ captures: result });
      }
    }

    takeImagePress = async () => {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        base64: true,
        aspect: [4, 3],
      });

      if (!result.cancelled) {
        this.setState({ captures: result });
      }
    }


    render() {
      const {
        captures, hasCameraPermission,
      } = this.state;
      if (hasCameraPermission === null) {
        return <View />;
      } else if (hasCameraPermission === false) {
        return <Text>Access to camera has been denied. Please go to settings to enable access to camera and microphone.</Text>;
      }
      if (captures == null) {
        return (
          <View style={styles.container}>
            <TouchableOpacity style={[styles.subcontainer]} onPress={this.chooseImagePress}>
              <Ionicons
                name="ios-photos"
                color="#2ab7ca"
                size={100}
              />
              <Text>Select From Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subcontainer} onPress={this.takeImagePress}>
              <Ionicons
                name="ios-camera"
                color="#2ab7ca"
                size={100}
              />
              <Text>Take Photo</Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <View style={styles.confirmContainer}>
              <Image source={{ uri: captures.uri }} style={styles.image} />
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={this.retake}>
                  <Text style={[styles.button, styles.greyButton]}>retake</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.getRecipe}>
                  <Text style={[styles.button, styles.blueButton]}>Look this up!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  subcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    backgroundColor: 'lightgrey',
    width: '70%',
    marginLeft: 50,
    padding: 10,
  },
  preview: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    flex: 1,
    width: '80%',
    resizeMode: 'contain',
  },
  buttonRow: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 9,
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: 8,
    textAlign: 'center',
    margin: 20,
    width: 130,
  },
  blueButton: {
    backgroundColor: '#2ab7ca',
  },
  greyButton: {
    backgroundColor: 'lightgrey',
  },
});
