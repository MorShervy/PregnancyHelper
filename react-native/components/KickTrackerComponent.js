import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, ScrollView, View, Text, ActivityIndicator, TouchableHighlight, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Information } from '../data/Information';
import { Dates } from '../handlers/Dates';
import InformationAlertComponent from './InformationAlertComponent';
import SQL from '../handlers/SQL'



const { height, width, fontScale } = Dimensions.get("window");
const APP_COLOR = '#304251';
const GREY_COLOR = '#8e8e8e';
const DARKBLUE_COLOR = '#1B1B3A';

export default function KickTrackerComponent(props) {

    const [loading, setLoading] = useState(true)
    const [hour, setHour] = useState("00")
    const [minute, setMinute] = useState("00")
    const [second, setSecond] = useState("00")
    const [startTimer, setStartTimer] = useState(false)
    const [kickCount, setKickCount] = useState(0)
    const [list, setList] = useState(null)
    const [displayInfo, setDisplayInfo] = useState(false)
    const [close, setClose] = useState(false)
    const [openOption, setOpenOption] = useState(false)
    const [date, setDate] = useState(null)
    const [start, setStart] = useState(null)



    useEffect(() => {
        console.log('kick tracker use effect', props.pregnantId)
        GetKickTrackerListAsync()

    }, [])

    useEffect(() => {
        console.log('timer ->>>>>>>>>>>>>>>>>>>>>', startTimer)
        if (startTimer) {
            const date = new Date();
            const start = `${Dates.pad(date.getHours())}:${Dates.pad(date.getMinutes())}:${Dates.pad(date.getSeconds())}`
            const startTime = date.getTime();

            setStart(start);
            setDate(date);

            const interval = setInterval(
                () => {
                    let t = new Date().getTime() - startTime
                    let h = Dates.pad(Math.floor(((t / 1000) / 60) / 60))
                    let m = Dates.pad(Math.floor((t / 1000) / 60))
                    let s = Dates.pad(Math.floor((t / 1000) % 60))
                    console.log('t=', t, '\nh=', h, '\nm=', m, '\ns=', s)
                    setHour(h)
                    setMinute(m)
                    setSecond(s)
                }, 1000)
            return () => { clearInterval(interval) }
        }

    }, [startTimer])

    useEffect(() => {
        console.log('kick tracker use effect close= ', close, 'loading=', loading)
        if (loading && close) {
            setClose(false)
        }
        else if (!loading) {
            setClose(false);
            props.handleCloseKickTracker()
        }
    }, [close])

    const GetKickTrackerListAsync = async () => {

        let sqlRes = await SQL.GetKickTrackerByPregnantId(props.pregnantId)
        console.log('list=', sqlRes)
        setList(sqlRes)
        setLoading(false)

    }

    const handleDelete = async () => {
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
                { text: 'OK', onPress: () => handleDeleteAllRowsFromDB() },
            ],
        )

    }

    const handleDeleteAllRowsFromDB = async () => {
        console.log('handleDeleteAllRowsFromDB')
        const sqlRes = await SQL.DeleteKickTrackerByPregnantId(props.pregnantId)
        console.log('sql res=', sqlRes)
        GetKickTrackerListAsync()
        setHour("00")
        setMinute("00")
        setSecond("00")
    }

    const handleStartTimer = () => {
        console.log('start timer')
        setStartTimer(true)
    }

    const handleKick = async () => {

        if (kickCount > 8) {
            setStartTimer(false);
            setKickCount(kickCount + 1)
            const length = `${hour}:${minute}:${second}`;
            const sqlRes = await SQL.InsertKickTracker(props.pregnantId, date, length, start, kickCount + 1)
            GetKickTrackerListAsync()
            setKickCount(0);
            setHour("00")
            setMinute("00")
            setSecond("00")
            return;
        }

        setKickCount(kickCount + 1)
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
                <Text style={styles.txtHeader}>Kick Tracker</Text>
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

    const renderKickBar = () => {
        let arr = new Array(10)
        for (let i = 0; i < arr.length; i++) {
            if (i < kickCount) arr[i] = 1
            else arr[i] = 0
        }
        return (
            arr.map((item, key) => (
                <View
                    key={key}
                    style={[
                        { width: '80%', height: 16, borderTopWidth: 5, borderColor: '#FFF', alignSelf: 'center' },
                        item === 0 ? { backgroundColor: GREY_COLOR } : { backgroundColor: APP_COLOR }
                    ]}>
                </View>
            )))
    }

    const Row = ({ i, date, time, length, kicks }) => {
        // console.log('key=', i % 2)
        var d = new Date(date)
        var dd = new Date(d)
        const dateSplit = dd.toDateString().split(' ')
        const dateToShow = `${dateSplit[1]} ${dateSplit[2]}, ${dateSplit[3]}`

        const timeSplit = time.split(':')
        const timeToShow = `${timeSplit[0]}:${timeSplit[1]}`

        const lengthSplit = length.split(':')
        const h = parseInt(lengthSplit[0])
        const m = parseInt(lengthSplit[1])
        const s = parseInt(lengthSplit[2])
        const lengthToShow = (h === 0 && m === 0 && `${s}s`) ||
            (h === 0 && m !== 0 && s !== 0 && `${m}m ${s}s`) ||
            (h === 0 && m !== 0 && s === 0 && `${m}m`) ||
            (h !== 0 && m !== 0 && `${h}h ${m}m`) ||
            (h !== 0 && m === 0 && s !== 0 && `${h}h ${s}s`) ||
            (h !== 0 && m === 0 && s === 0 && `${h}h`);

        const bg_color = i % 2 === 0 ? '#F0F0F0' : null

        return (
            <TouchableOpacity style={[styles.row, { backgroundColor: bg_color }]}>
                <Text style={[styles.txtRow, { width: '34%' }]}>{dateToShow}</Text>
                <Text style={[styles.txtRow, { width: '23.5%' }]}>{timeToShow}</Text>
                <Text style={[styles.txtRow, { width: '25%' }]}>{lengthToShow}</Text>
                <Text style={[styles.txtRow, { width: '17.5%' }]}>{kicks}</Text>
            </TouchableOpacity>
        )
    }



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
                header={Information[1].header}
                body={Information[1].body}
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
                <View style={{ flex: 1 }}>
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

                    <View style={styles.mainOuterHeader}>
                        <View style={styles.mainKickCount}>
                            <View style={styles.progressBar}>
                                {renderKickBar()}
                            </View>
                            <View style={styles.viewKickCount}>
                                <Text style={styles.txtKickCount}>
                                    {kickCount}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.mainTimer}>
                            <View style={styles.timer}>
                                <Text style={styles.txtTimer}>{hour}:{minute}:{second}</Text>
                            </View>
                            <View style={styles.mainButtons}>
                                <TouchableOpacity
                                    style={[styles.button, !startTimer ? { backgroundColor: APP_COLOR } : { backgroundColor: GREY_COLOR }]}
                                    onPress={() => handleStartTimer()}
                                    disabled={startTimer}
                                >
                                    <Text style={styles.txtBtn}>Start timer</Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    style={[styles.button, !startTimer ? { backgroundColor: GREY_COLOR } : { backgroundColor: APP_COLOR }]}
                                    onPress={() => handleKick()}
                                    disabled={!startTimer}
                                >
                                    <Text style={styles.txtBtn}>Kick</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>

                    <View style={{ flex: 0.75 }}>
                        <View style={styles.styleTable}>
                            <View style={styles.styleHeadTable}>
                                <Text style={[styles.txtHeadTable, { width: '34%' }]}>Date</Text>
                                <Text style={[styles.txtHeadTable, { width: '23.5%' }]}>Time</Text>
                                <Text style={[styles.txtHeadTable, { width: '25%' }]}>Length</Text>
                                <Text style={[styles.txtHeadTable, { width: '17.5%' }]}>Kicks</Text>
                            </View>

                            {
                                list !== null && list.Message === undefined &&
                                <ScrollView
                                    style={{ height: '90%' }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <View style={{ flexDirection: 'column-reverse' }}>
                                        {
                                            list.map((row, index) => (
                                                <Row
                                                    key={index}
                                                    i={index}
                                                    date={row.Date}
                                                    time={row.Time}
                                                    length={row.Length}
                                                    kicks={row.Kicks}
                                                />
                                            ))
                                        }
                                    </View>
                                </ScrollView>
                            }

                        </View>
                    </View>

                </View>

            }


        </Modal>
    )
}

