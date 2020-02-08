import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import { WebView } from 'react-native-webview';

export default class ForgotPassword extends Component {

    render() {
        return (
            <View style={{ flex: 1 }}>
                <WebView source={{ uri: 'http://ruppinmobile.tempdomain.co.il/site08/build/#/sendemail' }} style={{ marginTop: 20 }} />
            </View>
        )
    }
}