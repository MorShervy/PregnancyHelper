import React, { Component } from "react";
import { StyleSheet, View, Text, BackHandler, Dimensions, DatePickerAndroid, TouchableOpacity } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { NavigationActions } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import { Ionicons } from "@expo/vector-icons";
import { Dates } from '../../handlers/Dates';

const { height, width, fontScale } = Dimensions.get("window");
const GREY_COLOR = '#8e8e8e';
const APP_COLOR = '#304251';


class DueDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastMenstrualPeriodToShow: 'Select a date',
            lastMenstrualPeriodDate: '',
            childBirthToShow: '',
            childBirthDate: '',
            range: null
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Due Date",
            headerLeft: (
                <HeaderBackButton
                    onPress={() => {
                        const navigateAction = NavigationActions.navigate({
                            routeName: 'Home',
                            action: NavigationActions.navigate({ routeName: 'Tools' }),
                        });
                        navigation.dispatch(navigateAction);
                    }}
                    tintColor={'#FFF'}
                />
            ),

        };
    }

    componentDidMount = async () => {
        // adding the event listener for back button android
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount = () => {
        // removing the event listener for back button android
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'Home',
            action: NavigationActions.navigate({ routeName: 'Tools' }),
        });

        this.props.navigation.dispatch(navigateAction);
    }

    handleOnPressDatePickerLastMenstrual = async () => {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                maxDate: new Date(),
                mode: 'default' // spiner or calender
            });
            if (action === DatePickerAndroid.dateSetAction) {
                this.setState({
                    lastMenstrualPeriodToShow: new Date(`${month + 1}/${day}/${year}`).toDateString().split(' ').slice(1).join(' '),
                    lastMenstrualPeriodDate: `${month + 1}/${day}/${year}`,
                });
            }
        } catch ({ code, message }) {
            console.log('Cannot open date picker', message);
        }
    }

    handleOnPressCalculate = async () => {
        const { lastMenstrualPeriodDate } = this.state;
        // console.log('lastMenstrualPeriodDate=', lastMenstrualPeriodDate)
        const estimateDueDate = Dates.CalculateChildBirthByLastMenstrual(lastMenstrualPeriodDate);
        const newDate = new Date(estimateDueDate).toDateString()
        let newDateSplit = newDate.split(' ')

        const range = Dates.GetSafeRangeToGiveBirth(estimateDueDate)
        console.log('preTerm=', range.preTerm)
        console.log('postTerm=', range.postTerm)
        this.setState({
            range,
            childBirthDate: estimateDueDate,
            childBirthToShow: `${newDateSplit[0]}, ${newDateSplit[1]} ${newDateSplit[2]}, ${newDateSplit[3]}`//new Date(estimateDueDate).toDateString().split(' ').slice(1).join(' '),
        })


    }

    render() {

        const { lastMenstrualPeriodDate, lastMenstrualPeriodToShow } = this.state;
        const { childBirthDate, childBirthToShow } = this.state;
        const { range } = this.state;

        // console.log('childBirthToShow=', childBirthToShow)
        // console.log('childBirthDate=', childBirthDate)
        // console.log('lastMenstrualPeriodDate=', lastMenstrualPeriodDate)
        // console.log('lastMenstrualPeriodToShow=', lastMenstrualPeriodToShow)
        return (
            <View style={styles.page}>
                <View style={styles.body}>
                    {/* header text */}
                    <Text style={styles.txtHeaderStyle}>What was the first day{`\n`}of your last menstrual{`\n`}period?</Text>

                    {/* flex row style for date picker */}
                    <View style={styles.flexRow}>
                        {/* view icon */}
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Ionicons name="md-calendar" size={35} color={APP_COLOR} style={{ top: 7.5 }} />
                        </View>
                        {/* button select a date */}
                        <View style={styles.btnSelectDateView}>
                            {/* select last menstrual for calculate due date */}
                            {
                                (lastMenstrualPeriodDate !== '' &&
                                    <Text
                                        style={{
                                            color: GREY_COLOR,
                                            marginBottom: -20,
                                            fontSize: 12
                                        }}
                                    >
                                        Select a date
                            </Text>
                                )
                            }
                            <TouchableOpacity
                                style={styles.btnSelectDate}
                                onPress={this.handleOnPressDatePickerLastMenstrual}
                            >
                                <Text
                                    style={[
                                        styles.txtDueDateStyle,
                                        { color: lastMenstrualPeriodDate === '' ? GREY_COLOR : '#000' }
                                    ]}
                                >
                                    {lastMenstrualPeriodToShow}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* button track my baby */}
                    <View style={styles.marginTopBtn}>
                        <TouchableOpacity
                            disabled={lastMenstrualPeriodDate === '' ? true : false}
                            style={[
                                styles.btnStyle,
                                { backgroundColor: lastMenstrualPeriodDate === '' ? GREY_COLOR : APP_COLOR }]}
                            onPress={this.handleOnPressCalculate}
                        >
                            <Text style={styles.txtBtnStyle}>Calculate</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        childBirthToShow !== '' &&
                        <View style={{ marginTop: 30, alignSelf: 'center' }}>
                            <Text style={{ fontWeight: '400', fontSize: 13 * fontScale, color: APP_COLOR, }}>Your baby's estimated due date is on</Text>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 * fontScale, color: APP_COLOR, textAlign: 'center' }}>{childBirthToShow}</Text>
                            </View>
                        </View>
                    }
                    {
                        range !== null &&
                        <View style={{ marginTop: 30, alignSelf: 'center' }}>
                            <Text style={{ fontWeight: '400', fontSize: 13 * fontScale, color: APP_COLOR }}>Your approximate range to give birth</Text>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 * fontScale, color: APP_COLOR, textAlign: 'center' }}>{range.preTerm}  to  {range.postTerm}</Text>
                            </View>
                        </View>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    page: { flex: 1 },
    body: { flex: 0.7, width: width - 50, alignSelf: 'center' },
    txtHeaderStyle: { fontSize: 25, color: APP_COLOR, marginTop: '3%' },
    flexRow: { width: width - 50, flexDirection: 'row', justifyContent: 'flex-start', marginTop: '5%' },
    btnSelectDateView: { justifyContent: 'center', alignItems: 'flex-start', marginLeft: '3%' },
    btnSelectDate: { alignSelf: 'flex-start', width: width - 100, height: 50, borderBottomColor: GREY_COLOR, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'flex-start' },
    txtDueDateStyle: { marginTop: 20, fontSize: 15, },
    marginTopBtn: { marginTop: '5%' },
    btnStyle: { width: width - 50, height: 50, borderRadius: 7, },
    txtBtnStyle: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 17, marginTop: 7.5, },
})

export default DueDate;