import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import MainAppAuth from './pages/AppAuth/MainAppAuth';
import Login from './pages/AppAuth/Login';
import Register from './pages/AppAuth/Register';

const AuthNavigation = createStackNavigator(
    {
        MainAppAuth,
        Login,
        Register,
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: "#304251",
            },
        }
    }
);

export default AuthNavigation;