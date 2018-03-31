import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import {
  AppRegistry,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Button,
  Alert,
  ActivityIndicator,
  AsyncStorage,
  View,
  Image
} from 'react-native';
import Global from './Global';
export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username:'',
      password:'',
      isLoggingIn: false,
      message: ''
    }
   
   }
   
  componentDidMount(){ 
   
     // AsyncStorage.getItem('token').then((value) => {
  
      if(Global.ACCESS_TOKEN!== "NULL" )
      {
             this.props.navigation.navigate('Home');
      }
      //this.props.navigation.navigate('Home');
  }
    _userLogin = () => {

      this.setState({ isLoggingIn: true, message: '' });

      var params = { 
          username: this.state.username, 
          password: this.state.password,
          grant_type: 'password'
      };

      var formBody = [];
      for (var property in params) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(params[property]);
          formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      fetch(Global.BASE_URL+"auth", {
              method: "POST",
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: formBody
          })
          .then((response) => response.json())
          .then((response) => {
             console.log(response);
                
              if (response.token_type=="bearer"){
                //AsyncStorage.setItem('token', response.access_token);
                Global.ACCESS_TOKEN=response.access_token;  
                this.props.navigation.navigate('Home');
                
                }else{
                   this.setState({isLoggingIn:false,message: response.error_description });
               }
          }).catch(err => {
            this.setState({isLoggingIn: false, message: err.message });
      });
  }
  clearUsername = () => {
    this._username.setNativeProps({ text: '' });
    this.setState({ message: '' });
}

clearPassword = () => {
    this._password.setNativeProps({ text: '' });
    this.setState({ message: '' });
}


 
  render() {
    
    return (
      <View style={styles.container}>
          <View style = {styles.logoConten}>
            <Image
             style = {styles.logo}
             source={require('../images/logo.png')} />
             </View>
          <KeyboardAvoidingView behavior = "padding" style={styles.formcontainer}>
         <TextInput
          placeholder = "User name or email"
          placeholderTextColor = '#cccccc'
	    	  underlineColorAndroid= 'transparent' 
		      returnKeyType="next"
          keyboardType = "email-address"
          autoCorrect = {false}
          autoCapitalize = "none"
          onSubmitEditing = {()=> this.passwordInput.focus()}
          ref={component => this._username = component}
          onChangeText={(username) => this.setState({username})}
         // autoFocus={true}
					onFocus={this.clearUsername}
          style = {styles.input}>
          
        </TextInput>

        <TextInput
          placeholder ="Password"
		      placeholderTextColor ='#cccccc'
		      underlineColorAndroid= 'transparent'
          secureTextEntry
          returnKeyType="go"
          ref = {(input)=>this.passwordInput = input}
          onChangeText={(password) => this.setState({password})}
           style = {styles.input}>
                   
        </TextInput>
       
   
        
        {!!this.state.message && (
					<Text
						style={{fontSize: 14, color: 'red', padding: 5}}>
						{this.state.message}
					</Text>
        )}
        
				{this.state.isLoggingIn && <ActivityIndicator />}
				<View style={{margin:7}} />
        <TouchableOpacity >
           <Button onPress={this._userLogin} 
		      		title="Login"
		      	/>
           </TouchableOpacity>

      </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c0d6e0',
  },
  logoConten:{
    marginTop:50,
    flexGrow :1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleApp: {
    width : 200,
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
    color :'#ffffff'
  },
  logo:{
    width:150,
    height: 100
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  formcontainer: {
    flex: 1,
    marginBottom:50,
  },
  input:{
    minWidth:300,
    flexWrap:'wrap',
    height : 40,
    backgroundColor: '#fff',
    paddingHorizontal : 10,
    color:'#000',
    marginBottom : 10
  },
  buttonContainer:{
    backgroundColor: "#1980b9",
    paddingVertical:10,
 
  },
  loginbutton:{
    color:"#841584"
  }
 
});
