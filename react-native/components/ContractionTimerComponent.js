
///     Contraction Timer Component     ///

// React Hooks functional component

import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, View, Text, Alert, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Information } from '../data/Information';
import { Dates } from '../handlers/Dates';

import InformationAlertComponent from './InformationAlertComponent';
import SQL from '../handlers/SQL'

const { height, width, fontScale } = Dimensions.get("window");
const APP_COLOR = '#304251';

export default function ContractionTimerComponent(props) {

    // State properties {get; set;}

    // boolean properties
    const [close, setClose] = useState(false)
    const [displayInfo, setDisplayInfo] = useState(false)
    const [loading, setLoading] = useState(true)
    const [openOption, setOpenOption] = useState(false)
    const [toggle, setToggle] = useState(false)
    const [start, setStart] = useState(false)
    const [stop, setStop] = useState(false)
    const [isTimeApartCalc, setIsTimeApartCalc] = useState(true)
    // Contractions Array 
    const [list, setList] = useState(null)
    // Data 
    const [startTime, setStartTime] = useState(null)
    const [timeApart, setTimeApart] = useState(null)
    const [date, setDate] = useState(null)
    const [avgLength, setAvgLength] = useState('')
    const [avgTimeApart, setAvgTimeApart] = useState('')
    // Timer
    const [hour1, setHour1] = useState('00')
    const [minute1, setMinute1] = useState('00')
    const [second1, setSecond1] = useState('00')
    const [hour2, setHour2] = useState('00')
    const [minute2, setMinute2] = useState('00')
    const [second2, setSecond2] = useState('00')


    // calling use effect function only for the first time of mounting component
    useEffect(() => {
        console.log('contraction timer use effect')
        getContractionListAsync()

        // 1 sec timeout 
        const interval = setTimeout(() => {
            setLoading(false)
        }, 1000);

        // return a function to clear interval when is done
        return () => clearInterval(interval);
    }, [])

    // calling use effect function when the state has changed - meaning setClose has called
    useEffect(() => {
        console.log('contraction timer use effect close= ', close, 'loading=', loading)
        // do not close while fetching
        // to prevent state updates on unmount component
        if (loading && close) {
            setClose(false)
        }
        else if (!loading) {
            setClose(false);
            props.handleCloseContractionTimer()
        }
    }, [close])


    // calling use effect function when the state has changed - meaning handleClickStart was called
    useEffect(() => {

        // if start is true
        if (start) {
            console.log('start', start)
            const d = new Date();
            const strStart = `${Dates.pad(d.getHours())}:${Dates.pad(d.getMinutes())}:${Dates.pad(d.getSeconds())}`
            const startTime = d.getTime();

            let timeApartString;
            let isValidTimeFormatSql = true;

            // In case contraction list back from server with data
            // We want to calculate the time apart from the last contraction start time in list
            // With the current contraction start time by calling method Dates.GetDiffByTwoDates(date1,date2)
            // And also check if the format of time apart is valid (range sql time(0) is 00:00:00 - 23:59:59)
            if (list !== null && list.Message === undefined) {
                timeApartString = Dates.GetDiffByTwoDates(new Date(list[list.length - 1].DateTime), new Date(d))
                isValidTimeFormatSql = parseInt(timeApartString.split(':')[0]) < 24
            }

            // in case of empty list 
            else {
                timeApartString = '00:00:00'
            }

            // Everytime the component initailized, the value of isTimeApartCalc TRUE 
            // It means 
            if (isTimeApartCalc) {

                console.log('timeApartString------------------------->>>>>>>>>>', timeApartString)
                if (isValidTimeFormatSql)
                    setTimeApart(timeApartString)
                else
                    setTimeApart('23:59:59')
            }
            else {
                console.log('`${hour2}:${minute2}:${second2}`=', `${hour2}:${minute2}:${second2}`)
                setTimeApart(`${hour2}:${minute2}:${second2}`)
            }

            setToggle(!toggle)
            setIsTimeApartCalc(false)
            setDate(d)
            setStartTime(strStart)

            const interval = setInterval(
                () => {
                    let t = new Date().getTime() - d.getTime()
                    let h = Dates.pad(Math.floor(((t / 1000) / 60) / 60))
                    let m = Dates.pad(Math.floor((t / 1000) / 60))
                    let s = Dates.pad(Math.floor((t / 1000) % 60))
                    // console.log('t=', t, '\nh=', h, '\nm=', m, '\ns=', s)
                    setHour1(h)
                    setMinute1(m)
                    setSecond1(s)
                }, 1000)
            return () => { clearInterval(interval) }
        }
        else {
            console.log('start else', start)

        }

    }, [start])

    const handleClickStart = () => {
        console.log(`handleClickStart====>>>> start=${start} stop=${stop}`)
        setHour1('00')
        setMinute1('00')
        setSecond1('00')
        setStop(false)
        setStart(true)
    }

    useEffect(() => {

        if (stop) {
            console.log('stop', stop)

            const d = new Date();
            const endTime = `${Dates.pad(d.getHours())}:${Dates.pad(d.getMinutes())}:${Dates.pad(d.getSeconds())}`
            const length = `${hour1}:${minute1}:${second1}`
            insertContraction(endTime, length)

            setHour2(hour1)
            setMinute2(minute1)
            setSecond2(second1)
            setToggle(!toggle)

            const interval = setInterval(
                () => {
                    let t = new Date().getTime() - date.getTime()
                    let h = Dates.pad(Math.floor(((t / 1000) / 60) / 60))
                    let m = Dates.pad(Math.floor((t / 1000) / 60))
                    let s = Dates.pad(Math.floor((t / 1000) % 60))
                    // console.log('t=', t, '\nh=', h, '\nm=', m, '\ns=', s)
                    setHour2(h)
                    setMinute2(m)
                    setSecond2(s)
                }, 1000)
            return () => { clearInterval(interval) }

        }
        else
            console.log('else stop', stop)
    }, [stop])

    const handleClickStop = () => {
        console.log(`handleClickStart====>>>> start=${start} stop=${stop}`)
        setStart(false)
        setStop(true)
    }

    const insertContraction = async (endTime, length) => {
        const sqlRes = await SQL.InsertContraction(props.userStore.id, startTime, endTime, length, timeApart, date)
        // console.log('InsertContraction=', sqlRes)
        getContractionListAsync()
    }

    const getContractionListAsync = async () => {
        // console.log('props=', props.userStore.id)
        let sqlRes = await SQL.GetContractionsByUserId(props.userStore.id)
        // console.log('sqlRes=', sqlRes)
        if (sqlRes !== null && sqlRes.Message === undefined) {
            let { length, diff } = Dates.AverageInLastHour(sqlRes)
            setAvgLength(length)
            setAvgTimeApart(diff)
            setList([...sqlRes])
        }
    }

    const handleDelete = () => {
        console.log('handleDelete')
        setOpenOption(false)
        Alert.alert(
            'Confirm delete',
            'Are you sure you want to delete all?',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => deleteAll() },
            ],
        )
    }

    const deleteAll = async () => {
        console.log('deleteAll')
        if (list !== null) {
            const sqlRes = await SQL.DeleteContractionByUserId(props.userStore.id)
            console.log('DeleteContractionByUserId=', sqlRes)
        }
        setHour1('00')
        setMinute1('00')
        setSecond1('00')
        setHour2('00')
        setMinute2('00')
        setSecond2('00')
        setToggle(false)
        setAvgLength('')
        setAvgTimeApart('')
        setList(null)
        setStart(false)
        setStop(false)
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
            <View style={{ flex: 0.55, paddingHorizontal: 2 }}>
                <Text style={styles.txtHeader}>Contraction Timer</Text>
            </View>
            <View style={{ flex: 0.10 }}>
                <TouchableOpacity
                    style={{ alignItems: 'center' }}
                    onPress={() => setDisplayInfo(true)}
                >
                    <Ionicons name="md-information-circle-outline" size={30} color={'#FFF'} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 0.15 }}>
                <TouchableOpacity
                    style={{ alignItems: 'center' }}
                    onPress={() => setOpenOption(!openOption)}
                >
                    <Ionicons name="md-more" size={30} color={'#FFF'} />
                </TouchableOpacity>
            </View>
        </View>
    )

    return (
        <Modal
            visible={props.displayComponent}
            transparent={false}
            animationType={"slide"}
            onRequestClose={() => setClose(true)}
        >
            <InformationAlertComponent
                handleCloseAlert={() => setDisplayInfo(false)}
                displayAlert={displayInfo}
                header={Information[0].header}
                body={Information[0].body}
            />

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
                <View style={{ flex: 1, backgroundColor: APP_COLOR, }}>
                    {renderHeader()}
                    {
                        openOption &&
                        <View
                            style={styles.moreOptToShow}
                        >
                            <TouchableHighlight
                                style={{ width: '100%', height: '100%', }}
                                onPress={() => handleDelete()}
                                underlayColor={'#d3d3d3'}

                            >
                                <Text style={styles.txtMoreOptToShow}>Delete All</Text>
                            </TouchableHighlight>
                        </View>
                    }
                    <View style={{ flex: 0.30, paddingVertical: 20 }}>
                        <View style={styles.timerContiener}>
                            <Text
                                style={{ fontSize: 40 * fontScale, color: '#FFFFFF', textAlign: 'center' }}
                            >
                                {hour1}:{minute1}:{second1}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', paddingVertical: 5, alignSelf: 'center' }}>
                            <Text style={{ fontSize: 12 * fontScale, color: '#FFF' }}>Time since last contraction :{'\b'}</Text>
                            <Text
                                style={{ fontSize: 12 * fontScale, color: '#FFF', textAlign: 'center' }}
                            >
                                {!toggle ? `${hour2}:${minute2}:${second2}` : `${hour1}:${minute1}:${second1}`}
                            </Text>
                        </View>

                        <View style={styles.RoundBtn} >
                            {
                                !toggle ?
                                    <TouchableOpacity
                                        onPress={() => handleClickStart()}
                                        style={[styles.button, { backgroundColor: '#F4AC32' }]}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.txtButton}>Start contraction</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => handleClickStop()}
                                        style={[styles.button, { backgroundColor: '#6b1c1c' }]}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.txtButton}>Stop contraction</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>

                    <View style={{ flex: 0.55 }}>
                        <View style={styles.styleTable}>
                            <View style={styles.styleHeadTable}>
                                <Text style={[styles.txtHeadTable, { width: '25%' }]}>Length</Text>
                                <Text style={[styles.txtHeadTable, { width: '35%' }]}>Time apart</Text>
                                <Text style={[styles.txtHeadTable, { width: '40%' }]}>Start and stop</Text>
                            </View>
                            {

                                list !== null &&
                                list.Message === undefined &&
                                <ScrollView
                                    style={{ height: '90%' }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <View style={{ flexDirection: 'column-reverse' }}>
                                        {list.map((lap, index) => (
                                            <Lap
                                                key={index}
                                                length={lap.Length}
                                                timeApart={lap.TimeApart}
                                                startTime={lap.StartTime}
                                                endTime={lap.EndTime}
                                            />
                                        ))}
                                    </View>
                                </ScrollView>
                            }
                        </View>
                    </View>

                    {
                        list !== null && list.Message === undefined &&
                        <View style={{ flex: 0.15, width: '100%', borderTopColor: '#FFF', borderTopWidth: 1 }}>
                            <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: '700', fontSize: 15 * fontScale }}>Average in last hour</Text>
                            <Text style={{ color: '#FFF', textAlign: 'center', paddingVertical: 5, fontSize: 13 * fontScale }}>
                                Length: {avgLength} | Time apart: {avgTimeApart}
                            </Text>
                        </View>
                    }
                </View>
            }


        </Modal>
    )

}

