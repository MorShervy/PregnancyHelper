import React, { Component } from 'react';
import { StyleSheet, View, I18nManager, AsyncStorage } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
import { activateKeepAwake, deactivateKeepAwake, useKeepAwake } from 'expo-keep-awake';
import AuthStack from './AuthStack';
import AppStack from './AppStack'
import SQL from './handlers/SQL';
import { observer } from 'mobx-react'
import userStore from './mobx/UserStore';
import pregnancyStore from './mobx/PregnancyStore';
import CostumAlertComponent from './components/CostumAlertComponent';

I18nManager.forceRTL(false);

class Test extends Component {

  render() {
    return (
      <View style={styles.container}>
        <CostumAlertComponent
          displayAlert={true}
          header={'Gender'}
          boy={'Boy'}
          girl={'Girl'}
          unknown={`Don't know`}
        />
      </View>
    )
  }
}

@observer
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      userId: 0
    };
  }

  componentDidMount = async () => {
    activateKeepAwake()
    // console.disableYellowBox = true
    AsyncStorage.getItem('user').
      then(res => JSON.parse(res)).
      then(async res => {
        console.log("app did mount - res= ", res)
        if (res !== null) {
          SQL.GetUserById(res.ID).then(
            (sqlRes) => userStore.setEmail(sqlRes.Email)
          )
        }
      })


  }

  componentWillUnmount = () => {
    // deactivateKeepAwake()
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
      // defaultNavigationOptions: {
      //   header: null,
      // }
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