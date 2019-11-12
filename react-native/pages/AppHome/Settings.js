import React, { Component } from "react";
import { StyleSheet, View, Text } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';


class Settings extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Settings",
            headerLeft: (
                <HeaderBackButton
                    onPress={() => {
                        handleHeaderBackButton(navigation)
                    }}
                    tintColor={'#FFF'}
                />
            ),

        };
    }

    render() {

        handleHeaderBackButton = navigation => {
            //console.log('navigation=', navigation)
            navigation.navigate({
                routeName: 'Home',
            })
            navigation.toggleDrawer()
        }

        return (
            <View>
                <Text>Settings</Text>
            </View>
        )
    }
}

export default Settings;