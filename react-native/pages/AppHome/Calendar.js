import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, BackHandler, AsyncStorage } from 'react-native';
import { WebView } from 'react-native-webview';

export default class Calendar extends Component {

    constructor(props) {
        super(props);

    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <WebView source={{ uri: 'https://google.com' }} style={{ marginTop: 20 }} />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})