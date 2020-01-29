import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ProgressBarAndroid, Dimensions, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { WeeksData } from '../../data/WeeksData';
import { Video } from 'expo-av';

import SQL from '../../handlers/SQL';
import ItemCalendarList from '../../components/ItemCalendarList';
import ImageCalendar from '../../components/ImageCalendar';

import { Dates } from '../../handlers/Dates';
import calendarStore from '../../mobx/CalendarStore';
import { observer } from 'mobx-react'
import userStore from '../../mobx/UserStore';
import pregnancyStore from '../../mobx/PregnancyStore';



const APP_COLOR = '#304251';
const ORANGE_COLOR = '#F4AC32';

const { height, width, fontScale } = Dimensions.get("window");


@observer class Calendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hidePrevBtn: false,
            hideNextBtn: false,
            currWeek: 0,
            week: 0,
            pregnant: null,
            weekData: null
        }

        pregnancyStore.getPregnancyByUserId(userStore.id)
        console.log('calendar constructor')
    }

    componentDidMount = async () => {
        console.log('didmount')
        const { week } = this.state;
        console.log('week1s=', week)
        let pregnant = await SQL.GetPregnancyByUserId(userStore.id)
        console.log('pregna=', pregnant)

        if (pregnant.Message === undefined) {
            console.log('true', pregnant.LastMenstrualPeriod)
            let difference_in_days = Dates.CalculateDaysDifferenceBetweenTwoDates(pregnant.LastMenstrualPeriod)
            console.log('(difference_in_days / 7)=', (difference_in_days / 7) - ((difference_in_days / 7) | 0))
            let getWeek = (difference_in_days / 7) | 0;
            const w = getWeek > 42 ? 42 : getWeek;
            // only for the first time

            if (calendarStore.currWeek === 0)
                calendarStore.setCurrWeek(w);
            const weekData = WeeksData.filter(week => week.key === w)[0]
            pregnancyStore.setCurrWeek(w)
            this.setState({ week: w, pregnant, weekData, currWeek: w })
        }
    }

    handlePreviousWeek = () => {
        console.log('sds', calendarStore.currWeek)
        if (this.state.week === 42)
            this.setState({ hideNextBtn: false })
        if (this.state.week > 2) {
            const weekData = WeeksData.filter(week => week.key === calendarStore.currWeek - 1)[0]
            const week = this.state.week - 1
            this.setState({ weekData, week })
        }
        else {
            console.log('pre btn else')
            const weekData = WeeksData.filter(week => week.key === calendarStore.currWeek - 1)[0]
            const week = this.state.week - 1
            this.setState({ hidePrevBtn: true, weekData, week })
        }
    }

    handleNextWeek = () => {
        console.log()
        if (this.state.week === 1)
            this.setState({ hidePrevBtn: false })

        if (this.state.week < 41) {
            const weekData = WeeksData.filter(week => week.key === calendarStore.currWeek + 1)[0]
            const week = this.state.week + 1
            this.setState({ weekData, week })
        }
        else {
            const weekData = WeeksData.filter(week => week.key === calendarStore.currWeek + 1)[0]
            const week = this.state.week + 1
            this.setState({ hideNextBtn: true, weekData, week })
        }

    }

    render() {
        const { hidePrevBtn, hideNextBtn, week, w, pregnant, weekData, currWeek } = this.state;
        console.log('week', week, pregnant)
        // console.log('pregnancyStore.pregnant=', pregnancyStore.pregnant)

        if (pregnant === null || week === 0) {
            return (
                <View style={{ flex: 1 }}>
                    <ActivityIndicator color={APP_COLOR} size={25} />
                </View>
            )
        }

        return (
            // <View style={{ flex: 1 }}>

            //     <ItemCalendarList
            //         weekData={week}
            //         week={w}
            //         currWeek={calendarStore.currWeek}
            //         handlePreviousWeek={this.handlePreviousWeek}
            //         handleNextWeek={this.handleNextWeek}
            //     />
            // </View>

            <View style={{ flex: 1 }}>

                <ScrollView
                    style={{ width: '100%' }}
                    contentContainerStyle={{ paddingVertical: 0, paddingBottom: 100 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        <View style={styles.pic}>
                            <ImageCalendar week={week} />
                        </View>
                        <View style={styles.title}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={styles.flexRow}>

                                    <TouchableOpacity
                                        style={[styles.btn, hidePrevBtn ? { backgroundColor: '#fff' } : null]}
                                        onPress={this.handlePreviousWeek}
                                        disabled={hidePrevBtn}
                                    >
                                        <Ionicons name="md-arrow-back" color="#FFF" size={25} />
                                        <Text style={styles.txtBtn}>{week - 1}</Text>
                                    </TouchableOpacity>


                                    <View style={styles.midCircle}>
                                        <View style={{ opacity: 1 }}>
                                            <Text style={styles.txtWeekNumber}>{week} </Text>
                                            <Text style={styles.txtString}>{currWeek !== week ? `\t\b\bWEEKS \n PREGNANT` : `WEEKS TODAY`}</Text>
                                            <View style={{ width: '80%', borderWidth: 0.5, alignSelf: 'center', borderColor: APP_COLOR, top: -10 }}>

                                            </View>
                                            {


                                                <Text style={styles.txtDaysToGo}> {
                                                    currWeek !== week ?
                                                        null
                                                        :
                                                        `Days to go: ${(Dates.GetDaysToGo(pregnant.DueDate) + 1) | 0}`}
                                                </Text>
                                            }

                                        </View>
                                    </View>
                                    {
                                        hideNextBtn ? null :
                                            <TouchableOpacity
                                                style={styles.btn}
                                                onPress={this.handleNextWeek}
                                            >
                                                <Text style={styles.txtBtn}>{week + 1}</Text>
                                                <Ionicons name="md-arrow-forward" color="#FFF" size={25} />
                                            </TouchableOpacity>
                                    }

                                </View>


                            </View>
                        </View>
                        <View style={styles.body}>
                            <View style={styles.content}>
                                <ImageBackground
                                    source={require('../../assets/images/bgCal.jpg')}
                                    style={{ width: width - 40, height: 100, alignSelf: 'center' }}
                                >
                                    <View style={{ width: width - 100, alignSelf: 'center', height: 45 }}>

                                        <Ionicons
                                            name="md-arrow-dropdown"
                                            color={APP_COLOR}
                                            size={40}
                                            style={{ left: `${week / 42 * 100 - 3}%`, top: -10 }}
                                        />
                                        <View style={{ top: -23, backgroundColor: '#f6f6f6' }}>
                                            <ProgressBarAndroid
                                                styleAttr="Horizontal"
                                                color='#E52B50'
                                                indeterminate={false}
                                                progress={currWeek / 42}
                                            />
                                        </View>

                                    </View>
                                    <View style={{}}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                            <Text style={{ color: APP_COLOR, fontWeight: '300', fontSize: 15 }}>WEEK {week} - DAY 3</Text>
                                            <Text style={{ color: APP_COLOR, fontWeight: '100', fontSize: 9 }}>(Nov 23 - Nov 30)</Text>
                                        </View>
                                        <Text style={{ color: APP_COLOR, fontWeight: '100', fontSize: 10, alignSelf: 'center', color: '#F4AC32' }}>Today: Nov 26, 2019</Text>

                                    </View>
                                </ImageBackground>
                            </View>

                            <View style={styles.content}>
                                <Text style={{ margin: 10, fontSize: 20, fontWeight: '500', color: APP_COLOR }}>{weekData.title}</Text>
                                <Text style={{ margin: 10, fontSize: 13, fontWeight: '200', color: '#A9A9A9' }}>{weekData.body}</Text>
                            </View>
                            <View style={[styles.content, {}]}>
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
                                    style={{ height: 300 }}
                                />


                            </View>
                        </View>
                    </View>
                </ScrollView >

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
        // flex: 0.4,
        height: 200,
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
        fontSize: 9 * fontScale,
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
        marginBottom: '3%',
        // paddingBottom: '4%'
    },
    progress: {
        height: 20,
        backgroundColor: APP_COLOR,
        width: width - 100
    },

})