import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { WeekbyWeekData } from '../../data/WeekbyWeekData';

import calendarStore from '../../mobx/CalendarStore';
import { observer } from 'mobx-react'




const { height, width } = Dimensions.get("window");

@observer
class Calendar extends Component {

    constructor(props) {
        super(props);

    }


    render() {
        // const { weeksData } = CalendarStore
        // console.log('props=', weeksData)

        //console.log('weekData=', calendarStore.filter(10))

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.pic}>
                    <Image source={require('../../assets/images/WeekbyWeekPictures/Week1.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />
                </View>
                <View style={styles.title}>
                    <View style={styles.flexRow}>
                        <TouchableOpacity
                            style={styles.btn}>
                            <Ionicons name="md-arrow-back" color="#FFF" size={25} />
                            <Text style={styles.txtBtn}>{WeekbyWeekData[0].key - 1}</Text>
                        </TouchableOpacity>
                        <View style={styles.midCircle}>
                            <Text style={styles.txtBtn}>{WeekbyWeekData[0].key}</Text>
                        </View>
                        <TouchableOpacity style={styles.btn}>
                            <Text style={styles.txtBtn}>{WeekbyWeekData[0].key + 1}</Text>
                            <Ionicons name="md-arrow-forward" color="#FFF" size={25} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.body}>
                    <View style={[styles.content, { height: '5%' }]}>
                        <View style={styles.progress}>

                        </View>
                    </View>
                    <View style={styles.content}>
                        <Text>Week/Day/Date/DaysToGo</Text>
                    </View>
                    <View style={styles.content}>
                        <Text>{WeekbyWeekData[0].body}</Text>
                    </View>
                </View>
            </View>
        )
    }

}

export default Calendar;

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
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: '#304251',
    },
    txtBtn: {
        alignSelf: 'center',
        color: '#FFF',
        fontWeight: "200",
        fontSize: 17
    },
    midCircle: {
        width: '11%',
        height: '97%',
        backgroundColor: '#7A306C',
        borderRadius: 60
    },
    body: {
        flex: 0.62,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#f6f6f6',
    },
    content: {
        top: '2%',
        width: width - 40,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        alignSelf: 'center',
        backgroundColor: '#FFF'
    },
    progress: {
        width: `${1 / 40 * 100}%`,
        height: '100%',
        backgroundColor: '#7A306C'
    },
})