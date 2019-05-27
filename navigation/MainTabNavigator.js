import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import RecipeList from '../screens/RecipeList';

import CameraPage from '../screens/CameraPage';
import WatsonPage from '../screens/WatsonPage';

// nest stack navigator to handle two internal views
const ImageStack = createStackNavigator({
  Camera: CameraPage,
  Result: WatsonPage,
  Links: RecipeList,
});

// override some navigation options - set a pretty icon
ImageStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: 'home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-home'
          : 'md-home'
      }
    />
  ),
});

export default createBottomTabNavigator({
  ImageStack,
});
