import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, Text, ImageBackground, Dimensions, ScrollView, TouchableOpacity, Alert, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import MapView from 'react-native-maps';
import { HeaderBackButton } from 'react-navigation-stack';
import call from 'react-native-phone-call';

const geolib = require('geolib');
const { height, width } = Dimensions.get("window");



export default class Hospital extends Component {
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

  state = {
    scroll: true,
    hospitalChoose: '',
    region: {
      latitude: 32.342157,
      longitude: 34.912073,
      latitudeDelta: 0.0143,
      longitudeDelta: 0.5134,
    },
  };

  _keyExtractor = (item, index) => item.key;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => this.setState({
        region: {
          ...this.state.region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

      }),
      error => alert(JSON.stringify(error)), {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000
    }
    );
  }
  markerClick = (phoneString) => {
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

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#000",

        }}
      />
    );
  };
  render() {

    handleHeaderBackButton = navigation => {
      console.log('navigation=', navigation)
      navigation.navigate({
        routeName: 'Home',
      })
    }

    return (

      <View style={{}}>
        <View style={{ height: '50%' }}>
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
        <View style={styles.container}>
          <FlatList
            style={{ flexDirection: 'row' }}
            contentContainerStyle={{ alignItems: 'center' }}
            data={Hospitals}
            keyExtractor={this._keyExtractor}
            renderItem={({ item }) =>
              <Text style={styles.item}
                onPress={() => this.markerClick(item.phone)}>{item.title}, {item.phone}, you are : {geolib.getDistance(this.state.region, item.latLong)} meters away</Text>}
            ItemSeparatorComponent={this.renderSeparator}
          />
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
    height: '50%',
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

const Hospitals = [
  {
    key: '1',
    title: 'Hillel Yaffe Medical Center',
    description: '.',
    phone: '0544444444',
    latLong: {
      latitude: 32.452023,
      longitude: 34.895678,
    },
  },
  {
    key: '2',
    title: ' Laniado Hospital',
    description: '.',
    phone: '0544444444',
    latLong: {
      latitude: 32.345663,
      longitude: 34.855901,
    },
  },
  {
    key: '3',
    title: 'Assaf Harofeh Hospital',
    description: '.',
    phone: '0544444444',
    latLong: {
      latitude: 31.966995,
      longitude: 34.839231,
    },
  },
  {
    key: '4',
    title: 'Assaf Harofeh Hospital',
    description: '.',
    phone: '0544444444',
    latLong: {
      latitude: 31.966995,
      longitude: 34.839231,
    },
  },
  {
    key: '5',
    title: 'Assaf Harofeh Hospital',
    description: '.',
    phone: '0544444444',
    latLong: {
      latitude: 31.966995,
      longitude: 34.839231,
    },
  },
  {
    key: '6',
    title: 'Assaf Harofeh Hospital',
    description: '.',
    phone: '0544444444',
    latLong: {
      latitude: 31.966995,
      longitude: 34.839231,
    },
  },
  {
    key: '7',
    title: 'Assaf Harofeh Hospital',
    description: '.',
    phone: '0544444444',
    latLong: {
      latitude: 31.966995,
      longitude: 34.839231,
    },
  },
  {
    key: '38',
    title: 'Assaf Harofeh Hospital',
    description: '.',
    phone: '0544444444',
    latLong: {
      latitude: 31.966995,
      longitude: 34.839231,
    },
  },
  {
    key: '55',
    title: 'Assaf Harofeh Hospital',
    description: '.',
    phone: '0544444444',
    latLong: {
      latitude: 31.966995,
      longitude: 34.839231,
    },
  },

];