import React, { Component } from 'react';
import Login from './src/screens/Login';
import { StackNavigator } from 'react-navigation';
import Home from './src/screens/Home';
import Jobdetail from './src/screens/JobDetail';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

const Application = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header:false
    }
  },
  Home: {
    screen: Home,
    navigationOptions: {
      header:false
    }
  },
  Jobdetail:{
    screen:Jobdetail,
    navigationOptions:{

      title: 'Job Details',
      headerStyle: {
        height: 50,
        top: 0,   
        left: 0, 
        right: 0,   
      },
      headerTitleStyle:{
        alignSelf:'center',
        textAlign: 'center',
        width: '100%',
        color: '#000', 
        right: 40, 
      }, 
    }
  }
});

export default class App extends React.Component {  
  render() {
    return ( 
      <Application /> 
    );
  } 
}