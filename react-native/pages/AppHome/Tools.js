import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

class Tools extends Component {
    render() {
        return (
            <View style={styles.page}>
                <Text>Tools</Text>
            </View>
        );
    }
}
export default Tools;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});