import React from 'react';
import '../shim';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, Platform,
} from 'react-native';
import { Camera, Permissions } from 'expo';
import Toolbar from './toolbar';

const RESULTS = {
  images: [
    {
      classifiers: [
        {
          classifier_id: 'DefaultCustomModel_267056391',
          name: 'Default Custom Model',
          classes: [
            {
              class: 'Fish',
              score: 0.721,
            },
          ],
        },
      ],
      image: 'burrito.jpg',
    },
  ],
  images_processed: 1,
  custom_classes: 2,
};


const createFormData = (captures, body) => {
  const data = new FormData();

  data.append('food', {
    uri: Platform.OS === 'ios' ? captures.uri.replace('file://', '') : captures.uri,
  });

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  console.log(JSON.stringify(data));
  return data;
};

export default class CameraPage extends React.Component {
    camera = null;

    state = {
      captures: null,
      // setting flash to be turned off by default
      flashMode: Camera.Constants.FlashMode.off,
      capturing: null,
      // start the back camera by default
      cameraType: Camera.Constants.Type.back,
      hasCameraPermission: null,
    };

    async componentDidMount() {
      const camera = await Permissions.askAsync(Permissions.CAMERA);
      const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');

      this.setState({ hasCameraPermission });
    }

    setFlashMode = flashMode => this.setState({ flashMode });

    setCameraType = cameraType => this.setState({ cameraType });

    handleShortCapture = async () => {
      this.setState({ capturing: true });
      const photoData = await this.camera.takePictureAsync();
      this.setState({ capturing: false, captures: photoData });
    };

    // call API later
    getRecipe = async () => {
      const { captures } = this.state;
      const results = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: createFormData(this.state.captures, { userId: '123' }),
      })
        .then(response => response.json())
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log('upload error', error);
        });
      console.log(this.props.navigation.state);
      this.props.navigation.navigate('Result', { result: RESULTS, captures, navigation: this.props.navigation });
      this.setState({ captures: null });
    };


    retake=() => this.setState({ captures: null });

    render() {
      const {
        captures, hasCameraPermission, flashMode, cameraType, capturing,
      } = this.state;
      if (hasCameraPermission === null) {
        return <View />;
      } else if (hasCameraPermission === false) {
        return <Text>Access to camera has been denied. Please go to settings to enable access to camera and microphone.</Text>;
      }
      if (captures == null) {
        return (
          <View style={styles.container}>
            <Camera
              type={cameraType}
              flashMode={flashMode}
              style={styles.preview}
              ref={camera => this.camera = camera}
            />
            <Toolbar
              capturing={capturing}
              flashMode={flashMode}
              cameraType={cameraType}
              setFlashMode={this.setFlashMode}
              setCameraType={this.setCameraType}
              onShortCapture={this.handleShortCapture}
            />
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
    backgroundColor: 'green',
  },
  greyButton: {
    backgroundColor: 'lightgrey',
  },
});
