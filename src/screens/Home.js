import React, { Component } from "react";
import { View, Text, FlatList, AsyncStorage,Picker,TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { StackNavigator } from 'react-navigation';
import { List, ListItem, SearchBar } from "react-native-elements";
import DatePicker from 'react-native-datepicker'
import Global from './Global';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobstatus:'',
      Authorization: '',
      data: [],
      error: null,
      message: '',
      searchString: '',
      date: ''
    };
    this.onStateChange = this.onStateChange.bind(this); 
  }

  componentDidMount() {

    this._getjobList();
  }

  _getjobList = async () => {


    //   var value = await AsyncStorage.getItem('token');
    Authorization = "bearer " + Global.ACCESS_TOKEN;
    fetch(Global.BASE_URL + "Routes", {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': Authorization
      },

    }).then((response) => response.json())
      .then((response) => {

        if (response.exceptionMessage) {
          this.setState({ message: response.exceptionMessage });
        } else {
          this.setState({ data: response });
        }

      }).catch(err => {
        alert("Some Network Problem Occure");
      });

  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: 0
        }}
      />
    );
  };
  
  onStateChange(status) { 
    
    this.setState({jobstatus:status});
    this._searchByFilter();

  }
  setSearchText(event) {
    let searchstr = event.nativeEvent.text;
    this.setState({ searchString: searchstr });
    this._searchByFilter();

  }
  onDateChange(date) {
    this.setState({ date: date });
    this._searchByFilter();
  }


  _searchByFilter = () => {
  
      var params = {
      jobdate: this.state.date,
      Searchtext: this.state.searchString,
      status: this.state.jobstatus
    };
    Authorization = "bearer " + Global.ACCESS_TOKEN;
   
    var formBody = [];

    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
  
    fetch(Global.BASE_URL + "Routes", {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': Authorization
      },
      body: formBody
    }).then((response) => response.json())
      .then((response) => {
        if (response.exceptionMessage) {
          this.setState({ message: response.exceptionMessage });
        } else {
          this.setState({ data: response });
        }

      }).catch(err => {
        alert("Some Network Problem Occure");
      });

  }



  render() {
    const { navigate } = this.props.navigation;
    return (
      <List containerStyle={{borderTopWidth: 0, backgroundColor: "#ffffff" }}>
        <View>
        <TextInput
          style={styles.searchBar}
          value={this.state.searchText}
          placeholder="Search..."
          placeholderTextColor='#a09999'
          onChange={this.setSearchText.bind(this)} />

        <DatePicker
          style={{ width: 200 }}
          date={this.state.date}
          mode="date"
          //placeholder="Select Date"
          format="MM/DD/YYYY"
          // minDate="2016-05-01"
          // maxDate="2016-06-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 10
            },
            dateInput: {
              marginLeft: 50,
              width: 200
            }
            // ... You can check the source to find the other keys.
          }}
          onDateChange={(date) => this.onDateChange(date)}
        />
        <View style={styles.statusbox}> 
           <Picker selectedValue = {this.state.jobstatus} onValueChange = {st => this.onStateChange(st)}>
               <Picker.Item label = "Select Status" value = "" />
               <Picker.Item label = "Reassigned" value = "re-assigned" />
               <Picker.Item label = "Pending" value = "pending" />
            </Picker>
       </View>
       
      </View>      

        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <View>
            <View style={{margin:15,padding:5}}>
            <Text>Assigned Date:{item.job_date} </Text>
            <Text>Job Age: {item.job_age} </Text>
            <Text>Job Number: {item.job_number}</Text>
            <Text>Job Type: {item.job_type}</Text>
            </View>
            <ListItem
              roundAvatar
              title={`${item.first_name} ${item.last_name}`}
              subtitle={item.address}
              containerStyle={{ borderBottomWidth: 0 }}
              onPress={() => navigate("Jobdetail", { id: item.RouteId, first_name: item.first_name, last_name: item.last_name, job_date: item.job_date, address: item.address, city: item.city, home_phone: item.home_phone, job_number: item.job_number, Description: item.Description, job_type: item.job_type })}

            />
            </View>
          )}
          ItemSeparatorComponent={this.renderSeparator}
       //   ListHeaderComponent={this.renderHeader}
          keyExtractor={item => item.RouteId}


        />
      </List>
    );
  }
}

export default Home;
const styles = StyleSheet.create({
  searchBar: {
    margin:10,
    fontSize: 22,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor:'#c0d6e0'
 
  },
  statusbox: {
     margin:5,
      borderWidth: 1,
      borderColor:'#E4E4E4',
      width:200,
      height:50,

  }
});