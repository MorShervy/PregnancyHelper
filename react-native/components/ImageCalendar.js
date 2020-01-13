import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";


const ImageCalendar = props => {

    const pic = (props.weekData.key === 1 && <Image source={require('../assets/images/WeekbyWeekPictures/Week1.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 2 && <Image source={require('../assets/images/WeekbyWeekPictures/Week2.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 3 && <Image source={require('../assets/images/WeekbyWeekPictures/Week3.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 4 && <Image source={require('../assets/images/WeekbyWeekPictures/Week4.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 5 && <Image source={require('../assets/images/WeekbyWeekPictures/Week5.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 6 && <Image source={require('../assets/images/WeekbyWeekPictures/Week6.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 7 && <Image source={require('../assets/images/WeekbyWeekPictures/Week7.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 8 && <Image source={require('../assets/images/WeekbyWeekPictures/Week8.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 9 && <Image source={require('../assets/images/WeekbyWeekPictures/Week9.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 10 && <Image source={require('../assets/images/WeekbyWeekPictures/Week10.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 11 && <Image source={require('../assets/images/WeekbyWeekPictures/Week11.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 12 && <Image source={require('../assets/images/WeekbyWeekPictures/Week12.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 13 && <Image source={require('../assets/images/WeekbyWeekPictures/Week13.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 14 && <Image source={require('../assets/images/WeekbyWeekPictures/Week14.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 15 && <Image source={require('../assets/images/WeekbyWeekPictures/Week15.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 16 && <Image source={require('../assets/images/WeekbyWeekPictures/Week16.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 17 && <Image source={require('../assets/images/WeekbyWeekPictures/Week17.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 18 && <Image source={require('../assets/images/WeekbyWeekPictures/Week18.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 19 && <Image source={require('../assets/images/WeekbyWeekPictures/Week19.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 20 && <Image source={require('../assets/images/WeekbyWeekPictures/Week20.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 21 && <Image source={require('../assets/images/WeekbyWeekPictures/Week21.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 22 && <Image source={require('../assets/images/WeekbyWeekPictures/Week22.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 23 && <Image source={require('../assets/images/WeekbyWeekPictures/Week23.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 24 && <Image source={require('../assets/images/WeekbyWeekPictures/Week24.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 25 && <Image source={require('../assets/images/WeekbyWeekPictures/Week25.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 26 && <Image source={require('../assets/images/WeekbyWeekPictures/Week26.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 27 && <Image source={require('../assets/images/WeekbyWeekPictures/Week27.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 28 && <Image source={require('../assets/images/WeekbyWeekPictures/Week28.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 29 && <Image source={require('../assets/images/WeekbyWeekPictures/Week29.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 30 && <Image source={require('../assets/images/WeekbyWeekPictures/Week30.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 31 && <Image source={require('../assets/images/WeekbyWeekPictures/Week31.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 32 && <Image source={require('../assets/images/WeekbyWeekPictures/Week32.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 33 && <Image source={require('../assets/images/WeekbyWeekPictures/Week33.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 34 && <Image source={require('../assets/images/WeekbyWeekPictures/Week34.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 35 && <Image source={require('../assets/images/WeekbyWeekPictures/Week35.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 36 && <Image source={require('../assets/images/WeekbyWeekPictures/Week36.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 37 && <Image source={require('../assets/images/WeekbyWeekPictures/Week37.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 38 && <Image source={require('../assets/images/WeekbyWeekPictures/Week38.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 39 && <Image source={require('../assets/images/WeekbyWeekPictures/Week39.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.weekData.key === 40 && <Image source={require('../assets/images/WeekbyWeekPictures/Week40.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)

    return (
        <View>
            {pic}
        </View>
    )
}

export default ImageCalendar;