import React, { Component } from 'react';
import { StyleSheet, BackHandler, ScrollView, View, Text, ImageBackground, Dimensions, TouchableOpacity, Alert, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { HeaderBackButton } from 'react-navigation-stack';
import { observer } from 'mobx-react'
import contractionStore from '../../mobx/ContractionStore';
import moment from 'moment';

const APP_COLOR = '#304251';
const { height, width } = Dimensions.get("window");



@observer
export default class ContractionTimer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            h: "00",
            m: "00",
            s: "00",
            hh: "00",
            mm: "00",
            ss: "00",
            list: [],
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Contraction timer",
            headerLeft: (
                <HeaderBackButton
                    onPress={() => handleHeaderBackButton(navigation)}
                    tintColor={'#FFF'}
                />
            ),

        };
    }

    handleHeaderBackButton = navigation => {
        console.log('navigation=', navigation)
        navigation.navigate({
            routeName: 'Home',
        })
    }

    componentDidMount = () => {
        // adding the event listener for back button android
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount = () => {

        // removing the event listener for back button android
        // console.log('test=', BackHandler)
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        clearInterval(this.timer1)
        clearInterval(this.timer2)
    }




    handleBackButton = () => {
        this.props.navigation.goBack()
    }

    start = () => {
        clearInterval(this.timer2)
        const { hh, mm, ss } = this.state;
        const d = new Date();

        const startTime = `${d.getHours()}:${this.pad(d.getMinutes())}`
        const start = d.getTime();
        const timeApart = (mm !== "00" && ss === "00" && `${mm}m`) ||
            (mm !== "00" && `${mm}m ${ss}s`) ||
            (ss === "00" && '--') ||
            `${ss}s`


        this.setState({
            toggle: true,
            start,
            startTime,
            timeApart,
            h: "00", m: "00", s: "00", hh: "00", mm: "00", ss: "00"
        })
        this.timer1 = setInterval(
            () => {
                let t = new Date().getTime() - start
                this.setState({
                    h: this.pad(Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
                    m: this.pad(Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))),
                    s: this.pad(Math.floor((t % (1000 * 60)) / 1000)),
                })
            },
            1000
        )
    }

    stop = () => {
        clearInterval(this.timer1)
        const { h, m, s, hh, mm, ss, start, startTime, timeApart } = this.state;
        const d = new Date();

        const endTime = `${d.getHours()}:${this.pad(d.getMinutes())}`
        const length = m !== "00" ? `${m}m ${s}s` : `${s}s`;


        // console.log('lalala=', h, ':', m, ':', s)
        console.log('length=', length)
        console.log('timeApart=', timeApart)
        console.log(`${startTime} - ${endTime}`)
        // contractionStore.addContraction(length, timeApart, startTime, endTime)
        var itemToAdd = this.state.list.concat({ length, timeApart, startTime, endTime })
        this.setState({
            toggle: false, hh: h, mm: m, ss: s,
            list: itemToAdd
        })
        this.timer2 = setInterval(
            () => {
                let t = new Date().getTime() - start;
                this.setState({
                    hh: this.pad(Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
                    mm: this.pad(Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))),
                    ss: this.pad(Math.floor((t % (1000 * 60)) / 1000)),
                })
            },
            1000
        )
    }

    pad = (val) => {
        let valStr = val + "";
        if (valStr.length < 2) {
            valStr = "0" + valStr
            return valStr
        }
        else
            return valStr
    }

    RunToHospital = () => {
        const { laps, now, start, past, } = this.state;
        if (this.state.laps.length) {
            laps.map((lap, index) => {

                if (lap > 1000 && index > 2) {


                    // console.log("past "+past)
                    //console.log("now "+now)
                    console.log("now-start " + (now - start))
                    console.log((laps[index]))
                    //console.log((laps[index]))
                    Alert.alert(
                        '',
                        'your contractions are longer then a minute and evry 3 minutes we seguest to go to Hospital',
                        [
                            {
                                text: 'OK',
                                onPress: () => console.log('ok Pressed'),
                                style: 'cancel',
                            },

                        ],
                        { cancelable: false },
                    ); return 0


                }
            })
        }
    }





    render() {
        // console.log('contractionStore.contraction=', contractionStore.contraction)
        const { toggle } = this.state;
        const { h, m, s } = this.state;
        const { hh, mm, ss } = this.state;


        // console.log('this.state.list=', this.state.list)
        return (
            <View style={{ flex: 1, backgroundColor: APP_COLOR, alignItems: 'center', paddingTop: '5%' }}>

                <View style={{ flex: 0.3 }}>
                    <View style={styles.timerContiener}>
                        <Text
                            style={{ fontSize: 45, color: '#FFFFFF', textAlign: 'center' }}
                        >
                            {h}:{m}:{s}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: '4%', alignSelf: 'center' }}>
                        <Text style={{ color: '#FFF' }}>Time since last contraction :{'\b'}</Text>
                        <Text
                            style={{ fontSize: 14, color: '#FFF', textAlign: 'center' }}
                        >
                            {!toggle ? `${hh}:${mm}:${ss}` : `${h}:${m}:${s}`}
                        </Text>
                    </View>

                    <View style={styles.RoundBtn} >
                        {
                            !toggle ?
                                <RoundButton
                                    title='Start contraction'
                                    background='#F4AC32'
                                    onPress={this.start}
                                />
                                :
                                <RoundButton
                                    title='Stop contraction'
                                    background='#6b1c1c'
                                    onPress={this.stop}
                                />
                        }
                    </View>
                </View>





                <View style={{ flex: 0.6 }}>
                    <View style={{ width: width - 40, marginTop: '10%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#FFF' }}>
                            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>Length</Text>
                            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>Time apart</Text>
                            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>Start and stop</Text>
                        </View>

                        {/* <View style={{ flexDirection: 'column-reverse' }}> */}
                        <LapsTable laps={this.state.list} />
                        {/* </View> */}
                    </View>
                </View>

                <View style={{ flex: 0.08, width: '100%', borderTopColor: '#FFF', borderTopWidth: 1, padding: '2%' }}>
                    <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: '700', fontSize: 17 }}>Average in last hour</Text>
                    <Text style={{ color: '#FFF', textAlign: 'center', marginTop: '2%' }}>Length: 53s | Time apart: 5m 27s</Text>
                </View>
            </View>
        );
    }
}

