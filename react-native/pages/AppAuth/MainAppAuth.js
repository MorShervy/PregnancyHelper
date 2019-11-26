import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

export default class MainAppAuth extends Component {

    static navigationOptions = {
        header: null,
    };

    componentWillMount() {
        console.log('mainapp will mount')
        AsyncStorage.getItem("user").then(
            res => res !== null && this.props.navigation.navigate("HomeStack")
        );
    }

    componentDidMount() {

    }

    render() {
        console.log('mainapp render')

        return (
            <View style={styles.container}>

                <ImageBackground style={styles.backgroundImage} source={require('../../assets/images/bgpic.png')} />

                <LinearGradient
                    colors={['#00000070', '#00000070']}
                    style={styles.LinearGradientStyle}
                >
                    {/* logo with app name and some text */}
                    <View style={[{ flex: 0.6 }, styles.marginTopHeader]}>



                        {/* header text */}
                        <Text style={[styles.textStyle, { fontSize: 18, }]}>Pregnancy Helper</Text>

                        {/* paragraph text */}
                        <Text style={[styles.textStyle, { fontSize: 14, }]}>
                            Welcome to your trusted weekly{'\n'}
                            guide to pregnancy
                        </Text>
                        {/* logo */}
                        <View style={{ marginTop: '20%' }}>
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={{
                                    height: 90,
                                    width: 90,
                                    alignSelf: 'center',
                                    opacity: 0.65,
                                    borderRadius: 60,
                                    borderWidth: 2,
                                    borderColor: '#FFF',
                                }}
                            />
                        </View>
                    </View>

                    <View style={styles.buttonsStyle}>

                        {/* sign up button */}
                        <View style={styles.btnSignupMarginBottom}>
                            <TouchableOpacity
                                style={[styles.btnStyle, { backgroundColor: "#FFB400" }]}
                                onPress={() => { this.props.navigation.navigate('Register') }}
                            >
                                <Text style={styles.txtBtnStyle}>New? Sign up</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Login button */}
                        <View style={styles.btnLoginMarginTop}>
                            <TouchableOpacity
                                style={[styles.btnStyle, { backgroundColor: "#FFFFFF40" }]}
                                onPress={() => { this.props.navigation.navigate('Login') }}
                            >
                                <Text style={styles.txtBtnStyle}>Log in</Text>
                            </TouchableOpacity>
                        </View>


                    </View>
                </LinearGradient>
            </View >
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        position: 'absolute',
        height: height,
        width: width,
        resizeMode: 'cover', // or 'stretch'
    },
    LinearGradientStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height
    },
    marginTopHeader: {
        marginTop: '20%'
    },
    logoStyle: {
        alignSelf: 'center',
        marginTop: '1%'
    },
    textStyle: {
        color: '#fff',
        textAlign: 'center',
    },
    buttonsStyle: {
        flex: 0.4,
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '80%',
    },
    btnStyle: {
        width: width - 50,
        height: 40,
        borderRadius: 7,
    },
    txtBtnStyle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: '1%',
    },
    btnSignupMarginBottom: {
        marginTop: '0%'
    },
    btnLoginMarginTop: {
        marginTop: '15%'
    }
});
