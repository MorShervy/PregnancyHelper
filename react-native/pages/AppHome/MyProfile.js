import React, { Component } from "react";
import { StyleSheet, View, Text, BackHandler, Dimensions, DatePickerAndroid, Image, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Dates } from '../../handlers/Dates';
import SQL from "../../handlers/SQL";
import CostumAlertComponent from '../../components/CostumAlertComponent';

import { observer } from 'mobx-react'
import userStore from '../../mobx/UserStore';
import pregnancyStore from '../../mobx/PregnancyStore';





const { height, width, fontScale } = Dimensions.get("window");
const GREY_COLOR = '#8e8e8e';
const DARKGRET_COLOR = '#AEB2C4';
const APP_COLOR = '#304251';
const DARKBLUE_COLOR = '#1B1B3A';
const TXT_GREY = '#808080';
const TXT_GREEN = '#009900';



@observer class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            childName: '',
            childBirthToShow: '',
            childBirthDate: '',
            lastMenstrualPeriodToShow: 'Select a date',
            lastMenstrualPeriodDate: '',
            isFocusedName: false,
            displayAlert: false,
            gender: 'Gender',
            numGender: -1,
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "My profile",
            headerLeft: (
                <HeaderBackButton
                    onPress={() => {
                        navigation.navigate({
                            routeName: 'Home',
                        })
                        navigation.toggleDrawer()
                    }}
                    tintColor={'#FFF'}
                />
            ),

        };
    }

    componentDidMount = async () => {
        // adding the event listener for back button android
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        let dateSlice = pregnancyStore.duedate.split('/')
        let childBirthToShow = new Date(`${dateSlice[1]}/${dateSlice[0]}/${dateSlice[2]}`).toDateString().split(' ').slice(1).join(' ')
        console.log('childName=', pregnancyStore.childName)
        console.log('pregnancyStore.gender type=', typeof (pregnancyStore.gender))
        let numGender = pregnancyStore.gender
        let gender = (numGender === 0 && 'Boy') ||
            (numGender === 1 && 'Girl') ||
            'Gender'

        let childName = pregnancyStore.childName + ''
        // console.log('childBirthToShow=', childBirthToShow)
        this.setState({ childBirthToShow, gender, childName, numGender })

    }

    componentWillUnmount = async () => {
        // removing the event listener for back button android
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        console.log('my profle unmount')
        // console.log('this.textInputRef=', pregnancyStore.childName + ' ' + this.state.childName)
        const isFocused = this.textInputRef.isFocused();
        if (isFocused && pregnancyStore.childName !== this.state.childName) {
            // console.log('true=', isFocused)
            // update child name in sql 
            const sqlRes = await SQL.UpdateChildName(pregnancyStore.id, this.state.childName);
            pregnancyStore.setChildName(this.state.childName)
            console.log('sqlRes=', sqlRes);
        }
        else {
            console.log('false=', isFocused)
        }
    }

    handleBackButton = () => {
        const { navigation } = this.props;
        // console.log('navigation=', navigation)
        navigation.navigate({ routeName: 'Home' })
        navigation.toggleDrawer()
    }

    handleOnPressDatePickerChildBirth = async () => {
        const date = new Date()
        let maxDueDateByCurDate = new Date(Dates.CalculateChildBirthByLastMenstrual(date));
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                minDate: date,
                maxDate: maxDueDateByCurDate, // 
                mode: 'default' // spiner or calender
            });
            if (action === DatePickerAndroid.dateSetAction) {
                const childBirthDate = `${month + 1}/${day}/${year}`
                let lastMenstrualPeriodDate = Dates.CalculateLastMenstrualByDueDate(childBirthDate)
                this.setState({
                    lastMenstrualPeriodDate,
                    childBirthDate,
                    childBirthToShow: new Date(`${month + 1}/${day}/${year}`).toDateString().split(' ').slice(1).join(' '),
                }, () => this.handleChangeDueDate());
            }
        } catch ({ code, message }) {
            console.log('Cannot open date picker', message);
        }
    }

    handleChangeDueDate = async () => {
        const { childBirthDate, lastMenstrualPeriodDate } = this.state;
        console.log('handleChangeDueDate')
        console.log('pregnant id=', pregnancyStore.id)
        console.log('childBirthDate=', childBirthDate, ' lastMenstrualPeriodDate=', lastMenstrualPeriodDate)
        SQL.UpdatePregnancyDates(
            pregnancyStore.id, childBirthDate, lastMenstrualPeriodDate).
            then((sqlRes) => console.log('sqlRes=', sqlRes))

    }

    handleEndEditingChildName = async () => {
        console.log('pregnancyStore.childName=', pregnancyStore.childName)
        console.log('this.state.childName=', this.state.childName)
        if (pregnancyStore.childName !== this.state.childName) {
            const sqlRes = await SQL.UpdateChildName(pregnancyStore.id, this.state.childName);
            pregnancyStore.setChildName(this.state.childName)
            console.log('sqlRes=', sqlRes);
        }

    }

    handleCloseAlert = () => {
        this.setState({ displayAlert: false })
    }

    handleGenderClick = async (numGender) => {
        console.log('click numGender=', typeof (numGender))
        if (pregnancyStore.gender === numGender) {
            this.handleCloseAlert();
            return
        }
        const sqlRes = await SQL.UpdateGender(pregnancyStore.id, numGender)
        pregnancyStore.setGender(numGender);
        console.log('sqlRes=', sqlRes)
        let gender = (numGender === 0 && 'Boy') ||
            (numGender === 1 && 'Girl') ||
            'Gender'
        this.setState({ displayAlert: false, gender, numGender })
    }

    handleChangeTextInput = (childName) => {
        console.log('childname=', childName)
        this.setState({ childName })
    }


    render() {
        const { isFocusedName, displayAlert, gender, childName, numGender } = this.state;
        const { childBirthDate, childBirthToShow } = this.state;
        // console.log('childname=', childName)
        return (
            <View style={styles.page}>
                <CostumAlertComponent
                    handleButtonClick={(key) => this.handleGenderClick(key)}
                    handleCloseAlert={this.handleCloseAlert}
                    displayAlert={displayAlert}
                    header={'Gender'}
                    buttons={[{ key: 0, text: 'Boy' }, { key: 1, text: 'Girl' }, { key: -1, text: `Don't know` }]}
                    style={'27%'}
                />
                <View style={styles.head}>
                    <View style={{ flex: 0.17, padding: 15 }}>
                        <Image
                            style={styles.profileIcon}
                            source={require('../../assets/images/profileIcon.png')}
                        />
                    </View>
                    <View style={{ flex: 0.83, paddingTop: 20 }}>
                        <Text style={styles.txtWelcome}>Hello! Welcome to Your Profile.</Text>
                        <Text style={styles.txtEmail}>{userStore.email}</Text>
                    </View>
                </View>
                <View style={styles.body}>
                    <View style={styles.viewMyPreg}>
                        <Text style={styles.txtMyPreg}>
                            My pregnancy
                        </Text>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.viewImgBg}>
                            <ImageBackground
                                source={require('../../assets/images/bgMyPreg.jpg')}
                                style={{ height: 100, width: width - 20 }}
                                resizeMode='cover'
                            />
                        </View>
                        <View style={styles.viewInput}>
                            <View style={styles.rowInput}>
                                <View style={{ flex: 0.10 }}>
                                    <Ionicons name="md-person" size={30} color={GREY_COLOR} style={{ alignSelf: 'center' }} />
                                </View>
                                <View style={{ flex: 0.90 }}>
                                    <TextInput
                                        ref={r => this.textInputRef = r}
                                        style={{ height: 50, paddingHorizontal: 10 }}
                                        placeholder={childName === '' ? `Child's Name` : childName}
                                        value={childName}
                                        placeholderTextColor={childName === '' ? GREY_COLOR : DARKBLUE_COLOR}
                                        onChangeText={childName => this.handleChangeTextInput(childName)}
                                        // onBlur={() => console.log('onblur', childName)}
                                        onEndEditing={this.handleEndEditingChildName}
                                    />
                                </View>
                            </View>
                            <View style={styles.rowInput}>
                                <View style={{ flex: 0.10 }}>
                                    <Ionicons name="md-calendar" size={30} color={GREY_COLOR} style={{ alignSelf: 'center' }} />
                                </View>
                                <View style={{ flex: 0.90 }}>
                                    <TouchableOpacity
                                        style={{ height: 50, padding: 10 }}
                                        onPress={this.handleOnPressDatePickerChildBirth}
                                    >
                                        <Text style={{ paddingTop: 3, color: DARKBLUE_COLOR }}>{childBirthToShow}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.rowInput}>
                                <View style={{ flex: 0.10 }}>
                                    <FontAwesome name="venus-mars" size={25} color={GREY_COLOR} style={{ alignSelf: 'center' }} />
                                </View>
                                <View style={{ flex: 0.90 }}>
                                    <TouchableOpacity
                                        style={{ height: 50, padding: 10 }}
                                        onPress={() => this.setState({ displayAlert: true })}
                                    >
                                        <Text style={[
                                            { paddingTop: 3 },
                                            numGender === -1 ? { color: GREY_COLOR } : { color: DARKBLUE_COLOR }
                                        ]}>
                                            {gender === null ? 'Gender' : gender}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#f6f6f6', alignItems: 'center' },
    head: {
        flex: 0.15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: DARKGRET_COLOR,
        flexDirection: 'row', justifyContent: 'space-between'
    },
    profileIcon: { height: 70, width: 60 },
    txtWelcome: { color: DARKBLUE_COLOR, fontWeight: '300', fontSize: 12 * fontScale },
    txtEmail: { color: TXT_GREEN, fontSize: 11.5 * fontScale },
    body: { flex: 0.7 },
    viewMyPreg: { flex: 0.15, justifyContent: 'center', alignItems: 'center', paddingTop: 15, paddingBottom: 15 },
    txtMyPreg: { textAlign: 'center', color: TXT_GREY, fontSize: 14 * fontScale, fontWeight: '300' },
    content: {
        width: width - 20, borderColor: '#e0e0e0', borderWidth: 1, backgroundColor: '#FFF', marginBottom: '3%',
        alignItems: 'center',
    },
    viewImgBg: {},
    viewInput: {
        width: width - 20,
        flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center',
        borderBottomWidth: 1, borderBottomColor: DARKGRET_COLOR,
        borderLeftWidth: 1, borderLeftColor: DARKGRET_COLOR,
        borderRightWidth: 1, borderRightColor: DARKGRET_COLOR,
        paddingBottom: 20, paddingTop: 20
    },
    rowInput: {
        flexDirection: 'row', width: width - 50, justifyContent: 'center', alignItems: 'center',
        borderBottomWidth: 2, borderBottomColor: DARKGRET_COLOR
    }
})

export default MyProfile;