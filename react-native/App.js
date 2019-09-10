import React, { Component } from 'react';
import { View, I18nManager } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
import { useKeepAwake } from 'expo-keep-awake';
import AuthNavigation from './AuthNavigation';

I18nManager.forceRTL(false);


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }



  async _cacheResourcesAsync() {
    const images = [require('./assets/images/bgpic.png')];

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

const RootStack = createStackNavigator(
  {
    AuthNavigation,
  },
  {
    initialRouteName: 'AuthNavigation',
    defaultNavigationOptions: {
      header: null,
    }
  }
)

const AppContainer = createAppContainer(RootStack)