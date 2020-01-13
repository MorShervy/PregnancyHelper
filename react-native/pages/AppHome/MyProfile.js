import React, { Component } from "react";
import { StyleSheet, View, Text } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { NavigationActions } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import FadeInView from '../../components/FadeInView';


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
            // <View>
            //     <Text>My Profile</Text>
            // </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <FadeInView style={{ width: 250, height: 50, backgroundColor: 'powderblue' }}>
                    <Text style={{ fontSize: 28, textAlign: 'center', margin: 10 }}>Fading in</Text>
                </FadeInView>
            </View>
        )
    }
}

export default MyProfile;