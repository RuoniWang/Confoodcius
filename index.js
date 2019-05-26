import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';

const URL = 'https://api.edamam.com/search?q=lasagna&app_id=eb29a8e3&app_key=5820c23571e700fd2fab296803c40936&from=0&to=3&calories=201-722&health=alcohol-free';

export default class Source extends React.Component {
static navigationOptions = ({ navigation }) => {
  return {
    title: 'Source Listing',
    headerStyle: { backgroundColor: '#fff' },
    headerTitleStyle: { textAlign: 'center', flex: 1 },
  };
};

constructor(props) {
  super(props);
  this.state = {
    loading: true,
    dataSource: [],
  };
}

componentDidMount() {
  fetch(URL)
    .then(response => response.json())
    .then((responseJson) => {
      this.setState({
        loading: false,
        dataSource: responseJson,
      });
    })
    .catch(error => console.log(error)); // to catch the errors if any
}
}
