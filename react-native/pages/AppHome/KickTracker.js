import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableHighlight, BackHandler, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { NavigationActions } from 'react-navigation';
import { } from 'react-native-gesture-handler';
import { Ionicons } from "@expo/vector-icons";
import SQL from '../../handlers/SQL';
import { observer } from 'mobx-react'
import pregnancyStore from '../../mobx/PregnancyStore';
import kickTrackerStore from '../../mobx/KickTrackerStore';

const { height, width, fontScale } = Dimensions.get("window");
const APP_COLOR = '#304251';

@observer
export default class KickTracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            h: "00",
            m: "00",
            s: "00",
            isStartTime: false,
            kickNumber: 0,
            list: null,
        }
        console.log('kick tracker constructor')
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Kick tracker",
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
                    onPress={() => navigation.navigate({
                        routeName: 'Home',
                    })}
                    tintColor={'#FFF'}
                />
            ),

        };
    }

    componentDidMount = async () => {

        const list = await SQL.GetKickTrackerByPregnantId(pregnancyStore.pregnant.PregnantID)
        // console.log('list=', list)

        this.setState({ list })
    }

    componentWillUnmount = () => {
        // removing the event listener for back button android
        BackHandler.removeEventListener();
        if (this.timer1 !== undefined)
            clearInterval(this.timer1)
    }

    componentDidMount() {
        // adding the event listener for back button android
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
        });
    }


    handleStartTimer = () => {
        this.setState({ isStartTime: true })
        const d = new Date();

        const startTime = `${this.pad(d.getHours())}:${this.pad(d.getMinutes())}:${this.pad(d.getSeconds())}`
        const start = d.getTime();
        this.setState({
            date: d,
            startTime
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

    handleKick = async () => {

        const { h, m, s, date, startTime, kickNumber } = this.state;

        if (kickNumber > 9) {
            this.setState({ isStartTime: false })
            const length = `${h}:${m}:${s}`;
            const sqlRes = await SQL.InsertKickTracker(pregnancyStore.pregnant.PregnantID, date, length, startTime, kickNumber)
            const list = await SQL.GetKickTrackerByPregnantId(pregnancyStore.pregnant.PregnantID)
            this.setState({
                list: [...list],
                kickNumber: 0,
                h: "00", m: "00", s: "00"
            })
            clearInterval(this.timer1)
            return;
        }

        this.setState(prevState => ({
            kickNumber: prevState.kickNumber + 1
        }))
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
        const sqlRes = await SQL.DeleteKickTrackerByPregnantId(pregnancyStore.pregnant.PregnantID)
        console.log('sql res=', sqlRes)
        this.setState({
            h: '00', m: '00', s: '00',
            toggle: false,
            list: null,
        })
        clearInterval(this.timer1)
    }

    render() {

        const { h, m, s } = this.state;
        const { kickNumber, isStartTime, list } = this.state;
        const { navigation } = this.props;

        return (
            <View style={{ flex: 1, paddingTop: '5%', alignItems: 'center' }}>
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

                <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'space-evenly', }}>
                    <View style={{}}>
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ width: 20, height: '60%', backgroundColor: '#8e8e8e', alignSelf: 'center', flexDirection: 'column-reverse' }}>
                                <View style={kickNumber !== 0 ? { flex: kickNumber / 10, backgroundColor: '#304251' } : null}></View>
                            </View>
                            <View style={{ width: 200 }}>
                                <Text style={{ fontWeight: '100', fontSize: 90, textAlign: 'center' }}>{kickNumber}</Text>
                            </View>
                        </View>

                    </View>

                    <View style={{}}>
                        <View style={styles.timerContiener}>
                            <Text
                                style={{ fontSize: 30, color: '#000', textAlign: 'center' }}
                            >
                                {h}:{m}:{s}
                            </Text>
                        </View>

                        <View style={{ alignItems: 'center' }}>

                            <TouchableOpacity
                                style={[styles.button, !isStartTime ? { backgroundColor: '#304251' } : { backgroundColor: '#8e8e8e' }]}
                                onPress={this.handleStartTimer}
                                disabled={isStartTime}
                            >
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Start timer</Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                style={[styles.button, !isStartTime ? { backgroundColor: '#8e8e8e' } : { backgroundColor: '#304251' }]}
                                onPress={this.handleKick}
                                disabled={!isStartTime}
                            >
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Kick</Text>
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
            </View >
        )
    }
}


function Row({ i, date, time, length, kicks }) {
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



const styles = StyleSheet.create({
    timerContiener: {
        padding: '2%',
        // borderColor: '#FFF',
        // borderRadius: 50,
        // borderWidth: 3,
    },
    button: {
        width: width - 300,
        height: 40,
        margin: '2%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    styleTable: { width: width - 40, marginTop: '10%' },
    styleHeadTable: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#948D8C',
        paddingVertical: 10,
    },
    txtRow: {
        marginLeft: 2,
        color: APP_COLOR,
        fontSize: 11 * fontScale,
        fontWeight: '300'
    },
    txtHeadTable: {
        fontWeight: 'bold', fontSize: 14 * fontScale,
        color: APP_COLOR,
    },
    moreOptToShow: {
        position: 'absolute',
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
    txtMoreOptToShow: { fontSize: 12 * fontScale, fontWeight: '500', color: APP_COLOR, marginTop: 4, marginLeft: 17, marginBottom: 4 }

})