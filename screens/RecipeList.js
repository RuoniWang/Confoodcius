import React, { Component } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  View,
  Image,
  Text,
  ListView,
  TouchableHighlight,
} from 'react-native';

import { WebBrowser } from 'expo';

class RecipeList extends Component {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params.query);
    this.state = {
      isLoading: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };

    this.renderrecipeCell = this.renderrecipeCell.bind(this);
  }

  componentDidMount() {
    if (this.props.navigation.state.params.query != null) {
      this.setState({ isLoading: true });
      this.getData();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.navigation.state.params.query !== prevProps.navigation.state.params.query) {
      this.getData();
    }
  }

  getData() {
    fetch(`https://api.edamam.com/search?q=${this.props.navigation.state.params.query}&app_id=eb29a8e3&app_key=5820c23571e700fd2fab296803c40936&from=2&to=20&calories=201-722&health=alcohol-free`)
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: this.state.dataSource.cloneWithRows(responseJson.hits),
        });
      })
      .catch(error => console.log(error)); // to catch the errors if any}
  }


   openRecipe = (url) => {
     WebBrowser.openBrowserAsync(url);
   };


   renderLoadingView() {
     return (
       <View style={styles.loading}>
         <ActivityIndicator size="large" color="#0000ff" />
       </View>
     );
   }


   renderrecipeCell(recipe) {
     const caloriesPerServing = Math.floor(recipe.recipe.calories / recipe.recipe.yield);
     return (
       <TouchableHighlight onPress={() => { this.openRecipe(recipe.recipe.url); }} underlayColor="orange">
         <View>
           <View style={styles.container}>
             <Image
               source={{ uri: recipe.recipe.image }}
               style={styles.thumbnail}
             />
             <View style={styles.rightContainer}>
               <View style={styles.detailedInfo}>
                 <Text numberOfLines={1} style={styles.title}>{recipe.recipe.label}</Text>
                 <Text style={styles.subtitle}>
Calories Per Serving:
                   {' '}
                   {' '}
                   {caloriesPerServing}
                 </Text>
                 <Text style={styles.subtitle}>
Servings:
                   {' '}
                   {' '}
                   {recipe.recipe.yield}
                 </Text>
                 <Text style={styles.subtitle}>
 Ingredients:
                   {' '}
                   {' '}
                   {recipe.recipe.ingredients.length}
                 </Text>
               </View>
               <Text style={[styles.subtitle, styles.greyText]}>
Source:
                 {' '}
                 {recipe.recipe.source}
               </Text>
             </View>
           </View>
           <View style={styles.separator} />
         </View>
       </TouchableHighlight>
     );
   }

   render() {
     const { isLoading, dataSource } = this.state;
     if (this.props.navigation.state.params.query == null) {
       return (
         <View style={styles.textContainer}>
           <Text style={styles.textStyle}>
          You haven not shown us the picture of your food yet! Click snap to take a picture.
           </Text>
         </View>
       );
     }
     if (isLoading) {
       return this.renderLoadingView();
     }
     return (
       <View>
         <ListView
           dataSource={dataSource}
           renderRow={this.renderrecipeCell}
           style={styles.listView}
         />
       </View>
     );
   }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgb(240,240,240)',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginRight: 5,
    backgroundColor: 'black',
  },
  rightContainer: {
    flex: 1,
    padding: 5,
    height: 100,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
  },
  detailedInfo: {
    flex: 1,
  },
  textStyle: {
    flex: 1,
    backgroundColor: 'white',
    fontSize: 18,
    width: '80%',
    textAlign: 'center',
    marginTop: 200,
    marginLeft: 30,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgb(200,200,200)',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listView: {
    backgroundColor: 'rgb(240,240,240)',
  },
  greyText: {
    color: 'grey',
  },

});

export default RecipeList;
