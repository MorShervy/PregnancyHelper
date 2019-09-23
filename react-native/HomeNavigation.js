import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Calendar from './pages/AppHome/Calendar';
import Tools from './pages/AppHome/Tools';




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


const HomeNavigation = createStackNavigator(
    {
        TabNavigation,
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: "#304251",
                elevation: 0,
            },
        }
    }
)

export default HomeNavigation;

