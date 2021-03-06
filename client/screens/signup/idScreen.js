import React from 'react';
import { View, Text, Button, StyleSheet, Alert, ToastAndroid } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { connect } from 'react-redux';

import { checkEmail } from '../../actions';

class idScreen extends React.Component {
  state = {
    email: ''
  }

  handleEmail = (text) => {
    this.setState({ email: text })
  }

  verifyEmail = (email) => {
    var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (!regExp.test(email)) {
      ToastAndroid.show('이메일 형식이 올바르지 않습니다.', ToastAndroid.SHORT);  
    } else {
      this.props.checkEmail(email);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.emailText}>이메일</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid='transparent'
            placeholder=" 이메일"
            value={this.state.email}
            onChangeText={this.handleEmail}
          />
          <Button
            style={styles.button}
            onPress={() => this.verifyEmail(this.state.email)}
            disabled={!this.state.email}
            // onPress={()=>this.props.navigation.navigate('CheckPw', { email : this.state.email})}
            title="다음"
          />
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>이미 계정이 있으신가요?</Text>
          <Text 
            style={styles.loginText2}
            onPress={()=>this.props.navigation.navigate('Login')}>로그인</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingTop: Expo.Constants.statusBarHeight,
  },
  topContainer: {
    flex: 0.95,
    paddingTop: 20, 
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray'
  },
  emailText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    height: 33,
    borderColor: 'lightgray',
    backgroundColor: '#f2f2f2',
    textDecorationColor: 'gray',
    marginBottom: 20
  },
  button: {
    width: '100%',
    marginTop: 50,
    padding: 5
  },
  loginContainer: {
    flex: 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: 'gray',
    fontSize: 10,
    marginRight: 10,
    textAlign: 'center'  
  },
  loginText2: {
    color: 'steelblue',
    fontSize: 10,
    textAlign: 'center'
  }
})

export default connect(null, { checkEmail })(idScreen);