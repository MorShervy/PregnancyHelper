import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, TouchableOpacity,Alert,TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import MapView from 'react-native-maps';
const { height, width } = Dimensions.get("window");


import call from 'react-native-phone-call';
import { FlatList } from 'react-native-gesture-handler';
const geolib = require('geolib');


//transfer to database:

// componentDidMount() {this.fetchData();}fetchData = () => {this.setState({loading: true});fetch("")
// .then(response => response.json())
// .then(responseJson => {
//   responseJson = responseJson.map(item => {
//     item.isSelect = false;
//     item.selectedClass = styles.list;
//   return item;
// });this.setState({
//   loading: false,
//   dataSource: responseJson,
// });
// }).catch(error => {this.setState({loading: false});
// });
// };FlatListItemSeparator = () => <View style={styles.line} />;selectItem = data => {
// data.item.isSelect = !data.item.isSelect;
// data.item.selectedClass = data.item.isSelect?
//               styles.selected: styles.list;
// const index = this.state.dataSource.findIndex(
//   item => data.item.id === item.id
// );
// this.state.dataSource[index] = data.item;
// this.setState({
//   dataSource: this.state.dataSource,
// });
// };goToStore = () =>this.props.navigation.navigate("Expenses", {selected: this.state.selected,});renderItem = data =>
//   <TouchableOpacity
//     style={[styles.list, data.item.selectedClass]}      
//     onPress={() => this.selectItem(data)}
//   >
//   <Image
//     source={{ uri: data.item.thumbnailUrl }}
//     style={{ width: 40, height: 40, margin: 6 }}
//   />
//   <Text style={styles.lightText}>  {data.item.title.charAt(0).toUpperCase() + data.item.title.slice(1)}  </Text>
// </TouchableOpacity>render() {
// const itemNumber = this.state.dataSource.filter(item => item.isSelect).length;if (this.state.loading) {return (
// <View style={styles.loader}>
//  <ActivityIndicator size="large" color="purple" />
// </View>
// );
// }
const Hospitals = [
    {
      key: '1',
      title: 'Hillel Yaffe Medical Center',
      description: '.',
       phone: '0544444444',
      latLong: {
        latitude: 32.452023,
        longitude:34.895678,
      },
    },
    {
      key: '2',
      title: ' Laniado Hospital',
      description: '.',
       phone: '0544444444',
      latLong: {
        latitude:32.345663,
        longitude:34.855901,
      },
    },
    {
      key: '3',
      title: 'Assaf Harofeh Hospital',
      description: '.',
       phone: '0544444444',
      latLong: {
        latitude: 31.966995,
        longitude:34.839231,
      },
    },
    
  ];

export default class Hospital extends Component {
    static navigationOptions = {
        header: null,
    };



    state = {

      // loading: false,
      // dataSource: [],



      hospitalChoose:'',
   
      region: {
        latitude: 32.342157,
        longitude:34.912073,
        latitudeDelta: 0.0143, 
        longitudeDelta: 0.5134,
      },
    };

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
    //   console.log(
    //     'You are ',
    //     geolib.getDistance(this.state.region, {
    //         latitude: 32.341293,
    //         longitude: 34.913906,
    //     }),
    //     'meters away from hospital 1'
    // );
    }


    // FlatListItemSeparator = () => {
    //   return (
    //     <View
    //       style={{
    //         height: 1,
    //         width: "100%",
    //         padding:2,
    //         backgroundColor: "#607D8B",
    //       }}
    //     />
    //   );
    // }

callFromList=(phoneString)=>
{
  const args = {
    number: phoneString, // String value with the number to call
    prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
  }

  call(args).catch(console.error)
}

    markerClick =(phoneString) =>
    {



      
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
          {text: 'call', onPress: () => { call(args).catch(console.error)}},
        ],
        {cancelable: false},
      );

     
    }

    render() {
        return (
            <View style={styles.container}>

               
                <LinearGradient
                    colors={['#00000070', '#00000070']}
                    style={styles.LinearGradientStyle}
                >
 <View>

                
<View >  
    

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
              
              onPress={()=>this.setState({hospitalChoose:m.title}),
                
                () => this.markerClick(m.phone)  }
            />
          )
        }


          </MapView>

    
    
     </View>
     <View>
<Text style={{fontSize:30,color:'black',textAlign:'center'}}>hospitals</Text>
<FlatList
          data={ Hospitals }
          // ItemSeparatorComponent = {this.FlatListItemSeparator}
  // renderItem={({item}) => <Text> {item.title} {item.phone}</Text>}
  renderItem={({item}) => {
    return(
      <TouchableHighlight onPress={() => this.callFromList(item.phone)}
                 style={styles.button}>
 
           <Text >{item.title}, {item.phone}, you are : {geolib.getDistance(this.state.region, item.latLong)} meters away</Text>
      </TouchableHighlight>
    )
  }}
        />





</View>

{/* <View>
<Text>maps</Text>
</View> */}

     </View>

                </LinearGradient>
            </View >
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        // height: 170,
        // margin: 10,
        // borderWidth: 1,
        height: 200,
        alignSelf: 'stretch',
        borderColor: '#000000',
        
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
    textStyle: {
        color: '#fff',
        textAlign: 'center',
    },
    buttonsStyle: {
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height / 3,
    },
    btnStyle: {
        width: width - 50,
        height: 50,
        borderRadius: 7,
    },

    button: {
      marginTop:10,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:30,
    marginRight:30,
    backgroundColor:'#00BCD4',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
    },

    txtBtnStyle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 7.5,
    }
});
