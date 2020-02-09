import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Dimensions, Alert, BackHandler, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import MapView from 'react-native-maps';
import { HeaderBackButton } from 'react-navigation-stack';
import { NavigationActions } from 'react-navigation';
import call from 'react-native-phone-call';
import ItemHospitalList from '../../components/ItemHospitalList';
import { Hospitals } from '../../data/HospitalData'


const geolib = require('geolib');
const { height, width } = Dimensions.get("window");

const APP_COLOR = '#304251';

export default class Hospital extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: null,
      errorMessage: null,
      counter: 0,
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
          // disabled={false}
          onPress={() => {
            console.log('navigation.state.params=', navigation.state.params)
            if (navigation.state.params !== undefined && !navigation.state.params.isLoading) {
              const navigateAction = NavigationActions.navigate({
                routeName: 'Home',
                params: { isLoading: false },
                action: NavigationActions.navigate({ routeName: 'Tools' }),
              });

              navigation.dispatch(navigateAction);
            }
          }}
          tintColor={'#FFF'}
        />
      ),

    };
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let result = await Location.getCurrentPositionAsync({});
    console.log('this state location true', JSON.stringify(result))
    let res = JSON.stringify(result);
    let location = await JSON.parse(res);
    console.log('res = ', location.coords.latitude, ' ', location.coords.longitude)

    this.setState({
      region: {
        ...this.state.region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      loading: false
    }, () => this.props.navigation.setParams({ isLoading: false }));

  };

  componentDidMount = async () => {

    console.log('hospital didMount ')


    this.props.navigation.setParams({ isLoading: true })
    // adding the event listener for back button android
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount = () => {
    // removing the event listener for back button android

    BackHandler.removeEventListener();
  }

  handleBackButton = () => {

    const navigateAction = NavigationActions.navigate({
      routeName: 'Home',
      action: NavigationActions.navigate({ routeName: 'Tools' }),
    });

    this.props.navigation.dispatch(navigateAction);
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
    const { loading } = this.state;
    const { isLoading } = this.props.navigation.state


    if (loading) {
      return (
        <View style={{ flex: 1 }}>
          <ActivityIndicator color={APP_COLOR} size={25} />
        </View>
      )
    }

    // console.log('this.state.region=', this.state.region)

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
                  onPress={() => this.setState({ hospitalChoose: m.title })}
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

