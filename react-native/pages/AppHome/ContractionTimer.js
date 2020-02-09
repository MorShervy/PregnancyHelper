import React, { Component } from 'react';
import { StyleSheet, BackHandler, ScrollView, View, Text, Dimensions, TouchableOpacity, Alert, TouchableHighlight } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { StackActions } from 'react-navigation';
import { SwitchActions } from 'react-navigation';
import { Ionicons } from "@expo/vector-icons";
import { HeaderBackButton } from 'react-navigation-stack';
import InformationAlertComponent from '../../components/InformationAlertComponent';
import SQL from '../../handlers/SQL';
import { Information } from '../../data/Information';
import { Dates } from '../../handlers/Dates';
import { observer } from 'mobx-react'
import userStore from '../../mobx/UserStore';
import contractionStore from '../../mobx/ContractionStore';


const APP_COLOR = '#304251';
const { height, width, fontScale } = Dimensions.get("window");

@observer
export default class ContractionTimer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            isTimeApartCalc: true,
            h: "00",
            m: "00",
            s: "00",
            hh: "00",
            mm: "00",
            ss: "00",
            contractionList: null,
            avgLength: "",
            avgTimeApart: "",
            displayAlert: false
        }

    }

    componentDidMount = async () => {
        console.log('contraction timer didMount')
        // adding the event listener for back button android
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        let conArr = await SQL.GetContractionsByUserId(userStore.id)
        if (conArr !== null && conArr.Message === undefined) {
            let { avgLength, avgTimeApart } = contractionStore.AverageInLastHour(conArr)
            this.setState({ avgLength, avgTimeApart })
        }
        this.setState({ contractionList: conArr })
    }

    componentDidUpdate = () => {
        // console.log('timer did update')
        const { params } = this.props.navigation.state;
        const { navigation } = this.props;
        if (params !== undefined && params.isMoreInfo) {
            console.log('yes', params.isMoreInfo)
            navigation.setParams({ isMoreInfo: false })
            this.setState({ displayAlert: true })
        }
    }

    componentWillUnmount = () => {
        // removing the event listener for back button android
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        if (this.timer1 !== undefined)
            clearInterval(this.timer1)
        if (this.timer2 !== undefined)
            clearInterval(this.timer2)
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Contraction timer",
            headerRight: (
                <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
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
                    <TouchableOpacity
                        onPress={() => {
                            const setParamsAction = NavigationActions.setParams({
                                params: { isMoreInfo: true },
                                key: navigation.state.key,
                            });
                            navigation.dispatch(setParamsAction);
                        }}
                    >
                        <Ionicons name="md-information-circle-outline" size={30} color={'#FFF'} style={{ paddingRight: 20 }} />
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: (
                <HeaderBackButton
                    // onPress={() => navigation.navigate({ routeName: 'Home' })}
                    onPress={() => {
                        const navigateAction = NavigationActions.navigate({
                            routeName: 'Home',
                            params: {},
                            action: NavigationActions.navigate({ routeName: 'Tools' }),
                        });
                        navigation.dispatch(navigateAction);
                    }}
                    tintColor={'#FFF'}
                />
            ),

        };
    }

    handleBackButton = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'Home',
            action: NavigationActions.navigate({ routeName: 'Tools' }),
        });

        this.props.navigation.dispatch(navigateAction);
        // this.props.navigation.goBack();
    }

    start = () => {
        if (this.timer2 !== undefined)
            clearInterval(this.timer2)


        const { hh, mm, ss, contractionList, isTimeApartCalc } = this.state;
        const d = new Date();

        const startTime = `${this.pad(d.getHours())}:${this.pad(d.getMinutes())}:${this.pad(d.getSeconds())}`
        const start = d.getTime();

        // true - only in a case of coming back  
        let timeApart;
        if (contractionList !== null &&
            contractionList.Message === undefined &&
            isTimeApartCalc) {
            console.log('isTimeApartCalc= false')
            timeApart = Dates.GetDiffByTwoDates(
                new Date(contractionList[contractionList.length - 1].DateTime),
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

        const { h, m, s, hh, mm, ss, start, startTime, timeApart, date } = this.state;
        const d = new Date();

        const endTime = `${this.pad(d.getHours())}:${this.pad(d.getMinutes())}:${this.pad(d.getSeconds())}`
        const length = `${h}:${m}:${s}`

        const sqlRes = await SQL.InsertContraction(userStore.id, startTime, endTime, length, timeApart, date)

        let conArr = await SQL.GetContractionsByUserId(userStore.id)
        let { avgLength, avgTimeApart } = contractionStore.AverageInLastHour(conArr)

        this.setState({
            toggle: false, hh: h, mm: m, ss: s, contractionList: [...conArr], avgLength, avgTimeApart

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


    handleDeleteAll = () => {
        const setParamsAction = NavigationActions.setParams({
            params: { isMoreOptToShow: false },
            key: this.props.navigation.state.key,
        });
        this.props.navigation.dispatch(setParamsAction);
        Alert.alert(
            'Confirm delete',
            'Are you sure you want to delete all?',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.deleteAll() },
            ],
        )
    }

    deleteAll = async () => {
        console.log('deleteAll')
        const sqlRes = await SQL.DeleteContractionByUserId(userStore.id)
        this.setState({
            h: '00', m: '00', s: '00',
            hh: '00', mm: '00', ss: '00',
            toggle: false,
            contractionList: null,
            avgLength: "",
            avgTimeApart: ""
        })
        clearInterval(this.timer1)
        clearInterval(this.timer2)
    }

    handleCloseAlert = () => {
        this.setState({ displayAlert: false })
    }


    render() {

        const { toggle } = this.state;
        const { h, m, s } = this.state;
        const { hh, mm, ss } = this.state;
        const { contractionList, avgLength, avgTimeApart, displayAlert } = this.state;
        const { navigation } = this.props;


        return (
            <View style={{ flex: 1, backgroundColor: APP_COLOR, alignItems: 'center' }}>
                <InformationAlertComponent
                    handleCloseAlert={this.handleCloseAlert}
                    displayAlert={displayAlert}
                    header={Information[0].header}
                    body={Information[0].body}
                />
                {
                    navigation.state.params !== undefined &&
                    navigation.state.params.isMoreOptToShow &&
                    <View
                        style={styles.moreOptToShow}
                    >
                        <TouchableHighlight
                            style={{ width: '100%', height: '100%', }}
                            onPress={this.handleDeleteAll}
                            underlayColor={'#d3d3d3'}

                        >
                            <Text style={styles.txtMoreOptToShow}>Delete All</Text>
                        </TouchableHighlight>
                    </View>
                }

                <View style={{ flex: 0.35 }}>
                    <View style={styles.timerContiener}>
                        <Text
                            style={{ fontSize: 40 * fontScale, color: '#FFFFFF', textAlign: 'center' }}
                        >
                            {h}:{m}:{s}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', paddingVertical: 5, alignSelf: 'center' }}>
                        <Text style={{ fontSize: 12 * fontScale, color: '#FFF' }}>Time since last contraction :{'\b'}</Text>
                        <Text
                            style={{ fontSize: 12 * fontScale, color: '#FFF', textAlign: 'center' }}
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

                <View style={{ flex: 0.5 }}>
                    <View style={{ width }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#FFF', paddingHorizontal: 5 }}>
                            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 * fontScale }}>Length</Text>
                            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 * fontScale }}>Time apart</Text>
                            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 * fontScale }}>Start and stop</Text>
                        </View>
                        {

                            contractionList !== null &&
                            contractionList.Message === undefined &&
                            <ScrollView
                                style={{ height: '90%' }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={{ flexDirection: 'column-reverse' }}>
                                    {contractionList.map((lap, index) => (
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


                {contractionList !== null && contractionList.Message === undefined &&
                    <View style={{ flex: 0.15, width: '100%', borderTopColor: '#FFF', borderTopWidth: 1 }}>
                        <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: '700', fontSize: 15 * fontScale }}>Average in last hour</Text>
                        <Text style={{ color: '#FFF', textAlign: 'center', paddingVertical: 5, fontSize: 13 * fontScale }}>
                            Length: {avgLength} | Time apart: {avgTimeApart}
                        </Text>
                    </View>
                }

            </View>
        );
    }
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
            <Text style={styles.lapText}>{lengthToShow}</Text>
            <Text style={styles.lapText}>{timeApartToShow}</Text>
            <Text style={styles.lapText}>
                {startTime.split(':')[0] + ':' + startTime.split(':')[1]}
                {"\b"}-{"\b"}
                {endTime.split(':')[0] + ':' + endTime.split(':')[1]}
            </Text>


        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    moreOptToShow: {
        position: 'absolute',
        // top: -20,
        right: 5,
        zIndex: 0,
        width: '40%',
        height: 40,
        backgroundColor: '#FFF',
        shadowColor: "rgba(0,0,0,1.0)",
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 100,
    },
    timerContiener: {
        width: width - 100,
        alignSelf: 'center',
        paddingVertical: 5,
        borderColor: '#FFF',
        borderRadius: 50,
        borderWidth: 3,
    },
    lapText: {
        color: 'white',
        fontSize: 12 * fontScale,
        paddingHorizontal: 10
    },
    RoundBtn: {
        alignSelf: 'center',
        paddingVertical: 20
        // marginTop: '7.5%'
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
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#948D8C',
        paddingVertical: 10,
    },
    timer: {
        color: 'white',
        fontSize: 20 * fontScale,
        fontWeight: '200',
    },
    txtMoreOptToShow: { fontSize: 12 * fontScale, fontWeight: '500', color: APP_COLOR, paddingHorizontal: 10, paddingVertical: 5 }
});