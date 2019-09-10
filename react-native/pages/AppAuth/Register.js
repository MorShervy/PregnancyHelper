import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, DatePickerAndroid, TouchableOpacity, BackHandler } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { HeaderBackButton } from 'react-navigation-stack';

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
            dueDateToShow: 'Due Date/Child`s Birth...',
            dueDate: '',
            selectDateToShow: 'Select a date',
            selectedDate: '',
            isFocusedEmail: false,
            isFocusedPass: false,
            errorEmail: false,
            errorPass: false,
            errorDate: false,
            isVisiblePass: false,
        }
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

    componentDidMount = () => {
        // adding the event listener for back button android
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount = () => {
        // removing the event listener for back button android
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    // handle back button android
    handleBackButton = async () => {
        const { navigation } = this.props
        if (navigation.state.params !== undefined && navigation.state.params.showCalc) {
            await navigation.setParams({ showCalc: false })
            this.setState({ showCalc: false })
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
        const { email, pass, dueDate } = this.state;
        const { errorEmail, errorPass, errorDate } = this.state;
        const { isFocusedEmail, isFocusedPass, isVisiblePass } = this.state;
        const { dueDateToShow, selectDateToShow } = this.state;
        const { navigation } = this.props;

        toggleVisiblePass = () => {
            this.setState({ isVisiblePass: !isVisiblePass })
        }

        handleOnPressDatePicker = async () => {
            console.log('check=', this.props.navigation.state.params)
            try {
                const { action, year, month, day } = await DatePickerAndroid.open({
                    //maxDate: new Date(),
                    mode: 'default' // spiner or calender
                });
                if (action === DatePickerAndroid.dateSetAction) {
                    this.setState({
                        dueDate: `${month + 1}/${day}/${year}`,
                        dueDateToShow: new Date(`${month + 1}/${day}/${year}`).toDateString(),
                        selectDateToShow: new Date(`${month + 1}/${day}/${year}`).toDateString()
                    });
                }

            } catch ({ code, message }) {
                console.log('Cannot open date picker', message);
            }
        }

        handleOnPressRegister = async () => {
            const isPassed = handleInputTesting()
            if (!isPassed)
                return;


        }

        handleOnPressCalculate = () => {

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
            if (dueDate === '') {
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
            await this.props.navigation.setParams({ showCalc: true })
        }

        return (
            navigation.state.params !== undefined && navigation.state.params.showCalc
                ?
                <View style={styles.page}>
                    <View style={[styles.body, { top: 20 }]}>
                        <Text style={styles.txtHeaderStyle}>What was the first day{`\n`}of your last menstrual{`\n`}period?</Text>
                        {/* select last menstrual for calculate due date */}
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons name="md-calendar" size={35} color={APP_COLOR} style={{ top: 10, right: 10 }} />
                            <TouchableOpacity
                                style={styles.btnSelectDate}
                                onPress={handleOnPressDatePicker}
                            >
                                <Text style={styles.txtDueDateStyle}>{selectDateToShow}</Text>

                            </TouchableOpacity>
                        </View>
                        {/* button track my baby */}
                        <View style={{ marginTop: 30 }}>
                            <TouchableOpacity
                                disabled={false}
                                style={[styles.btnStyle, { backgroundColor: APP_COLOR }]}
                                onPress={handleOnPressCalculate}
                            >
                                <Text style={styles.txtBtnStyle}>Calculate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                :
                <View style={styles.page}>
                    <View style={styles.body}>
                        {/* header title */}
                        <Text style={styles.txtHeaderStyle}>This won't take long</Text>

                        {/* register form */}
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>

                            {/* email */}
                            {isFocusedEmail && <Text style={{ color: GREEN_COLOR, fontSize: 10, marginBottom: -20 }}>Email</Text>}
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

                            {/* password */}
                            {isFocusedPass && <Text style={{ color: GREEN_COLOR, fontSize: 10, marginBottom: -20 }}>Password</Text>}
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

                            {/* due date */}
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <TouchableOpacity
                                    style={styles.btnDueDateStyle}
                                    onPress={handleOnPressDatePicker}
                                >
                                    <Text style={styles.txtDueDateStyle}>{dueDateToShow}</Text>

                                </TouchableOpacity>
                                <Ionicons name="md-calendar" size={35} color={APP_COLOR} style={{ left: 10, top: 12 }} />
                            </View>

                            {/* error due date */}
                            {!errorDate ? null
                                :
                                <Text style={styles.errorTxtStyle}>Please enter a date</Text>
                            }

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
    txtDueDateStyle: { color: GREY_COLOR, marginTop: 20, fontSize: 15, },
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