import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SearchScreen from './screens/SearchScreen';
import BookTransactionScreen from './screens/BookTransactionScreen';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { render } from 'react-dom';

export default class App extends React.Component {
  render(){
  return (
    <AppContainer></AppContainer>
  );
  }
}

const TabNavigator = createBottomTabNavigator({

  Transaction:{screen:BookTransactionScreen},
  Search:{screen:SearchScreen}

})
const AppContainer = createAppContainer(

  TabNavigator

)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
