import React, { Component } from 'react';
import { View, I18nManager, AsyncStorage } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
import { activateKeepAwake, deactivateKeepAwake, useKeepAwake } from 'expo-keep-awake';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import { observer } from 'mobx-react'
import userStore from './mobx/UserStore';
import pregnancyStore from './mobx/PregnancyStore';

I18nManager.forceRTL(false);

@observer
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      userId: 0
    };
  }

  componentDidMount = () => {
    AsyncStorage.getItem('user').
      then(res => JSON.parse(res)).
      then(res => {
        console.log("app will mount - res= ", res)
      })

    activateKeepAwake()
  }

  componentWillUnmount = () => {
    // deactivateKeepAwake()
  }

  async _cacheResourcesAsync() {
    const images = [
      require('./assets/images/bgpic.png'),
      require('./assets/images/user.png'),
      require('./assets/images/logo.png'),
      require('./assets/images/bgCal.jpg')
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
      HomeStack,
    },
    {
      initialRouteName: 'AuthStack',
      // defaultNavigationOptions: {
      //   header: null,
      // }
    }
  )
)

