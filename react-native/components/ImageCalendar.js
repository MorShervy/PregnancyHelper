import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";


const ImageCalendar = props => {
    // console.log('props=', props.week)
    const pic = (props.week === 1 && <Image source={require('../assets/images/WeekbyWeekPictures/Week1.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 2 && <Image source={require('../assets/images/WeekbyWeekPictures/Week2.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 3 && <Image source={require('../assets/images/WeekbyWeekPictures/Week3.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 4 && <Image source={require('../assets/images/WeekbyWeekPictures/Week4.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 5 && <Image source={require('../assets/images/WeekbyWeekPictures/Week5.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 6 && <Image source={require('../assets/images/WeekbyWeekPictures/Week6.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 7 && <Image source={require('../assets/images/WeekbyWeekPictures/Week7.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 8 && <Image source={require('../assets/images/WeekbyWeekPictures/Week8.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 9 && <Image source={require('../assets/images/WeekbyWeekPictures/Week9.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 10 && <Image source={require('../assets/images/WeekbyWeekPictures/Week10.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 11 && <Image source={require('../assets/images/WeekbyWeekPictures/Week11.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 12 && <Image source={require('../assets/images/WeekbyWeekPictures/Week12.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 13 && <Image source={require('../assets/images/WeekbyWeekPictures/Week13.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 14 && <Image source={require('../assets/images/WeekbyWeekPictures/Week14.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 15 && <Image source={require('../assets/images/WeekbyWeekPictures/Week15.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 16 && <Image source={require('../assets/images/WeekbyWeekPictures/Week16.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 17 && <Image source={require('../assets/images/WeekbyWeekPictures/Week17.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 18 && <Image source={require('../assets/images/WeekbyWeekPictures/Week18.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 19 && <Image source={require('../assets/images/WeekbyWeekPictures/Week19.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 20 && <Image source={require('../assets/images/WeekbyWeekPictures/Week20.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 21 && <Image source={require('../assets/images/WeekbyWeekPictures/Week21.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 22 && <Image source={require('../assets/images/WeekbyWeekPictures/Week22.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 23 && <Image source={require('../assets/images/WeekbyWeekPictures/Week23.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 24 && <Image source={require('../assets/images/WeekbyWeekPictures/Week24.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 25 && <Image source={require('../assets/images/WeekbyWeekPictures/Week25.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 26 && <Image source={require('../assets/images/WeekbyWeekPictures/Week26.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 27 && <Image source={require('../assets/images/WeekbyWeekPictures/Week27.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 28 && <Image source={require('../assets/images/WeekbyWeekPictures/Week28.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 29 && <Image source={require('../assets/images/WeekbyWeekPictures/Week29.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 30 && <Image source={require('../assets/images/WeekbyWeekPictures/Week30.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 31 && <Image source={require('../assets/images/WeekbyWeekPictures/Week31.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 32 && <Image source={require('../assets/images/WeekbyWeekPictures/Week32.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 33 && <Image source={require('../assets/images/WeekbyWeekPictures/Week33.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 34 && <Image source={require('../assets/images/WeekbyWeekPictures/Week34.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 35 && <Image source={require('../assets/images/WeekbyWeekPictures/Week35.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 36 && <Image source={require('../assets/images/WeekbyWeekPictures/Week36.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 37 && <Image source={require('../assets/images/WeekbyWeekPictures/Week37.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 38 && <Image source={require('../assets/images/WeekbyWeekPictures/Week38.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 39 && <Image source={require('../assets/images/WeekbyWeekPictures/Week39.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)
        ||
        (props.week === 40 && <Image source={require('../assets/images/WeekbyWeekPictures/Week40.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />)

    return (
        <View>
            {pic}
        </View>
    )
}

export default ImageCalendar;