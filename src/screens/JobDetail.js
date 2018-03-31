import React, { Component } from "react";
import { View, Image, Text, FlatList, AsyncStorage, Button, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { StackNavigator } from 'react-navigation';
import DatePicker from 'react-native-datepicker'
import Global from './Global';
import { ImagePicker, Constants } from 'expo';
//import Header from './Header';
import { List, ListItem, SearchBar } from "react-native-elements";

export default class jobDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      Authorization: '',
      data: [],
      error: null,
      message: '',
      searchString: '',
      latitude: null,
      longitude: null,
      pickerResult: null,
      imagedata: null,
      RouteId: '',
      techId: '',
      accountNumber: '',
      imgurii: ''
    };
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );

  }
  componentWillMount() {
    navigator.geolocation.clearWatch(this.watchId);
    this._getjobDetail();
  }
  _getjobDetail = async () => {

    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;

    Authorization = "bearer " + Global.ACCESS_TOKEN;
    RouteId = params.id;
    this.setState({ RouteId: RouteId });

    fetch(Global.BASE_URL + "Routesdetails", {
      method: "POST",
      headers: {

        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': Authorization
      },
      body: "RouteId=" + RouteId

    }).then((response) => response.json())
      .then((response) => {

        if (response.exceptionMessage) {
          this.setState({ message: response.exceptionMessage });
        }
        else {
          this.setState({ data: response });
          this.setState({ RouteId: response[0].RouteId });
          this.setState({ techId: response[0].tech_id });
          this.setState({ accountNumber: response[0].account_number });
          if(response[0].imagebase64!=null){
            this.setState({imagedata: response[0].imagebase64})
          }
         
         /* for(let obj of this.state.imagedata)
          
          {

            alert(obj.ImagePath);
          }
          */
        }

      }).catch(err => {
        alert("Some Network Problem Occure");
      });

  }
  //Call main function 
  _pickImg = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      base64: true,
      allowsEditing: false,
      aspect: [4, 3],
    });

    this.setState({
      pickerResult,
    });

    let imageUri = pickerResult ? `data:image/jpg;base64,${pickerResult.base64}` : null;

    var AuthorizationData = "bearer " + Global.ACCESS_TOKEN;

    var latitude = this.state.latitude;
    var longitude = this.state.longitude;

    let localUri = imageUri;
    //formData.append('imagebase64', { uri: localUri, name: filename, type });

    var params = {
      RouteId: this.state.RouteId,
      tech_id: this.state.techId,
      account_number: this.state.accountNumber,
      latitude: latitude,
      longitude: longitude,
      imagebase64: localUri,
    };

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch(Global.BASE_URL + 'Image', {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': AuthorizationData
      },
      body: formBody

    }).then((response) => response.json())
      .then((response) => {

        if (response.exceptionMessage) {
            this.setState({message:response.exceptionMessage});
        } else {
        alert("Image Uploaded successfully");
        
        }
      }).catch(err => {
            alert("Some Network Problem Occure");
      });

  };

  onButtonPress = () => {

    Global.ACCESS_TOKEN = "NULL"
    this.props.navigation.navigate('Login');
    //this.props.navigation.navigate('DateSearch');
    //});

  }
  render() {

    //let { pickerResult } = this.state;
    //let imageUri = pickerResult ? `data:image/jpg;base64,${pickerResult.base64}` : null;

    const { navigate } = this.props.navigation;
    return (
      <List>


        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
                <View style={styles.container}>
                 <Text style={styles.welcome}>Job Number:{item.Job_Number}</Text>
                <Text style={styles.instructions}> Assigned Date:{item.Assigned_Date} </Text>
              <Text style={styles.instructions}>Address:{item.Address} </Text>
              <Text style={styles.instructions}>City:{item.City} </Text>
              <Text style={styles.instructions}>Status:{item.Status} </Text>
              <Text style={styles.instructions}>Job Type:{item.Job_type}</Text>
              <Text style={styles.instructions}>Dispatch Notes:{item.Dispatch_Note}</Text>
              <Text style={styles.instructions}>Tech Notes:{item.Tech_Notes}</Text>
             <View style={{ margin: 15 }}>

                <Button onPress={this._pickImg}
                  title="Take Pictures"
                />
             
              </View>
            </View>
          )}
          keyExtractor={item => item.RouteId}

        />

            
        <FlatList
          data={this.state.imagedata}
          renderItem={({ item }) => (
            <View style={{ margin:15 }}>
             <Image
                  source={{ uri: 'http://'+item.ImagePath }}
                  style={{
                    width: 100,
                    height: 100
                  }}
                  resizeMode={'cover'}
                />
           
            </View>
          )}
          keyExtractor={item => item.ImagePath}

        />
          
      </List>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',

  },
  Job: {
    margin: 10,
    minWidth: 300,
    flexWrap: 'wrap',
    height: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    color: '#000',

  },


  input: {
    margin: 30,
    minWidth: 300,
    borderColor: "blue",
    flexWrap: 'wrap',
    height: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 10,

    color: '#000',
    //marginBottom : 10
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    borderColor: "blue"
  },
  buttonContainer: {
    backgroundColor: '#2980b6',
    paddingVertical: 15
  }
});