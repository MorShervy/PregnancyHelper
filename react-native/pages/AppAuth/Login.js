import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TextInput, TouchableOpacity, ActivityIndicator, AsyncStorage } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import SQL from '../../handlers/SQL';
import { observer } from 'mobx-react'
import userStore from '../../mobx/UserStore';
import pregnancyStore from '../../mobx/PregnancyStore';

const { height, width } = Dimensions.get("window");

const regexEmail = /^(([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}))$/;
const regexPassword = /^(.{8,49})$/;
const GREEN_COLOR = '#3CB371';
const GREY_COLOR = '#8e8e8e';
const APP_COLOR = '#304251';
const RED_COLOR = '#FF0000';

@observer
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            pass: '',
            isFocusedEmail: false,
            isFocusedPass: false,
            errorEmail: false,
            errorPass: false,
            errorEmailExist: false,
            isVisiblePass: false,
            isLoading: false,
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
        const { email, pass } = this.state;
        const { errorEmail, errorPass, errorEmailExist } = this.state;
        const { isFocusedEmail, isFocusedPass, isVisiblePass, isLoading } = this.state;
        const { navigation } = this.props;

        handleOnPressLogin = async () => {
            const isPassed = handleInputTesting()
            if (!isPassed)
                return;

            this.setState({ errorEmail: false, errorPass: false, errorEmailExist: false, isLoading: true })
            const sqlResult = await SQL.Login(email.toLowerCase(), pass);
            // console.log('res=', sqlResult)

            if (sqlResult.ID < 1) {
                setTimeout(() => {
                    this.setState({ isLoading: false, errorEmailExist: true })
                }, 1000)
                return;
            }
            AsyncStorage.setItem(
                "user",
                JSON.stringify({
                    ID: sqlResult.ID
                })
            )
            userStore.setId(sqlResult.ID);
            pregnancyStore.getPregnancyByUserId(sqlResult.ID)
            navigation.navigate('HomeStack')
        }

        toggleVisiblePass = () => {
            this.setState({ isVisiblePass: !isVisiblePass })
        }

        handleInputTesting = () => {
            // email test
            if (email === '' || !(regexEmail.test(email.toUpperCase()))) {
                this.setState({
                    errorEmail: true,
                    errorPass: false,
                })
                return false;
            }
            // pass test
            if (pass === '' || !(regexPassword.test(pass.toUpperCase()))) {
                this.setState({
                    errorEmail: false,
                    errorPass: true,
                })
                return false;
            }
            return true;
        }

        return (
            <View style={styles.page}>
                <LinearGradient
                    colors={isLoading ? ['#00000070', '#00000070'] : ['transparent', 'transparent']}
                    style={styles.LinearGradientStyle}
                >
                    {
                        isLoading &&
                        <ActivityIndicator style={styles.activityIndicator} color={APP_COLOR} size={40} />
                    }
                    <View style={styles.body}>
                        {/* header title */}
                        <Text style={styles.txtHeaderStyle}>Use your
                    {'\n'}PregnancyHelper login
                    </Text>


                        {/* view login inputs */}
                        <View style={{ width: width - 75, flexDirection: 'column', justifyContent: 'space-between', marginLeft: 5 }}>

                            {/* view email input */}
                            <View style={{ width: width - 75, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                {/* view icon */}
                                <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name="md-mail" size={23} color={GREY_COLOR} style={{ top: 7.5 }} />
                                </View>

                                <View style={{ marginBottom: 10 }}>
                                    {/*view text input email */}
                                    <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>

                                        {
                                            (isFocusedEmail || email !== '') &&
                                            <Text
                                                style={{
                                                    color: isFocusedEmail ? GREEN_COLOR : GREY_COLOR,
                                                    fontSize: 12,
                                                    marginBottom: -20,

                                                }}
                                            >Email
                                    </Text>
                                        }
                                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
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
                                    </View>
                                </View>

                            </View>


                            <View style={{ marginBottom: 10 }}>
                                {/* view password input */}
                                <View style={{ width: width - 75, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    {/* view icon */}
                                    <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                                        <Ionicons name="md-lock" size={32} color={GREY_COLOR} style={{ top: 5 }} />
                                    </View>


                                    {/* view text input password*/}
                                    <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginLeft: 11 }}>
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
                                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
                                                    style={{ right: 25, top: 10 }}
                                                    onPress={toggleVisiblePass}
                                                >
                                                    <Ionicons
                                                        name={isVisiblePass ? "md-eye-off" : "md-eye"}
                                                        size={25}
                                                        color={GREY_COLOR} />
                                                </TouchableOpacity>
                                            </View>

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
                                        {
                                            !errorEmailExist ? null
                                                :
                                                <Text style={styles.errorTxtStyle}>Incorrect username or password</Text>
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <TouchableOpacity
                                style={[styles.btnStyle, { backgroundColor: APP_COLOR }]}
                                onPress={handleOnPressLogin}
                            >
                                <Text
                                    style={styles.txtBtnStyle}
                                >Log In
                            </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <TouchableOpacity
                                style={{ alignSelf: 'center' }}
                                onPress={() => { navigation.navigate('ForgotPassword') }}
                            >
                                <Text
                                    style={{ color: '#32CD32' }}
                                >Forgot password?
                            </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </LinearGradient>
            </View >
        );
    }
}


const styles = StyleSheet.create({
    page: { flex: 1 },
    body: { flex: 0.7, width: width - 50, alignSelf: 'center' },
    txtHeaderStyle: { fontSize: 25, color: APP_COLOR, marginTop: 10, marginBottom: 10 },
    txtInputStyle: { width: width - 100, height: 50, fontSize: 17, paddingTop: 10, borderBottomColor: GREY_COLOR, borderBottomWidth: 1, },
    txtInputFocusStyle: { borderBottomColor: GREEN_COLOR, borderBottomWidth: 1.5 },
    errorTxtStyle: { fontSize: 12, fontWeight: '200', color: RED_COLOR, marginTop: 5 },
    btnStyle: { width: width - 50, height: 50, borderRadius: 7, },
    txtBtnStyle: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 17, marginTop: 7.5, },
    LinearGradientStyle: { position: 'absolute', left: 0, right: 0, top: 0, height: '100%' },
    activityIndicator: { position: 'absolute', alignSelf: 'center', marginTop: '35%' },
})