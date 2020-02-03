import React, { Component } from "react";
import { StyleSheet, View, Text, BackHandler, Dimensions, DatePickerAndroid } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { NavigationActions } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import { Ionicons } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");
const GREY_COLOR = '#8e8e8e';
const APP_COLOR = '#304251';


class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastMenstrualPeriodToShow: 'Select a date',
            lastMenstrualPeriodDate: '',
        }
    }

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
            <View style={styles.page}>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    page: { flex: 1 },

})

export default MyProfile;