import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity, AsyncStorage, WebView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { WeekbyWeekData } from '../../data/WeekbyWeekData';
import { Video } from 'expo-av';

import calendarStore from '../../mobx/CalendarStore';
import { observer } from 'mobx-react'
import userStore from '../../mobx/UserStore';
import pregnancyStore from '../../mobx/PregnancyStore';


const APP_COLOR = '#304251';

const { height, width } = Dimensions.get("window");

@observer
class Calendar extends Component {

    constructor(props) {
        super(props);
        AsyncStorage.getItem("user").then(
            res => JSON.parse(res)).then(
                res => res !== null &&
                    userStore.getUserAsync(res.ID)
            );
    }

    componentWillMount() {

    }

    componentDidMount() {

    }
    // _handleVideoRef = component => {
    //     const playbackObject = component;
    //     playbackObject.loadAsync({uri:'http://ruppinmobile.tempdomain.co.il/site08/PregnantVideo/Weeks20.mp4',header}, initialStatus = {}, downloadFirst = true)
    // }

    render() {
        const weekData = calendarStore.filter(20)[0]
        //console.log('weekData=', calendarStore.filter(10))
        // console.log('week=', weekData)
        const dateNow = new Date();

        if (userStore.user.ID !== undefined)
            pregnancyStore.getPregnancyByUserId(userStore.user.ID)

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.pic}>
                    <Image source={require('../../assets/images/WeekbyWeekPictures/Week20.jpg')} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />
                </View>
                <View style={styles.title}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={styles.flexRow}>
                            <TouchableOpacity
                                style={styles.btn}>
                                <Ionicons name="md-arrow-back" color="#FFF" size={25} />
                                <Text style={styles.txtBtn}>{weekData.key - 1}</Text>
                            </TouchableOpacity>

                            <View style={styles.midCircle}>
                                <View style={{ opacity: 1 }}>
                                    <Text style={styles.txtWeekNumber}>{weekData.key} </Text>
                                    <Text style={styles.txtString}>WEEKS TODAY</Text>
                                    <View style={{ width: '80%', borderWidth: 0.5, alignSelf: 'center', borderColor: APP_COLOR, top: -10 }}>

                                    </View>
                                    <Text style={styles.txtDaysToGo}>Days to go: 127</Text>

                                </View>
                            </View>
                            <TouchableOpacity style={styles.btn}>
                                <Text style={styles.txtBtn}>{weekData.key + 1}</Text>
                                <Ionicons name="md-arrow-forward" color="#FFF" size={25} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flexRow, { opacity: 0.3 }]}>
                            <Text style={{ color: APP_COLOR, fontSize: 12, left: -10 }}>Previous week</Text>
                            <Text style={{ color: APP_COLOR, fontSize: 12 }}>Next week</Text>
                        </View>

                    </View>
                </View>
                <View style={styles.body}>
                    <View style={styles.content}>
                        <View style={{ width: width - 100, alignSelf: 'center', height: 45 }}>
                            <Ionicons name="md-arrow-dropdown" color='#F4AC32' size={40} style={{ left: `${weekData.key / 40 * 100 - 3}%`, top: -10 }} />
                            <View style={{ borderWidth: 3, top: -23, borderColor: '#FFDAB9' }}>
                                <View style={[styles.progress, { width: `${weekData.key / 40 * 100}%` }]}>
                                    <Text style={{ alignSelf: 'center', fontSize: 12, fontWeight: '300', color: '#FFF' }}>
                                        {weekData.key > 5 ? weekData.key / 40 * 100 + '%' : null}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{}}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <Text style={{ color: APP_COLOR, fontWeight: '300', fontSize: 15 }}>WEEK 20 - DAY 3</Text>
                                <Text style={{ color: APP_COLOR, fontWeight: '100', fontSize: 9 }}>(Nov 23 - Nov 30)</Text>
                            </View>
                            <Text style={{ color: APP_COLOR, fontWeight: '100', fontSize: 10, alignSelf: 'center', color: '#F4AC32' }}>Today: Nov 26, 2019</Text>

                        </View>
                    </View>
                    <View style={styles.content}>
                        <Text style={{ margin: 10, fontSize: 20, fontWeight: '500', color: APP_COLOR }}>{weekData.title}</Text>
                        <Text style={{ margin: 10, fontSize: 13, fontWeight: '200', color: '#A9A9A9' }}>{weekData.body}</Text>
                    </View>
                    {/* <View style={[styles.content, {}]}>
                        <Text>Video</Text>
                        <Video
                            // ref={this._handleVideoRef}
                            source={{ uri: 'http://ruppinmobile.tempdomain.co.il/site08/PregnantVideo/Weeks20.mp4' }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            // shouldPlay
                            isLooping
                            style={{ height: 200 }}
                        />


                    </View> */}
                </View>
            </View >
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