function Lap({ length, timeApart, startTime, endTime }) {
    // console.log('length=', length)

    const len = length.split(':')
    const h = len[0]
    const m = len[1]
    const s = len[2]

    // console.log('h=', h, 'm=', m, 's=', s)
    const lengthToShow = m !== "00" ? `${m}m ${s}s` : `${s}s`;

    const temp = timeApart.split(':');
    const hh = temp[0];
    const mm = temp[1];
    const ss = temp[2];

    const timeApartToShow = (hh !== "00" && `${(parseInt(hh) * 60) + parseInt(mm)}m ${ss}s`) ||
        (mm !== "00" && ss === "00" && `${mm}m`) ||
        (mm !== "00" && `${mm}m ${ss}s`) ||
        (ss === "00" && '--') ||
        `${ss}s`


    return (
        <TouchableOpacity
            style={styles.lap}
            onLongPress={() => console.log('longpress')}
        >
            <Text style={[styles.lapText, { width: '25%' }]}>{lengthToShow}</Text>
            <Text style={[styles.lapText, { width: '35%' }]}>{timeApartToShow}</Text>
            <Text style={[styles.lapText, { width: '40%' }]}>
                {startTime.split(':')[0] + ':' + startTime.split(':')[1]}
                {"\b"}-{"\b"}
                {endTime.split(':')[0] + ':' + endTime.split(':')[1]}
            </Text>


        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    headerForModal: {
        flex: 0.08,
        backgroundColor: APP_COLOR,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderBottomWidth: 0.5,
        borderBottomColor: '#e3e3e3'
        // padding: 3,
        // borderWidth: 1,
    },
    txtHeader: {
        color: '#FFF',
        fontSize: 12 * fontScale,
        fontWeight: '500'
    },
    moreOptToShow: {
        position: 'absolute',
        top: 19,
        right: 45,
        zIndex: 1,
        width: '40%',
        height: 40,
        backgroundColor: '#FFF',
        shadowColor: "rgba(0,0,0,1.0)",
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 100,
    },
    txtMoreOptToShow: {
        fontSize: 12 * fontScale,
        fontWeight: '500',
        color: APP_COLOR,
        top: 4,
        left: 10
    },
    timerContiener: {
        width: width - 50,
        alignSelf: 'center',
        paddingVertical: 5,
        borderColor: '#FFF',
        borderRadius: 50,
        borderWidth: 3,
    },
    RoundBtn: {
        alignSelf: 'center',
        paddingVertical: 20
    },
    button: {
        width: width - 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtButton: {
        textAlign: "center",
        fontWeight: '700',
        fontSize: 17 * fontScale,
        color: '#FFF',
    },
    lap: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#948D8C',
        // borderWidth: 1, borderColor: '#ff0000', // mor added
        paddingVertical: 10,
    },
    lapText: {
        color: 'white',
        fontSize: 11 * fontScale,
        fontWeight: '400',
        paddingHorizontal: 5,
        textAlign: 'center',
    },
    timer: {
        color: 'white',
        fontSize: 20 * fontScale,
        fontWeight: '200',
    },
    styleTable: {
        width, paddingVertical: 10
    },
    styleHeadTable: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#FFF',
        paddingHorizontal: 8,
        // borderWidth: 1,
        // borderColor: '#ff0000'
    },
    txtHeadTable: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14 * fontScale,

    }
})