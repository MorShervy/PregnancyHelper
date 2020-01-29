import React, { Component } from "react";
import { StyleSheet, View, Text, BackHandler } from 'react-native';
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
                        navigation.navigate({
                            routeName: 'Home',
                        })
                        navigation.toggleDrawer()
                    }}
                    tintColor={'#FFF'}
                />
            ),

        };
    }

    componentDidMount = async () => {
        // adding the event listener for back button android
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount = () => {
        // removing the event listener for back button android
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        const { navigation } = this.props;
        navigation.navigate({
            routeName: 'Home',
        })
        navigation.toggleDrawer()
    }

    render() {



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