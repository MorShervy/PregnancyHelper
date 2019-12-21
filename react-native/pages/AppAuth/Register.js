import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, DatePickerAndroid, TouchableOpacity, BackHandler, ActivityIndicator, AsyncStorage } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { HeaderBackButton } from 'react-navigation-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { DueDate } from '../../handlers/Dates';
import SQL from '../../handlers/SQL';
import { observer } from 'mobx-react'
import userStore from '../../mobx/UserStore';

const { height, width } = Dimensions.get("window");

const regexEmail = /^(([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}))$/;
const regexPassword = /^(.{8,49})$/;
const GREEN_COLOR = '#3CB371';
const GREY_COLOR = '#8e8e8e';
const DARKGRAY_COLOR = '#A9A9A9';
const LIGHTGREY_COLOR = '#EFF0F4';
const APP_COLOR = '#304251';
const RED_COLOR = '#FF0000';

@observer
export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            pass: '',
            childBirthToShow: 'Estimated birth date...',
            childBirthDate: '',
            lastMenstrualPeriodToShow: 'Select a date',
            lastMenstrualPeriodDate: '',
            isFocusedEmail: false,
            isFocusedPass: false,
            errorEmail: false,
            errorEmailExist: false,
            errorPass: false,
            errorDate: false,
            isVisiblePass: false,
            isLoading: false,
        }
    }

    componentWillMount = () => {
        // AsyncStorage.getItem("user").then(
        //     res => res !== null && console.log('res=', res)
        // );

    }

    componentDidMount = () => {
        // adding the event listener for back button android
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount = () => {
        // removing the event listener for back button android
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            // ovverride back button header functionality
            headerLeft: (<HeaderBackButton
                tintColor='#FFF'
                onPress={() => {
                    navigation.state.params !== undefined && navigation.state.params.showCalc
                        ?
                        navigation.setParams({ showCalc: false })
                        :
                        navigation.goBack()
                }} />)
        }
    }

    // handle back button android
    handleBackButton = async () => {
        const { navigation } = this.props
        if (navigation.state.params !== undefined && navigation.state.params.showCalc) {
            await navigation.setParams({ showCalc: false })
            this.setState({
                showCalc: false,
            })
        }
        else {
            navigation.goBack()
        }
    }

    onFocusEmail = (event) => {
        this.setState({ isFocusedEmail: true })
        if (this.props.onFocus) {
            this.props.onFocus(event)
        }
    }

    onBlurEmail = (event) => {
        this.setState({ isFocusedEmail: false })
        if (this.props.onBlur) {
            this.props.onBlur(event)
        }
    }

    onFocusPass = (event) => {
        this.setState({ isFocusedPass: true })
        if (this.props.onFocus) {
            this.props.onFocus(event)
        }
    }

    onBlurPass = (event) => {
        this.setState({ isFocusedPass: false })
        if (this.props.onBlur) {
            this.props.onBlur(event)
        }
    }

    render() {
        const { email, pass, childBirthDate } = this.state;
        const { errorEmail, errorPass, errorDate, errorEmailExist } = this.state;
        const { isFocusedEmail, isFocusedPass, isVisiblePass, isLoading } = this.state;
        const { childBirthToShow, lastMenstrualPeriodToShow, lastMenstrualPeriodDate } = this.state;
        const { navigation } = this.props;

        // פונקציה הרשמה צד לקוח
        handleOnPressRegister = async () => {
            const isPassed = handleInputTesting() // קריאה לפונקציה לבדיקת קלט 

            if (!isPassed) // במידה והבדיקה לא עברה מסיים את הפונקציה
                return;

            let lastMenstrualPeriod;
            if (childBirthDate !== '') // במידה והמשתמשת הכניסה תאריך לידה משוער
                // קריאה לפונקציה שמחשבת את היום הראשון של המחזור האחרון שלה 
                lastMenstrualPeriod = DueDate.CalculateLastMenstrualByDueDate(childBirthDate)

            // מאפס את כל הודעות השגיאה ומציג דף נטען
            this.setState({
                errorEmail: false, errorPass: false, errorDate: false, errorEmailExist: false, isLoading: true,
            })
            //  קריאה לפונקציה הרשמה על מנת להעביר את הנתונים מצד לקוח ושמירתם
            const sqlResult = await SQL.Register(email.toLowerCase(), pass, childBirthDate, lastMenstrualPeriod);
            // במידה והתוצאה קטנה מ1 המשתמש קיים ומציגים הודעת מתאימה
            if (sqlResult.ID < 1) {
                setTimeout(() => {
                    this.setState({ isLoading: false, errorEmailExist: true })
                }, 1000)
                return;
            }
            // שמירת משתמש חדש באחסון מקומי על הטלפון כדי לזהות משתמשים מחוברים
            AsyncStorage.setItem("user", JSON.stringify({ ID: sqlResult.ID }))
            // Mobx קריאה לפונקציה ששומרת את נתוני המשתמש החדש בניהול מידע באמצעות  
            userStore.getUserAsync(sqlResult.ID)
            // מעבר לדף הבית
            navigation.navigate('HomeStack')
        }

        toggleVisiblePass = () => {
            this.setState({ isVisiblePass: !isVisiblePass })
        }

        handleOnPressDatePickerChildBirth = async () => {
            const date = new Date()
            let maxDueDateByCurDate = new Date(DueDate.CalculateChildBirthByLastMenstrual(date));
            try {
                const { action, year, month, day } = await DatePickerAndroid.open({
                    maxDate: maxDueDateByCurDate, // 
                    mode: 'default' // spiner or calender
                });
                if (action === DatePickerAndroid.dateSetAction) {
                    this.setState({
                        childBirthDate: `${month + 1}/${day}/${year}`,
                        childBirthToShow: new Date(`${month + 1}/${day}/${year}`).toDateString().split(' ').slice(1).join(' '),
                    });
                }
            } catch ({ code, message }) {
                console.log('Cannot open date picker', message);
            }
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
            //console.log('lastMenstrualPeriodDate=', date.getFullYear(), date.getMonth() + 1, date.getDate())
            const estimateDueDate = DueDate.CalculateChildBirthByLastMenstrual(lastMenstrualPeriodDate);
            //console.log('childBirth=', estimateDueDate);
            this.setState({
                childBirthDate: estimateDueDate,
                childBirthToShow: new Date(estimateDueDate).toDateString().split(' ').slice(1).join(' '),
            })

            await navigation.setParams({ showCalc: false })
        }

        handleInputTesting = () => {
            // email test
            if (email === '' || !(regexEmail.test(email.toUpperCase()))) {
                this.setState({
                    errorEmail: true,
                    errorPass: false,
                    errorDate: false,
                    errorEmailExist: false,
                })
                return false;
            }
            // pass test
            if (pass === '' || !(regexPassword.test(pass.toUpperCase()))) {
                this.setState({
                    errorEmail: false,
                    errorPass: true,
                    errorDate: false,
                })
                return false;
            }
            // datepicker test
            if (childBirthDate === '') {
                this.setState({
                    errorEmail: false,
                    errorPass: false,
                    errorDate: true,
                })
                return false;
            }
            return true;
        }

        renderCalcDueDate = async () => {
            this.setState({
                lastMenstrualPeriodToShow: 'Select a date',
                lastMenstrualPeriodDate: '',
            })
            await this.props.navigation.setParams({ showCalc: true })
        }

        return (
            navigation.state.params !== undefined && navigation.state.params.showCalc
                ?
                // last menstrual period view
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
                                    onPress={handleOnPressDatePickerLastMenstrual}
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
                                onPress={handleOnPressCalculate}
                            >
                                <Text style={styles.txtBtnStyle}>Calculate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                :
                // register view
                <View style={styles.page}>
                    <LinearGradient
                        colors={isLoading ? ['#00000070', '#00000070'] : ['transparent', 'transparent']}
                        style={styles.LinearGradientStyle}
                    >
                        {/* <View style={{ flex: 1, backgroundColor: isLoading ? '#00000070' : 'transparent' }}> */}
                        {
                            isLoading &&
                            <ActivityIndicator style={styles.activityIndicator} color={APP_COLOR} size={40} />
                        }
                        <View style={styles.body}>
                            {/* header title */}
                            <Text style={styles.txtHeaderStyle}>This won't take long</Text>

                            {/* register form */}
                            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>

                                {/* email */}
                                <View style={!errorEmail ? styles.marginBottomStyle : null}>
                                    {
                                        (isFocusedEmail || email !== '') &&
                                        <Text
                                            style={{
                                                color: isFocusedEmail ? GREEN_COLOR : GREY_COLOR,
                                                fontSize: 12,
                                                marginBottom: -20
                                            }}
                                        >Email
                                    </Text>
                                    }
                                    <TextInput
                                        onFocus={this.onFocusEmail}
                                        onBlur={this.onBlurEmail}
                                        placeholderTextColor={isFocusedEmail ? GREEN_COLOR : null}
                                        style={
                                            [styles.txtInputStyle,
                                            errorEmail && { borderBottomColor: '#F00' },
                                            isFocusedEmail && styles.txtInputFocusStyle,
                                            ]}
                                        placeholder={!isFocusedEmail ? 'Email' : null}
                                        keyboardType="email-address"
                                        value={this.state.email}
                                        onChangeText={email => this.setState({ email })}
                                    />

                                    {/* error email */}
                                    {!errorEmail ? null
                                        :
                                        <Text style={styles.errorTxtStyle}>The email address you entered is invalid</Text>
                                    }
                                    {
                                        !errorEmailExist ? null
                                            :
                                            <Text style={styles.errorTxtStyle}>The email address you entered is already exist
                                            {'\n'}Please log in or enter another email address
                                        </Text>
                                    }
                                </View>

                                {/* password */}
                                <View style={!errorPass ? styles.marginBottomStyle : null}>
                                    {
                                        (isFocusedPass || pass !== '') &&
                                        <Text
                                            style={{
                                                color: isFocusedPass ? GREEN_COLOR : GREY_COLOR,
                                                fontSize: 12,
                                                marginBottom: -20
                                            }}
                                        >Password
                             </Text>
                                    }
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput
                                            onFocus={this.onFocusPass}
                                            onBlur={this.onBlurPass}
                                            placeholderTextColor={isFocusedPass ? GREEN_COLOR : null}
                                            style={
                                                [styles.txtInputStyle,
                                                errorPass && { borderBottomColor: '#F00' },
                                                isFocusedPass && styles.txtInputFocusStyle
                                                ]}
                                            placeholder={!isFocusedPass ? 'Password' : null}
                                            secureTextEntry={!isVisiblePass}
                                            value={this.state.pass}
                                            onChangeText={pass => this.setState({ pass })}
                                        />
                                        <TouchableOpacity
                                            style={{ right: 25, top: 15 }}
                                            onPress={toggleVisiblePass}
                                        >
                                            <Ionicons

                                                name={isVisiblePass ? "md-eye-off" : "md-eye"}
                                                size={25}
                                                color={GREY_COLOR} />
                                        </TouchableOpacity>
                                    </View>
                                    {/* error password */}
                                    {!errorPass ? null
                                        :
                                        <Text style={styles.errorTxtStyle}>
                                            Password must include at least 8
                                    characters
                                </Text>
                                    }
                                </View>

                                {/* due date */}
                                <View style={!errorDate ? styles.marginBottomStyle : null}>
                                    {
                                        (childBirthDate !== '' &&
                                            <Text
                                                style={{
                                                    color: GREY_COLOR,
                                                    fontSize: 12,
                                                    marginBottom: -20
                                                }}
                                            >
                                                Estimated birth date
                                    </Text>
                                        )
                                    }
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                        <TouchableOpacity
                                            style={styles.btnDueDateStyle}
                                            onPress={handleOnPressDatePickerChildBirth}
                                        >
                                            <Text
                                                style={[
                                                    styles.txtDueDateStyle,
                                                    { color: childBirthDate === '' ? GREY_COLOR : '#000' }
                                                ]}
                                            >{childBirthToShow}
                                            </Text>

                                        </TouchableOpacity>
                                        <Ionicons name="md-calendar" size={35} color={APP_COLOR} style={{ left: 10, top: 12 }} />
                                    </View>

                                    {/* error due date */}
                                    {!errorDate ? null
                                        :
                                        <Text style={styles.errorTxtStyle}>Please enter a date</Text>
                                    }
                                </View>

                                {/* calculate due date */}
                                <View style={styles.dueDateCalcStyle}>
                                    <TouchableOpacity
                                        style={styles.btnDueDateCalcStyle}
                                        onPress={renderCalcDueDate}
                                    >
                                        <Text style={styles.txtBtnCalcStyle}>Calculate estimated birth date</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* button track my baby */}
                                <View style={styles.marginTopBtn}>
                                    <TouchableOpacity
                                        style={[styles.btnStyle, { backgroundColor: APP_COLOR }]}
                                        onPress={handleOnPressRegister}
                                    >
                                        <Text style={styles.txtBtnStyle}>Let's get started</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.footer}>
                            <Text style={styles.txtFooter}>
                                As a member, you'll receive regular emails{`\n`}
                                from us. It's easy to opt-out later.
                        </Text>
                        </View>
                    </LinearGradient>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    page: { flex: 1 },
    body: { flex: 0.7, width: width - 50, alignSelf: 'center' },
    footer: { flex: 0.3, backgroundColor: LIGHTGREY_COLOR },
    flexRow: { width: width - 50, flexDirection: 'row', justifyContent: 'flex-start', marginTop: '5%' },
    btnSelectDateView: { justifyContent: 'center', alignItems: 'flex-start', marginLeft: '3%' },
    activityIndicator: { position: 'absolute', alignSelf: 'center', marginTop: '45%' },
    txtHeaderStyle: { fontSize: 25, color: APP_COLOR, marginTop: '3%' },
    txtInputStyle: { width: width - 50, height: 50, fontSize: 17, paddingTop: '2.5%', borderBottomColor: GREY_COLOR, borderBottomWidth: 1, },
    txtInputFocusStyle: { borderBottomColor: GREEN_COLOR, borderBottomWidth: 1.5 },
    btnDueDateStyle: { width: width / 1.70, height: 50, borderBottomColor: GREY_COLOR, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'flex-start' },
    txtDueDateStyle: { marginTop: 20, fontSize: 15, },
    errorTxtStyle: { fontSize: 12, fontWeight: '200', color: RED_COLOR, marginTop: '2.5%', },
    dueDateCalcStyle: {
        height: 50,
        marginTop: '5%',
        borderTopWidth: 1,
        borderTopColor: GREY_COLOR,
        borderBottomWidth: 1,
        borderBottomColor: GREY_COLOR,
    },
    btnDueDateCalcStyle: { justifyContent: 'center', alignItems: 'center' },
    txtBtnCalcStyle: { color: APP_COLOR, fontSize: 17, marginTop: '2%', },
    btnStyle: { width: width - 50, height: 50, borderRadius: 7, },
    txtBtnStyle: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 17, marginTop: 7.5, },
    txtFooter: { width: width - 75, fontSize: 13.5, color: DARKGRAY_COLOR, alignSelf: 'center', marginTop: 15 },
    btnSelectDate: { alignSelf: 'flex-start', width: width - 100, height: 50, borderBottomColor: GREY_COLOR, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'flex-start' },
    LinearGradientStyle: { position: 'absolute', left: 0, right: 0, top: 0, height: '100%' },
    marginTopBtn: { marginTop: '5%' },
    marginBottomStyle: { marginBottom: '3%' }
})