function Timer({ interval, style }) {
    // console.log('i=', interval)
    const pad = (n) => n < 10 ? '0' + n : n;
    const duration = moment.duration(interval)
    const textToShow = `${pad(duration.hours())}:${pad(duration.minutes())}:${pad(duration.seconds())}`
    return (
        <Text style={style}>{textToShow}</Text>
    );
}

function RoundButton({ title, color, background, onPress, disable }) {
    return (
        <TouchableOpacity
            onPress={() => !disable && onPress()}
            style={[styles.button, { backgroundColor: background }]}
            activeOpacity={disable ? 0.1 : 0.7}
        >
            <Text style={styles.txtButton}>{title}</Text>
        </TouchableOpacity>
    )
}

function Lap({ length, timeApart, startTime, endTime }) {
    return (
        <View style={styles.lap}>
            <Text style={styles.lapText}>{length}</Text>
            <Text style={styles.lapText}>{timeApart}</Text>
            <Text style={styles.lapText}>{startTime} - {endTime} </Text>


        </View>
    )
}

function LapsTable({ laps }) {
    return (
        <ScrollView style={{ height: '90%' }}>
            <View style={{ flexDirection: 'column-reverse' }}>
                {laps.map((lap, index) => (
                    <Lap
                        key={index}
                        length={lap.length}
                        timeApart={lap.timeApart}
                        startTime={lap.startTime}
                        endTime={lap.endTime}
                    // interval={index === 0 ? lap : lap}
                    />
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    timerContiener: {
        width: width - 100,
        alignSelf: 'center',
        marginTop: '2%',
        borderColor: '#FFF',
        borderRadius: 50,
        borderWidth: 3,
    },
    lapText: {
        color: 'white',
        fontSize: 14,
    },
    RoundBtn: {
        alignSelf: 'center',
        marginTop: '7.5%'
    },

    button: {
        width: width - 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonTitle: {

        fontSize: 18,
    },

    txtButton: {
        // width: width - 100,
        // height: 40,
        // borderRadius: 50,
        // borderWidth: 2,
        // justifyContent: 'center',
        // paddingTop: 25,
        textAlign: "center",
        fontWeight: '700',
        fontSize: 17,
        color: '#FFF',


    },
    buttonsRow: {
        //  flexDirection:'row',
        // alignSelf:'stretch',
        // justifyContent:'space-between',




    },
    lap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#948D8C',
        paddingVertical: 10,
    },

    // scrollView:{

    // },
    timer: {
        color: 'white',
        fontSize: 76,
        fontWeight: '200',
    }
});