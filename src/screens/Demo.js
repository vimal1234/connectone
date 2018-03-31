import React, { Component } from "react";
import { View, Text, FlatList,Picker, AsyncStorage, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import Global from './Global';
export default class Demo extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        status:''
      };
      this.onStateChange = this.onStateChange.bind(this); 
    }
    onStateChange(status) {
        alert(status);
        this.setState({ status:status });
      }
      Details = [
        {
          type: "Party",
          image: require("https://retailminded.com/wp-content/uploads/2013/02/OnlineOutreach.jpg")
        },
        {
          type: "Wedding",
          image: require("https://retailminded.com/wp-content/uploads/2013/02/OnlineOutreach.jpg")
        },
        {
          type: "Architecture",
          image: require("https://retailminded.com/wp-content/uploads/2013/02/OnlineOutreach.jpg")
        },
        {
          type: "Christening",
          image: require("https://retailminded.com/wp-content/uploads/2013/02/OnlineOutreach.jpg")
        }
  ];

  render() {
    let renderPhotoTypes = () => {
      let type = [];

      this.Details.map( ( item )=> {
        type.push(
          <View style={styles.imageSelectItem} key={item.type}>
            <TouchableWithoutFeedback>
              <View>
                <View style={styles.imageContainer}>
                  <Image style={styles.image} source={item.image}/>
                </View>
                <Text style={styles.text}>{item.type}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        );
      } );

      return type;
    };
}
}