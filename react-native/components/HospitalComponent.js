
import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, View, Text, ActivityIndicator, Dimensions, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from "@expo/vector-icons";
import { Hospitals } from '../data/HospitalData'
import ItemHospitalList from '../components/ItemHospitalList';
import MapView from 'react-native-maps';
import call from 'react-native-phone-call';

const { height, width, fontScale } = Dimensions.get("window");

const APP_COLOR = '#304251';


export default function HospitalComponent(props) {

    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState({
        latitude: 32.342157,
        longitude: 34.912073,
        latitudeDelta: 0.0143,
        longitudeDelta: 0.5134,
    });
    const [close, setClose] = useState(false);
    const [permission, setPermission] = useState(false)

    useEffect(() => {
        getCurrLocationAsync()
        const interval = setTimeout(() => {
            console.log('interval')
            setLoading(false)
        }, 1500);
        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        console.log('close hospital', 'close= ', close, 'loading=', loading)
        if (loading && close) {
            setClose(false)
        }
        else if (!loading) {
            setClose(false);
            props.handleCloseHospital()
        }
    }, [close])

    const getCurrLocationAsync = async () => {
        let result = await Location.getCurrentPositionAsync({});
        console.log('this state location true', JSON.stringify(result))
        let res = JSON.stringify(result);
        let location = await JSON.parse(res);
        console.log('res = ', location.coords.latitude, ' ', location.coords.longitude)
        setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta
        })
        // setLoading(false)
    }

    const renderHeader = () => (
        <View style={styles.headerForModal}>
            <View style={{ flex: 0.2 }}>
                <TouchableOpacity
                    style={{ paddingHorizontal: 20 }}
                    onPress={() => setClose(true)}
                >
                    <Ionicons name="md-arrow-back" color="#FFF" size={28} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Text style={styles.txtHeader}>Hospital</Text>
            </View>
        </View>
    )

    const handlePhoneCall = (phoneString) => {
        console.log('phoneString=', phoneString)
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

    return (
        <Modal
            visible={props.displayComponent}
            transparent={false}
            animationType={"slide"}
            onRequestClose={() => setClose(true)}
        >


            {
                loading &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading...</Text>
                    <ActivityIndicator
                        style={{ alignItems: 'center', justifyContent: 'center' }}
                        color={APP_COLOR}
                        size={30} />
                </View>
            }

            {
                !loading &&
                <View style={{ flex: 1 }}>
                    {renderHeader()}
                    <View style={{ flex: 0.5 }}>
                        <MapView style={styles.map}
                            showsUserLocation={true}
                            followsUserLocation={true}
                            initialRegion={region}
                        >
                            {
                                Hospitals.map((m, i) =>
                                    <MapView.Marker
                                        coordinate={m.latLong}
                                        title={m.title}
                                        //description={m.description}
                                        phone={m.phone}
                                        key={`marker-${i}`}
                                    // onPress={() => this.setState({ hospitalChoose: m.title })}
                                    />
                                )
                            }
                        </MapView>
                    </View >
                    <View style={{ flex: 0.5 }}>

                        <ItemHospitalList
                            currentLocation={region}
                            onItemClick={phone => handlePhoneCall(phone)}
                        />


                    </View>

                </View>
            }


        </Modal>
    )




}


const styles = StyleSheet.create({
    mainOuterContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000088'
    },
    headerForModal: {
        flex: 0.08,
        backgroundColor: APP_COLOR,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 3
    },
    txtHeader: {
        color: '#FFF',
        fontSize: 12 * fontScale,
        fontWeight: '500'
    },
    map: {
        height: '100%',
        alignSelf: 'stretch',
    },
})