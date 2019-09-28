import React from 'react';
import { TouchableOpacity, Text, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from "@expo/vector-icons";
import Calendar from './pages/AppHome/Calendar';
import Tools from './pages/AppHome/Tools';
import Hospital from './pages/AppHome/Hospital';
import BellyBump from './pages/AppHome/BellyBump';



const TabNavigation = createMaterialTopTabNavigator(
    {
        Calendar,
        Tools,
    },
    {
        swipeEnabled: false,
        tabBarOptions: {
            style: {
                backgroundColor: '#304251'
            },
            indicatorStyle: {
                backgroundColor: '#FFF'
            }
        }
    }
);


const HomeNavigation = (props) = createStackNavigator(
    {
        BellyBump,
        TabNavigation,
        Hospital,

    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: "#304251",
                elevation: 0,
            },
            headerLeft: (<TouchableOpacity
                style={{ marginLeft: 20 }}
                onPress={() => { }}
            >
                <Ionicons name="md-transgender" color="#FFF" size={25} />
            </TouchableOpacity>
            ),
            headerTitle: 'My Pregnancy',
            headerTintColor: '#FFF'
        }
    }
)

export default HomeNavigation;

