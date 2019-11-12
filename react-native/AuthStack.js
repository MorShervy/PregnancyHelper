import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import MainAppAuth from './pages/AppAuth/MainAppAuth';
import Login from './pages/AppAuth/Login';
import Register from './pages/AppAuth/Register';
import ForgotPassword from './pages/AppAuth/ForgotPassword';

const AuthStack = createStackNavigator(
    {
        MainAppAuth,
        Login,
        Register,
        ForgotPassword,
    },
    {
        defaultNavigationOptions: {
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: "#304251",
            },
        }
    }
);

export default AuthStack;