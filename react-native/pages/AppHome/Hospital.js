import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, Text, ImageBackground, Dimensions, ScrollView, TouchableOpacity, Alert, TouchableHighlight, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import MapView from 'react-native-maps';
import { HeaderBackButton } from 'react-navigation-stack';
import call from 'react-native-phone-call';
import ItemHospitalList from '../../components/ItemHospitalList';
import { Hospitals } from '../../data/HospotalData'

const geolib = require('geolib');
const { height, width } = Dimensions.get("window");



export default class Hospital extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      scroll: true,
      hospitalChoose: '',
      region: {
        latitude: 32.342157,
        longitude: 34.912073,
        latitudeDelta: 0.0143,
        longitudeDelta: 0.5134,
      },
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Hospital",
      headerLeft: (
        <HeaderBackButton
          onPress={() => handleHeaderBackButton(navigation)}
          tintColor={'#FFF'}
        />
      ),

    };
  }

  componentDidMount() {
    // adding the event listener for back button android
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack()
    });

    // there is a problet to change state in component did mount
    navigator.geolocation.getCurrentPosition(
      position => this.setState({
        region: {
          ...this.state.region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        loading: false,
      }),
      error => alert(JSON.stringify(error)), {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000
    }
    );

  }

  componentWillUnmount = () => {
    // removing the event listener for back button android
    console.log('test=', BackHandler)
    BackHandler.removeEventListener();
  }

  handleHeaderBackButton = navigation => {
    console.log('navigation=', navigation)
    navigation.navigate({
      routeName: 'Home',
    })
  }

  handleBackButton = () => {
    this.props.navigation.goBack()
  }

  getLocation = () => {

  }

  _keyExtractor = (item, index) => item.key;


  handlePhoneCall = (phoneString) => {
    const args = {
      number: phoneString, // String value with the number to call
      prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
    }

    Alert.alert(
      '',
      'make a call to this hospital?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'call', onPress: () => { call(args).catch(console.error) } },
      ],
      { cancelable: false },
    );
  }



  render() {



    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.5 }}>
          <MapView style={styles.map}
            showsUserLocation={true}
            followsUserLocation={true}
            initialRegion={this.state.region}
          >
            {
              Hospitals.map((m, i) =>
                <MapView.Marker
                  coordinate={m.latLong}
                  title={m.title}
                  //description={m.description}
                  phone={m.phone}
                  key={`marker-${i}`}
                  onPress={() => this.setState({ hospitalChoose: m.title }),
                    () => this.markerClick(m.phone)}
                />
              )
            }
          </MapView>
        </View >
        <View style={{ flex: 0.5 }}>
          {!this.state.loading &&
            <ItemHospitalList
              currentLocation={this.state.region}
              onItemClick={phone => this.handlePhoneCall(phone)}
            />
          }

        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {

  },
  item: {
    margin: 10,
    padding: 10,
    fontSize: 12,
    height: '20%',
    backgroundColor: '#304251',
    color: 'white',
  },
  map: {
    height: '100%',
    alignSelf: 'stretch',
  },
  backgroundImage: {
    position: 'absolute',
    height: height,
    width: width,
    resizeMode: 'cover', // or 'stretch'
  },
  LinearGradientStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height
  },
});

