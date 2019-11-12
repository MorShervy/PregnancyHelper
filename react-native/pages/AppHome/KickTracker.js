import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableHighlight } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';


export default class KickTracker extends Component {
    constructor(props) {
        super(props);

    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Kick tracker",
            headerLeft: (
                <HeaderBackButton
                    onPress={() => handleHeaderBackButton(navigation)}
                    tintColor={'#FFF'}
                />
            ),

        };
    }


    render() {

        handleHeaderBackButton = navigation => {
            console.log('navigation=', navigation)
            navigation.navigate({
                routeName: 'Home',
            })
        }

        return (
            <View style={{ flex: 1 }}>
                <Text>Kick tracker</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({


})