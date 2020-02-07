
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Text, TouchableOpacity, TouchableHighlight, Image, Dimensions, AsyncStorage } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import { Ionicons } from "@expo/vector-icons";
import { observer } from 'mobx-react'
import pregnancyStore from './mobx/PregnancyStore';

const { height, width, fontScale } = Dimensions.get("window");
const APP_COLOR = '#304251';
const GREY_COLOR = '#e0e0e0';

@observer class DrawerNavigation extends Component {
    constructor(props) {
        super(props);
    }

    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         header: null,

    //     };
    // }

    static navigationOptions = ({ navigation }) => {
        return {

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
        };
    }

    componentDidMount = () => {
        console.log('drawer did mount')
    }

    handleProfilePicture = () => {
        console.log('press')
    }

    handleOnItemPress = r => {
        const { navigation } = this.props;
        console.log('r=', r, 'props=', navigation.state.routeName)
        //this.props.navigation.navigate(r.route.routeName)
        navigation.navigate({
            // key: navigation.state.routeName,
            routeName: r.route.routeName,
        })

    }

    render() {


        //console.log('nav=', this.props.navigation.route);
        return (
            <ScrollView
                contentContainerStyle={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-between"
                }}
            >
                <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>

                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={this.handleProfilePicture}>
                            <Image
                                style={styles.img}
                                source={require('./assets/images/logo.png')}
                            />
                        </TouchableOpacity>
                        <Image
                            source={require('./assets/images/PregnancyHelper.png')}
                            style={{ height: 55, width: '100%' }}
                        />
                        {/* <Text style={{ color: '#FFF', fontWeight: '300', fontSize: 15 * fontScale }}>Pregnancy Helper</Text> */}
                    </View>


                    <DrawerItems
                        {...this.props}
                        onItemPress={r => { this.handleOnItemPress(r) }}
                    />
                    <View style={{ height: '0.1%', width: width - 100, alignSelf: 'center', backgroundColor: '#8e8e8e' }}></View>
                    <View style={{ height: 50, width, }}>
                        <TouchableOpacity
                            underlayColor={GREY_COLOR}
                            style={styles.btnSignOut}
                            onPress={() => AsyncStorage.removeItem("user").then(
                                this.props.navigation.navigate("AuthStack")
                            )}
                        >
                            <Ionicons
                                name="md-log-out"
                                size={25}
                                color='#8e8e8e'
                                style={styles.iconSignOut}
                            />

                            <Text style={styles.txtSignOut}>Sign out</Text>

                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScrollView>
        )
    }
}

export default DrawerNavigation;

const styles = StyleSheet.create({
    header: {
        height: height / 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: APP_COLOR,
        // paddingTop: 40
    },
    img: {
        width: 60,
        height: 60,
        borderRadius: 60,
        borderColor: '#FFF',
        borderWidth: 0.85,
        top: 10
    },
    btnSignOut: {
        flex: 1,
        // borderWidth: 1,
        // borderColor: '#00FF00',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: GREY_COLOR

    },
    txtSignOut: {
        flex: 1,
        fontSize: 10 * fontScale,
        fontWeight: '700',
        // borderWidth: 1,
        // borderColor: '#FF0000'
    },
    iconSignOut: {
        flex: 0.1,
        // borderWidth: 1,
        // borderColor: '#0000FF',
        paddingHorizontal: 18
    }
})