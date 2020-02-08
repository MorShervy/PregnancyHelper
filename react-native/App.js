import React, { Component } from 'react';
import { StyleSheet, View, I18nManager, AsyncStorage } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
import { activateKeepAwake } from 'expo-keep-awake';
import AuthStack from './AuthStack';
import AppStack from './AppStack'
import SQL from './handlers/SQL';
import { observer } from 'mobx-react'
import userStore from './mobx/UserStore';


I18nManager.forceRTL(false);



@observer
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      userId: 0
    };

    activateKeepAwake()
  }

  async _cacheResourcesAsync() {
    const images = [
      require('./assets/images/bgpic.png'),
      require('./assets/images/user.png'),
      require('./assets/images/logo.png'),
      require('./assets/images/bgCal.jpg'),
      require('./assets/images/profileIcon.png'),
      require('./assets/images/PregnancyHelper.png')
    ];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  }

  render() {


    return (
      !this.state.isReady ?
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
        :
        <AppContainer />
    );
  }
}

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {

      AuthStack,
      AppStack
    },
    {
      initialRouteName: 'AuthStack',
    }
  )
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
})