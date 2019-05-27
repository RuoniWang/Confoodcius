// src/toolbar.component.js file
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
} from 'react-native';

export default (props) => {
  if (props.navigation.state.params.result.images[0].classifiers[0].classes.length === 0) {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.textStyle}>
          Oops, it seems that the picture is not identified as food objects. Click back to try again!
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <Image source={{ uri: props.navigation.state.params.captures.uri }} style={styles.image} />
        <Text style={styles.textStyle}>
            Watson is
          {' '}
          {props.navigation.state.params.result.images[0].classifiers[0].classes[0].score}
          {' '}
      confident that this is
          {' '}
          {props.navigation.state.params.result.images[0].classifiers[0].classes[0].class}
        </Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => { props.navigation.navigate('Camera'); }}>
          <Text style={[styles.button, styles.greyButton]}>retake</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { props.navigation.navigate('Links', { query: props.navigation.state.params.result.images[0].classifiers[0].classes[0].class }); }}>
          <Text style={[styles.button, styles.greenButton]}>Get Recipe!</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  subcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 18,
    width: '80%',
    textAlign: 'center',
  },
  image: {
    flex: 1,
    width: '50%',
    resizeMode: 'contain',
  },
  buttonRow: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  greenButton: {
    backgroundColor: '#2ab7ca',
  },
  greyButton: {
    backgroundColor: 'lightgrey',
  },
});