const styles = StyleSheet.create({
    headerForModal: {
        flex: 0.08,
        backgroundColor: APP_COLOR,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
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

    mainButtons: { flex: 0.65, justifyContent: 'space-evenly', alignItems: 'center' },
    button: {
        width: '90%',
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtBtn: { color: '#FFF', fontWeight: 'bold', fontSize: 14 * fontScale },
    txtKickCount: { fontWeight: '100', fontSize: 70 * fontScale, color: DARKBLUE_COLOR },
    mainOuterHeader: { flex: 0.25, flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 10 },
    mainKickCount: { width: '55%', flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 10 },
    progressBar: { width: '20%', height: '100%', flexDirection: 'column-reverse', paddingBottom: 5 },
    viewKickCount: { width: '80%', justifyContent: 'center', alignItems: 'center' },
    mainTimer: { width: '45%', flexDirection: 'column' },
    timer: { flex: 0.35, justifyContent: 'center', alignItems: 'center' },
    txtTimer: { fontSize: 27 * fontScale, color: '#000' },
    styleTable: { width, paddingVertical: 10 },
    styleHeadTable: { flexDirection: 'row', backgroundColor: APP_COLOR, paddingHorizontal: 4 },
    txtHeadTable: { fontWeight: '700', fontSize: 14 * fontScale, color: '#FFF', textAlign: 'center', borderLeftWidth: 3, borderLeftColor: '#FFF' },
    row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#948D8C', paddingVertical: 10, },
    txtRow: { paddingHorizontal: 5, color: APP_COLOR, fontSize: 11 * fontScale, fontWeight: '400', textAlign: 'center' },

})