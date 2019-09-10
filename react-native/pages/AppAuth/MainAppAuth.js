import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

export default class MainAppAuth extends Component {
    static navigationOptions = {
        header: null,
    };

    render() {
        return (
            <View style={styles.container}>

                <ImageBackground style={styles.backgroundImage} source={require('../../assets/images/bgpic.png')} />

                <LinearGradient
                    colors={['#00000070', '#00000070']}
                    style={styles.LinearGradientStyle}
                >
                    {/* logo with app name and some text */}
                    <View style={{ marginTop: 150 }}>

                        {/* icon */}
                        <Ionicons style={{ alignSelf: 'center', marginBottom: 10 }} name="md-transgender" color="#FFF" size={70} />

                        {/* header text */}
                        <View style={{ marginBottom: 10 }}>
                            <Text style={[styles.textStyle, { fontSize: 18, }]}>Pregnancy Helper</Text>
                        </View>

                        {/* paragraph text */}
                        <View style={{ marginBottom: 10 }}>
                            <Text style={[styles.textStyle, { fontSize: 14, }]}>
                                Welcome to your trusted weekly{'\n'}
                                guide to pregnancy
                        </Text>
                        </View>
                    </View>

                    <View style={styles.buttonsStyle}>

                        {/* sign up button */}
                        <View style={{ marginBottom: 10 }}>
                            <TouchableOpacity
                                style={[styles.btnStyle, { backgroundColor: "#FFB400" }]}
                                onPress={() => { this.props.navigation.navigate('Register') }}
                            >
                                <Text style={styles.txtBtnStyle}>New? Sign up</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Login button */}
                        <View style={{ marginBottom: 10 }}>
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
    textStyle: {
        color: '#fff',
        textAlign: 'center',
    },
    buttonsStyle: {
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height / 3,
    },
    btnStyle: {
        width: width - 50,
        height: 50,
        borderRadius: 7,
    },
    txtBtnStyle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 7.5,
    }
});
