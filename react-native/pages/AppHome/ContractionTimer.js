import React, { Component } from 'react';
import { StyleSheet, BackHandler, ScrollView, View, Text, ImageBackground, Dimensions, TouchableOpacity, Alert, TouchableHighlight, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationActions } from 'react-navigation';
import { Ionicons } from "@expo/vector-icons";
import { HeaderBackButton } from 'react-navigation-stack';
import SQL from '../../handlers/SQL';
import { Dates } from '../../handlers/Dates';
import { observer } from 'mobx-react'
import userStore from '../../mobx/UserStore';
import contractionStore from '../../mobx/ContractionStore';
import moment from 'moment';

const APP_COLOR = '#304251';
const { height, width, fontScale } = Dimensions.get("window");



@observer
export default class ContractionTimer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            isTimeApartCalc: true,
            d: '',
            h: "00",
            m: "00",
            s: "00",
            hh: "00",
            mm: "00",
            ss: "00",
            list: [],
        }
        // contractionStore.getContractionList(userStore.id)
    }

    componentWillMount = () => {
        if (contractionStore.contraction === null) {
            console.log('componentWillMount=contraction === null')
            contractionStore.getContractionList(userStore.id)
        }
    }

    componentDidMount = () => {
        // adding the event listener for back button android
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        // console.log('componentDidMount')
    }

    // componentDidUpdate = () => {
    //     console.log('componentDidUpdate')
    // }

    componentWillUnmount = () => {

        // removing the event listener for back button android
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        // console.log('this.timer1=', this.timer1);
        // console.log('this.timer2=', this.timer2);
        if (this.timer1 !== undefined)
            clearInterval(this.timer1)
        if (this.timer2 !== undefined)
            clearInterval(this.timer2)
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Contraction timer",
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        const setParamsAction = NavigationActions.setParams({
                            params: { isMoreOptToShow: navigation.state.params !== undefined ? !navigation.state.params.isMoreOptToShow : true },
                            key: navigation.state.key,
                        });
                        navigation.dispatch(setParamsAction);
                    }}
                >
                    <Ionicons name="md-more" size={35} color={'#FFF'} style={{ paddingRight: 20 }} />
                </TouchableOpacity>
            ),
            headerLeft: (
                <HeaderBackButton
                    onPress={() => handleHeaderBackButton(navigation)}
                    tintColor={'#FFF'}
                />
            ),

        };
    }

    handleHeaderBackButton = navigation => {
        navigation.navigate({
            routeName: 'Home',
        })
    }


    handleBackButton = () => {
        this.props.navigation.goBack()
    }

    start = () => {
        if (this.timer2 !== undefined)
            clearInterval(this.timer2)


        const { hh, mm, ss } = this.state;
        const d = new Date();

        const startTime = `${this.pad(d.getHours())}:${this.pad(d.getMinutes())}:${this.pad(d.getSeconds())}`
        const start = d.getTime();

        let timeApart;
        if (contractionStore.contraction !== null &&
            contractionStore.contraction.Message === undefined &&
            this.state.isTimeApartCalc) {
            console.log('isTimeApartCalc= false')
            timeApart = Dates.GetDiffByTwoDates(
                new Date(contractionStore.contraction[contractionStore.contraction.length - 1].DateTime),
                new Date(d)
            )
        }
        else
            timeApart = `${hh}:${mm}:${ss}`;

        this.setState({
            toggle: true,
            isTimeApartCalc: false,
            start,
            startTime,
            timeApart,
            h: "00", m: "00", s: "00", hh: "00", mm: "00", ss: "00",
            date: d
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

    stop = async () => {
        if (this.timer1 !== undefined)
            clearInterval(this.timer1)
        const { h, m, s, hh, mm, ss, start, startTime, timeApart, timeApartToShow, date } = this.state;
        const d = new Date();

        const endTime = `${this.pad(d.getHours())}:${this.pad(d.getMinutes())}:${this.pad(d.getSeconds())}`
        const length = `${h}:${m}:${s}`




        console.log('sqlRes=', sqlRes);
        // console.log('lalala=', h, ':', m, ':', s)
        // console.log('length=', length)
        // console.log('timeApart=', timeApart)
        // console.log(`${startTime} - ${endTime}`)

        this.setState({
            toggle: false, hh: h, mm: m, ss: s,

        })

        const sqlRes = await SQL.InsertContraction(userStore.id, startTime, endTime, length, timeApart, date)
        console.disableYellowBox = true
        contractionStore.getContractionList(userStore.id)

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


    handleDeleteAll = async () => {
        const sqlRes = await SQL.DeleteContractionByUserId(userStore.id)
        const setParamsAction = NavigationActions.setParams({
            params: { isMoreOptToShow: false },
            key: this.props.navigation.state.key,
        });
        this.props.navigation.dispatch(setParamsAction);
        contractionStore.getContractionList(userStore.id);
        this.setState({ h: '00', m: '00', s: '00', hh: '00', mm: '00', ss: '00', toggle: false })
        clearInterval(this.timer1)
        clearInterval(this.timer2)

    }


    render() {

        const { toggle } = this.state;
        const { h, m, s } = this.state;
        const { hh, mm, ss } = this.state;
        const { navigation } = this.props;




        return (
            <View style={{ flex: 1, backgroundColor: APP_COLOR, alignItems: 'center' }}>

                {
                    navigation.state.params !== undefined &&
                    navigation.state.params.isMoreOptToShow &&
                    <View
                        style={{
                            position: 'absolute',
                            // top: -20,
                            right: 30,
                            zIndex: 0,
                            width: '35%',
                            height: 30,
                            backgroundColor: '#FFF',
                            shadowColor: "rgba(0,0,0,1.0)",
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                            elevation: 10,
                        }}
                    >
                        <TouchableHighlight
                            style={{ width: '100%', }}
                            onPress={this.handleDeleteAll}
                            underlayColor={APP_COLOR}

                        >
                            <Text style={{ fontSize: 18, color: '#000', textAlign: 'center' }}>Delete All</Text>
                        </TouchableHighlight>
                    </View>
                }

                <View style={{ flex: 0.3, paddingTop: '5%' }}>
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
                        {
                            contractionStore.contraction !== null &&
                            contractionStore.contraction.length !== 0 &&
                            <ScrollView style={{ height: '90%' }}>
                                <View style={{ flexDirection: 'column-reverse' }}>
                                    {contractionStore.contraction.map((lap, index) => (
                                        <Lap
                                            key={index}
                                            length={lap.Length}
                                            timeApart={lap.TimeApart}
                                            startTime={lap.StartTime}
                                            endTime={lap.EndTime}
                                        // interval={index === 0 ? lap : lap}
                                        />
                                    ))}
                                </View>
                            </ScrollView>
                        }
                    </View>
                </View>

                <View style={{ flex: 0.08, width: '100%', borderTopColor: '#FFF', borderTopWidth: 1, padding: '2%' }}>
                    <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: '700', fontSize: 17 }}>Average in last hour</Text>
                    {contractionStore.contraction !== null && contractionStore.contraction.length > 0 &&
                        <Text style={{ color: '#FFF', textAlign: 'center', marginTop: '2%' }}>
                            Length: {contractionStore.AverageInLastHour.avgLength} | Time apart: {contractionStore.AverageInLastHour.avgTimeApart}
                        </Text>
                    }
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

    const timeApartToShow = (mm !== "00" && ss === "00" && `${mm}m`) ||
        (mm !== "00" && `${mm}m ${ss}s`) ||
        (ss === "00" && '--') ||
        `${ss}s`


    return (
        <View style={styles.lap}>
            <Text style={styles.lapText}>{lengthToShow}</Text>
            <Text style={styles.lapText}>{timeApartToShow}</Text>
            <Text style={styles.lapText}>
                {startTime.split(':')[0] + ':' + startTime.split(':')[1]}
                {"\b"}-{"\b"}
                {endTime.split(':')[0] + ':' + endTime.split(':')[1]}
            </Text>


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
                        length={lap.Length}
                        timeApart={lap.TimeApart}
                        startTime={lap.StartTime}
                        endTime={lap.EndTime}
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
        fontSize: 14 + fontScale,
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
        fontSize: 17 + fontScale,
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
        fontSize: 76 + fontScale,
        fontWeight: '200',
    }
});