import React, { Component } from "react";
import { StyleSheet, View, Text } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { NavigationActions } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';


class MyProfile extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "My profile",
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
                <Text>My Profile</Text>
            </View>
        )
    }
}

export default MyProfile;