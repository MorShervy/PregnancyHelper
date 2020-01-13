import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity, AsyncStorage, WebView, ActivityIndicator } from 'react-native'
import { Ionicons } from "@expo/vector-icons";

const APP_COLOR = '#304251';

const { height, width } = Dimensions.get("window");

const ItemCalendar = (props) => {
    console.log('item calender props==', props)
    return (
        <View></View>
    )
}

export default ItemCalendar;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pic: {
        flex: 0.3,
        width: '100%',
    },
    title: {
        flex: 0.08,
        width: '100%',

    },
    flexRow: {
        width: width - 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        top: '2%',
    },
    btn: {
        width: '22%',
        // height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: APP_COLOR,
    },
    txtBtn: {

        color: '#FFF',
        fontWeight: "200",
        fontSize: 17,
    },
    txtWeekNumber: {
        alignSelf: 'center',
        fontWeight: "700",
        color: APP_COLOR,
        fontSize: 50,
        left: 7,
        top: -5
    },
    txtString: {
        alignSelf: 'center',
        color: APP_COLOR,
        fontSize: 13,
        top: -12,
        fontWeight: '400'
    },
    txtDaysToGo: {
        alignSelf: 'center',
        color: APP_COLOR,
        fontSize: 10,
        fontWeight: '400'
    },
    midCircle: {
        position: 'absolute',
        top: -85,
        left: width / 4.3,
        width: width / 2.4,
        height: 160,
        borderColor: APP_COLOR,
        borderWidth: 5,
        backgroundColor: '#FFF',
        borderRadius: 15,
        opacity: 0.9

    },
    body: {
        flex: 0.62,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#f6f6f6',
        top: '6%',
    },
    content: {
        top: '2%',
        width: width - 40,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        alignSelf: 'center',
        backgroundColor: '#FFF',
        marginBottom: '3%'
    },
    progress: {
        height: 20,
        backgroundColor: APP_COLOR,
        width: width - 100
    },

})