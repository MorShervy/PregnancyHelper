import React, { Component } from 'react';
import { StyleSheet, BackHandler, ScrollView, View, Text, ImageBackground, Dimensions, TouchableOpacity, Alert, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { HeaderBackButton } from 'react-navigation-stack';

import moment from 'moment';

const APP_COLOR = '#304251';
const { height, width } = Dimensions.get("window");




export default class ContractionTimer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            past: 0,
            start: 0,
            now: 0,
            laps: [],
            lapsTime: [{ endLast: 0, startNew: 0 },
            { endLast: 0, startNew: 0 },
            { endLast: 0, startNew: 0 },],
            toggle: false
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

    componentWillUnmount = () => {
        clearInterval(this.timer)
        // removing the event listener for back button android
        console.log('test=', BackHandler)
        BackHandler.removeEventListener();
    }


    componentDidMount() {
        // adding the event listener for back button android
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
        });
    }

    lap = () => {
        const lapsT = { endLast: 0, startNew: 0 }
        const timestamp = new Date().getTime()
        const { laps, now, start } = this.state
        const [firstLap, ...other] = laps
        this.setState({
            laps: [0, firstLap + now - start, ...other],
            start: timestamp,
            now: timestamp,
            //past:firstLap,
        })
        clearInterval(this.timer);


        //console.log("past "+this.state.past)

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

    reset = () => {
        clearInterval(this.timer);
        this.setState({
            laps: [],
            now: 0,
            start: 0,

        })
    }

    resume = () => {
        const now = new Date().getTime()
        this.setState({
            start: now,
            now,
        })
        this.timer = setInterval(() => {

            this.setState({ now: new Date().getTime() })
        }, 100)

    }

    stop = () => {
        //clearInterval(this.timer);

        const { laps, now, start } = this.state
        const [firstLap, ...other] = laps
        this.setState({
            laps: [firstLap + now - start, ...other],
            start: 0,
            now: 0,

        })
    }
    funcCombin = () => {
        this.lap();
        this.stop();
        this.RunToHospital();
        this.setState({ toggle: !this.state.toggle })
    }

    start = () => {
        //clearInterval(this.timer);
        const now = new Date().getTime()
        this.setState({
            start: now,
            now,
            laps: [0],
            toggle: !this.state.toggle
        })
        this.timer = setInterval(() => {

            this.setState({ now: new Date().getTime() })
        }, 100)
    }

    render() {
        const { now, start, laps, toggle } = this.state;
        const timer = now - start
        return (
            <View style={{ flex: 1, backgroundColor: APP_COLOR, alignItems: 'center', paddingTop: '5%' }}>

                <View style={{ flex: 0.3 }}>
                    <View style={styles.timerContiener}>
                        <Timer
                            style={{ fontSize: 45, color: '#FFFFFF', textAlign: 'center' }}
                            interval={laps.reduce((curr) => curr, 0) + timer}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: '4%', alignSelf: 'center' }}>
                        <Text style={{ color: '#FFF' }}>Time since last contraction :{'\b'}</Text>
                        <Timer style={{ fontSize: 14, color: '#FFF', textAlign: 'center' }} interval={laps.reduce((curr) => curr, 0) + timer} />
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
                                    onPress={this.funcCombin}
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
                        {/* <LapsTable laps={laps} timer={timer} /> */}



                        <View style={{ flexDirection: 'column-reverse' }}>
                            <View style={styles.lap}>
                                <Text style={styles.lapText}>56s</Text>
                                <Text style={styles.lapText}>---</Text>
                                <Text style={styles.lapText}>9:34 - 9:35</Text>
                            </View>
                            <View style={styles.lap}>
                                <Text style={styles.lapText}>45s</Text>
                                <Text style={styles.lapText}>05m 30s</Text>
                                <Text style={styles.lapText}>9:39 - 9:40</Text>
                            </View>
                            <View style={styles.lap}>
                                <Text style={styles.lapText}>52s</Text>
                                <Text style={styles.lapText}>05m 0s</Text>
                                <Text style={styles.lapText}>9:44 - 9:45</Text>
                            </View>
                            <View style={styles.lap}>
                                <Text style={styles.lapText}>58s</Text>
                                <Text style={styles.lapText}>05m 51s</Text>
                                <Text style={styles.lapText}>9:50 - 9:51</Text>
                            </View>
                        </View>

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
    console.log('i=', interval)
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

function Lap({ number, interval }) {
    return (
        <View style={styles.lap}>
            <Text style={styles.lapText}>30s</Text>
            <Text style={styles.lapText}>01m 30s</Text>
            <Text style={styles.lapText}>12:20 - 12:21</Text>
        </View>
    )
}

function LapsTable({ laps, timer }) {
    return (
        <ScrollView style={{ height: '70%' }}>
            {laps.map((lap, index) => (
                <Lap
                    key={index}
                    number={index + 1}
                    interval={index === 0 ? timer + lap : lap}
                />
            ))}
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