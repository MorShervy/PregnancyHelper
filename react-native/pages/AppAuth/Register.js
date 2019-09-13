import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, DatePickerAndroid, TouchableOpacity, BackHandler } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { HeaderBackButton } from 'react-navigation-stack';
import DueDate from '../../handlers/DueDate';
import SQL from '../../handlers/SQL';

const { height, width } = Dimensions.get("window");

const regexEmail = /^(([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}))$/;
const regexPassword = /^(.{8,49})$/;
const GREEN_COLOR = '#3CB371';
const GREY_COLOR = '#8e8e8e';
const DARKGREY_COLOR = '#2F4F4F';
const DARKGRAY_COLOR = '#A9A9A9';
const LIGHTGREY_COLOR = '#EFF0F4';
const APP_COLOR = '#304251';
const RED_COLOR = '#FF0000';

export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            pass: '',
            childBirthToShow: 'Due Date/Child`s Birth...',
            childBirthDate: '',
            lastMenstrualPeriodToShow: 'Select a date',
            lastMenstrualPeriodDate: '',
            isFocusedEmail: false,
            isFocusedPass: false,
            errorEmail: false,
            errorPass: false,
            errorDate: false,
            isVisiblePass: false,
        }
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
        const { errorEmail, errorPass, errorDate } = this.state;
        const { isFocusedEmail, isFocusedPass, isVisiblePass } = this.state;
        const { childBirthToShow, lastMenstrualPeriodToShow, lastMenstrualPeriodDate } = this.state;
        const { navigation } = this.props;

        handleOnPressRegister = async () => {
            const isPassed = handleInputTesting()
            if (!isPassed)
                return;

            // clear error states
            this.setState({ errorEmail: false, errorPass: false, errorDate: false, })

            const sqlResult = await SQL.Register(email, pass);
            console.log('res=', sqlResult)
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
                        childBirthToShow: new Date(`${month + 1}/${day}/${year}`).toDateString().substring(4),
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
                        lastMenstrualPeriodToShow: new Date(`${month + 1}/${day}/${year}`).toDateString().substring(4),
                        lastMenstrualPeriodDate: `${month + 1}/${day}/${year}`,
                    });
                }
            } catch ({ code, message }) {
                console.log('Cannot open date picker', message);
            }
        }


        handleOnPressCalculate = async () => {
            const { lastMenstrualPeriodDate } = this.state;
            const date = new Date(lastMenstrualPeriodDate)
            date.getDay();
            //console.log('lastMenstrualPeriodDate=', date.getFullYear(), date.getMonth() + 1, date.getDate())
            const estimateDueDate = DueDate.CalculateChildBirthByLastMenstrual(date);
            //console.log('childBirth=', estimateDueDate);
            this.setState({
                childBirthDate: estimateDueDate,
                childBirthToShow: new Date(estimateDueDate).toDateString().substring(4),
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
                    <View style={[styles.body, { top: 20 }]}>
                        <Text style={styles.txtHeaderStyle}>What was the first day{`\n`}of your last menstrual{`\n`}period?</Text>
                        {/* select last menstrual for calculate due date */}
                        {
                            (lastMenstrualPeriodDate !== '' &&
                                <Text
                                    style={{
                                        color: GREY_COLOR,
                                        fontSize: 10,
                                        marginBottom: -20,
                                        left: 27,
                                        fontSize: 12
                                    }}
                                >
                                    Select a date
                                    </Text>
                            )
                        }
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons name="md-calendar" size={35} color={APP_COLOR} style={{ top: 20, right: 10 }} />
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
                        {/* button track my baby */}
                        <View style={{ marginTop: 30 }}>
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
                    <View style={styles.body}>
                        {/* header title */}
                        <Text style={styles.txtHeaderStyle}>This won't take long</Text>

                        {/* register form */}
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>

                            {/* email */}
                            <View style={{ marginBottom: 10 }}>
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
                            </View>

                            {/* password */}
                            <View style={{ marginBottom: 10 }}>
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
                                    characters;letters,numbers,and/or{'\n'}
                                        symbols
                                </Text>
                                }
                            </View>

                            {/* due date */}
                            <View style={{ marginBottom: 10 }}>
                                {
                                    (childBirthDate !== '' &&
                                        <Text
                                            style={{
                                                color: GREY_COLOR,
                                                fontSize: 12,
                                                marginBottom: -20
                                            }}
                                        >
                                            Due Date/Child`s Birth...
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
                                    <Text style={styles.txtBtnCalcStyle}>Calculate my due date</Text>
                                </TouchableOpacity>
                            </View>

                            {/* button track my baby */}
                            <View style={{ marginTop: 30 }}>
                                <TouchableOpacity
                                    style={[styles.btnStyle, { backgroundColor: APP_COLOR }]}
                                    onPress={handleOnPressRegister}
                                >
                                    <Text style={styles.txtBtnStyle}>Track my baby</Text>
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
                </View>
        );
    }
}

const styles = StyleSheet.create({
    page: { flex: 1 },
    body: { flex: 0.7, width: width - 50, alignSelf: 'center' },
    footer: { flex: 0.3, backgroundColor: LIGHTGREY_COLOR },
    txtHeaderStyle: { fontSize: 25, color: DARKGREY_COLOR, marginTop: 10, marginBottom: 10 },
    txtInputStyle: { width: width - 50, height: 50, fontSize: 17, paddingTop: 10, borderBottomColor: GREY_COLOR, borderBottomWidth: 1, },
    txtInputFocusStyle: { borderBottomColor: GREEN_COLOR, borderBottomWidth: 1.5 },
    btnDueDateStyle: { alignSelf: 'flex-start', width: width / 1.70, height: 50, borderBottomColor: GREY_COLOR, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'flex-start' },
    txtDueDateStyle: { marginTop: 20, fontSize: 15, },
    errorTxtStyle: { fontSize: 12, fontWeight: '200', color: RED_COLOR, marginTop: 5, },
    dueDateCalcStyle: {
        height: 50,
        marginTop: 35,
        borderTopWidth: 1,
        borderTopColor: GREY_COLOR,
        borderBottomWidth: 1,
        borderBottomColor: GREY_COLOR,
    },
    btnDueDateCalcStyle: { justifyContent: 'center', alignItems: 'center' },
    txtBtnCalcStyle: { color: APP_COLOR, fontSize: 20, marginTop: 5, },
    btnStyle: { width: width - 50, height: 50, borderRadius: 7, },
    txtBtnStyle: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 17, marginTop: 7.5, },
    txtFooter: { width: width - 75, fontSize: 13.5, color: DARKGRAY_COLOR, alignSelf: 'center', marginTop: 15 },
    btnSelectDate: { alignSelf: 'flex-start', width: width / 1.75, height: 50, borderBottomColor: GREY_COLOR, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'flex-start' }
})