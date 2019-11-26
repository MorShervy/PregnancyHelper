import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableHighlight, BackHandler, FlatList } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { height, width } = Dimensions.get("window");

export default class KickTracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            laps: [],
            now: 0,
            start: 0,
            isStartTime: false,
            kickNumber: 0,
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Kick tracker",
            headerLeft: (
                <HeaderBackButton
                    onPress={() => handleHeaderBackButton(navigation)}
                    tintColor={'#FFF'}
                />
            ),

        };
    }

    componentWillUnmount = () => {
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


    handleStartTimer = () => {
        this.setState({ isStartTime: true })
    }

    handleKick = () => {

        if (this.state.kickNumber > 9)
            return;

        this.setState(prevState => ({
            kickNumber: prevState.kickNumber + 1
        }))
    }

    render() {
        const { laps, now, start, isStartTime, kickNumber } = this.state
        const timer = now - start

        handleHeaderBackButton = navigation => {
            console.log('navigation=', navigation)
            navigation.navigate({
                routeName: 'Home',
            })
        }





        return (
            <View style={{ flex: 1, paddingTop: '5%' }}>
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
                            <Timer
                                style={{ fontSize: 23, textAlign: 'center' }}
                                interval={laps.reduce((curr) => curr, 0) + timer}
                            />
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

                <View style={{ flex: 0.75, width: width - 40, alignSelf: 'center' }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#000' }}>
                        <View style={{ width: '35%' }}>
                            <Text style={{ color: '#000', fontWeight: '500' }}>Date</Text>
                        </View>
                        <View style={{ width: '25%' }}>
                            <Text style={{ color: '#000', fontWeight: '500' }}>Time</Text>
                        </View>
                        <View style={{ width: '20%' }}>
                            <Text style={{ color: '#000', fontWeight: '500' }}>Length</Text>
                        </View>
                        <View style={{ width: '20%' }}>
                            <Text style={{ color: '#000', fontWeight: '500' }}>Kicks</Text>
                        </View>
                    </View>

                    <View style={styles.kickTrackerList}>
                        <View style={{ width: '35%' }}>
                            <Text style={{}}>Nov 24, 2019</Text>
                        </View>
                        <View style={{ width: '25%' }}>
                            <Text style={{}}>3:34 pm</Text>
                        </View>
                        <View style={{ width: '20%' }}>
                            <Text style={{}}>2h 58s</Text>
                        </View>
                        <View style={{ width: '20%' }}>
                            <Text style={{ marginLeft: '15%' }}>5</Text>
                        </View>
                    </View>

                    <View style={styles.kickTrackerList}>
                        <View style={{ width: '35%' }}>
                            <Text style={{}}>Nov 24, 2019</Text>
                        </View>
                        <View style={{ width: '25%' }}>
                            <Text style={{}}>3:34 pm</Text>
                        </View>
                        <View style={{ width: '20%' }}>
                            <Text style={{}}>2h 58s</Text>
                        </View>
                        <View style={{ width: '20%' }}>
                            <Text style={{ marginLeft: '15%' }}>5</Text>
                        </View>
                    </View>
                </View>
            </View >
        )
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
    kickTrackerList: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderColor: '#948D8C',
        paddingVertical: 10,
    },

})