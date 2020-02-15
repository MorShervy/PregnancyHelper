import React, { Component } from 'react';
import { TouchableOpacity, View, Dimensions, Image, StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Ionicons } from "@expo/vector-icons";
import Calendar from './pages/AppHome/Calendar';
import Tools from './pages/AppHome/Tools';
import MyProfile from './pages/AppHome/MyProfile';
import Settings from './pages/AppHome/Settings';
import About from './pages/AppHome/About';
import DrawerNavigation from './DrawerNavigation';


const { height, width } = Dimensions.get("window");
const APP_COLOR = '#304251';


const MyProfileStack = createStackNavigator(
    {
        MyProfile: {
            screen: MyProfile,
        },
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            headerStyle: {
                backgroundColor: "#304251",
            },
            headerTintColor: '#FFF',
        }),
    }
)

const SettingsStack = createStackNavigator(
    {
        Settings: {
            screen: Settings,
        },
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            headerStyle: {
                backgroundColor: "#304251",
            },
            headerTintColor: '#FFF',
        }),
    }
)

const AboutStack = createStackNavigator(
    {
        About: {
            screen: About,
        },
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            headerStyle: {
                backgroundColor: "#304251",
            },
            headerTintColor: '#FFF',
        }),
    }
)



const TabNavigation = createMaterialTopTabNavigator(
    {
        Calendar,
        Tools
    },
    {
        backBehavior: 'history',
        swipeEnabled: false,
        tabBarOptions: {
            style: {
                backgroundColor: APP_COLOR
            },
            indicatorStyle: {
                backgroundColor: '#FFF'
            }
        }
    }
);

const TabNavigationStack = createStackNavigator(
    {
        TabNavigation: {
            screen: TabNavigation
        },
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            headerStyle: {
                backgroundColor: "#304251",
                elevation: 0,
            },
            headerLeft: (<TouchableOpacity
                style={{ marginLeft: 20 }}
                onPress={() => { navigation.toggleDrawer(); }}
            >
                <Image
                    source={require('./assets/images/logo.png')}
                    style={
                        {
                            height: 35,
                            width: 35,
                            opacity: 0.8,
                            borderRadius: 60,
                            borderWidth: 1,
                            borderColor: '#FFF',

                        }
                    } />
            </TouchableOpacity>
            ),
            headerTitle: 'My Pregnancy',
            headerTintColor: '#FFF'
        }),
    }
)
TabNavigationStack.navigationOptions = {
    drawerLabel: () => null,
}

const DrawerStack = createDrawerNavigator(
    {
        Home: {
            name: TabNavigationStack,
            screen: TabNavigationStack,
        },
        MyProfileStack: {
            name: MyProfileStack,
            screen: MyProfileStack,
            navigationOptions: {
                drawerLabel: 'My profile',
                drawerIcon: ({ tintColor }) => (
                    <Ionicons
                        name="md-contact"
                        size={25}
                        color='#8e8e8e'
                    />
                )
            }
        },
        // SettingsStack: {
        //     name: SettingsStack,
        //     screen: SettingsStack,
        //     navigationOptions: {
        //         drawerLabel: 'Settings',
        //         drawerIcon: ({ tintColor }) => (
        //             <Ionicons
        //                 name="md-settings"
        //                 size={25}
        //                 color='#8e8e8e'
        //             />
        //         )
        //     },
        // },
        // AboutStack: {
        //     name: AboutStack,
        //     screen: AboutStack,
        //     navigationOptions: {
        //         drawerLabel: 'About',
        //         drawerIcon: ({ tintColor }) => (
        //             <Ionicons
        //                 name="md-information-circle"
        //                 size={25}
        //                 color='#8e8e8e'
        //             />
        //         )
        //     },
        // },
        // LogOut: {

        // }
    },
    {
        unmountInactiveRoutes: true,
        drawerWidth: width - 100,
        edgeWidth: 35,
        contentComponent: DrawerNavigation,
    }
)


export default class AppStack extends Component {
    static router = DrawerStack.router;
    render() {
        const { navigation } = this.props;
        return (
            <View
                style={{
                    width,
                    height,
                }}
            >
                <StatusBar
                    translucent={true}
                    backgroundColor={APP_COLOR} />
                <DrawerStack navigation={navigation} />
            </View>
        )
    }
}

