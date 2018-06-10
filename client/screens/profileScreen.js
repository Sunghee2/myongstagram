import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    AsyncStorage
} from "react-native";
import { Button } from 'native-base'
var { height, width } = Dimensions.get('window');
import { Ionicons, Foundation } from "@expo/vector-icons";
import { connect } from 'react-redux';

import { getUser, getMyPost } from '../actions';
import Card from '../components/card';

class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    if (state.params) {
      console.log(state.params.title);
      
      return {
        headerTitle: `${state.params.title}`,
        headerLeft: 
          <Ionicons
            name='md-person-add'
            size={23}
            style={{paddingLeft: 13}}
          />,
        headerRight:
          <Ionicons
            name='ios-clock-outline'
            size={25}
            style={{paddingRight: 13}}
          />,
        headerTitleStyle: {
          textAlign: 'center',
          alignSelf: 'center'
        }             
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      user: {
        username: '',
        name: '',
        profileImage: ''
      }
    };
  }

  componentWillMount() {
    this.props.getMyPost();
    AsyncStorage.getItem('user')
      .then( data => {
        data = JSON.parse(data);
        const {setParams} = this.props.navigation;
        setParams({title: data.username});
        this.setState(prevState => ({
          user: {
            ...prevState.user,
            username: data.username,
            name: data.name,
            profileImage: data.profileImage
          }
        }));
      })
    // this.props.getUser();
    // this.props.getMyPost();
    // const {setParams} = this.props.navigation;
    // // const {setParams} = this.props.user;
    // setParams({username: this.props.user.user.username});
  }

  // componentWillReceiveProps() {
  //   if (this.props.user) {
  //     const user = this.props.user.user;
  //     console.log("설정  " + user.username);
  //     this.props.navigation.setParams({username: user.username});
  //   }
  // }

  tabClicked(tabIndex) {
    this.setState({
      tabIndex
    });
  }

  imageClicked(post) {
    this.props.navigation.navigate('Detail', { post: post, user: this.state.user});
  }
  

  renderImage() {
    return this.props.my_post.map((post, index) => {
      return (
        <TouchableOpacity key={index.toString()} onPress={() => this.imageClicked(post)}>
          <View style={[
            { width: width / 3 }, 
            { height: width / 3}, 
            { marginBottom: 2 }, 
            index % 3 !== 0 ? {paddingLeft: 2} : {paddingLeft: 0}
          ]}>
            <Image source={{uri: post.image}} 
              style={{
                flex: 1,
                alignSelf: 'stretch',
                width: undefined,
                height: undefined,
              }}/>
          </View>
        </TouchableOpacity>
      );
    });
  }

  renderTab() {
    if (this.state.tabIndex == 0) {
      return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
          {this.renderImage()}
        </View>
      );
    } else if (this.state.tabIndex == 1) {
      var data = [];
      if (this.props.my_post) {
        this.props.my_post.map(post => {
          data.push({ key: post.id.toString(), username: this.state.user.username, profileImage: this.state.user.profileImage, image: post.image, content: post.content, createdAt: post.createdAt});
        })
      }
      return (
        <View>
          <FlatList
            data={data}
            renderItem={ ({item}) => <Card key={item.key} item={item}/>}
          />
        </View>
      );
    }
  }

  renderTabButton() {
    return (
      <View style={styles.tabButtonView}>
        <Button
          onPress={() => this.tabClicked(0)}
          transparent
          active={this.state.tabIndex == 0}
        >        
          <Foundation name='thumbnails' size={23} color={this.state.tabIndex == 0? 'black':'gray'}/>
        </Button>
        <Button
          onPress={() => this.tabClicked(1)}
          transparent active={this.state.tabIndex == 1}>
          <Ionicons name='ios-list-outline' size={23} color={this.state.tabIndex == 1? 'black':'gray'}/>
        </Button>
        <Button
          onPress={() => this.tabClicked(2)}
          transparent active={this.state.tabIndex == 2}>
          <Ionicons name='ios-contact-outline' size={23} color={this.state.tabIndex == 2? 'black':'gray'}/>
        </Button>
        <Button
          onPress={() => this.tabClicked(3)}
          transparent last active={this.state.tabIndex == 3}>
          <Ionicons name='ios-bookmark-outline' size={23} color={this.state.tabIndex == 3? 'black':'gray'}/>
        </Button>
      </View>
    );
  }

  render() {
    const posts = this.props.my_post;
    if (!posts || !this.state.user) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color='blue'/>
        </View>
      );
    }
    return (
      <View style={styles.Container}>  
        <View style={{paddingTop: 10}}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                source={this.state.user.profileImage? { uri: this.state.user.profileImage } : require('../image/profile.jpg')}
                style={styles.profilePhoto}
              />
              <Text style={{ fontSize: 12 }}>{this.state.user.name}</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.headerRightTop}>
                <View style={styles.headerRightTopView}>
                  <Text>{this.props.my_post.length}</Text>
                  <Text style={styles.headerText}>게시물</Text>
                </View>
                <View style={styles.headerRightTopView}>
                  <Text>205</Text>
                  <Text style={styles.headerText}>팔로워</Text>
                </View>
                <View style={styles.headerRightTopView}>
                  <Text>201</Text>
                  <Text style={styles.headerText}>팔로잉</Text>
                </View> 
              </View>
              <View style={styles.headerRightBottom}>
                <TouchableOpacity 
                  onPress={()=>this.props.navigation.navigate('EditUser', { user: this.state.user })}
                  style={{flex: 7, borderWidth: 1, borderRadius: 5, borderColor: 'lightgray', justifyContent: 'center', alignItems: 'center', height: '100%', marginRight: 10}}>
                  <Text style={{fontSize: 12, textAlign: 'center'}}>프로필 수정</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flex: 1, borderWidth: 1, borderRadius: 5, borderColor: 'lightgray', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                  <Ionicons name='ios-settings' size={20}/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View>
          {this.renderTabButton()}
          {this.renderTab()}
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  // return { user: state.user };
  return { my_post: state.my_post};
}

export default connect(mapStateToProps, { getUser, getMyPost })(ProfileScreen);

const styles = StyleSheet.create({
  Container: {
      flex: 1,
      backgroundColor: 'white'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
    height: 50,
    paddingTop: Expo.Constants.statusBarHeight
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold'
  }, 
  tabButtonView: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    borderTopWidth: 1, 
    borderTopColor: '#eae5e5'
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray'
  },
  headerLeft: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 6,
    flexDirection: 'column'
  },
  headerRightTop: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  headerRightTopView: {
    alignItems: 'center'
  },
  headerRightBottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 5
  },
  button: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profilePhoto: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
  headerText: {
    fontSize: 10,
    color: 'gray'
  },

});