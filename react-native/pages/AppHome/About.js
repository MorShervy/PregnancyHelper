import React, { Component } from "react";
import { StyleSheet, View, Text } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';


class About extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "About",
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
                <Text>About</Text>
            </View>
        )
    }
}

export default About;