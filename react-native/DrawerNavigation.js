
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Text, TouchableOpacity, Image, Dimensions, AsyncStorage } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';

const { height, width } = Dimensions.get("window");

class DrawerNavigation extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: null,

        };
    }


    render() {

        const handleOnItemPress = r => {
            const { navigation } = this.props;
            //console.log('r=', r, 'props=', navigation.state.routeName)
            //this.props.navigation.navigate(r.route.routeName)
            navigation.navigate({
                key: navigation.state.routeName,
                routeName: r.route.routeName,

            })

        }

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
                        <Image
                            style={styles.img}
                            source={require('./assets/images/user.png')}
                        />
                    </View>


                    <DrawerItems
                        {...this.props}
                        onItemPress={r => { handleOnItemPress(r) }}
                    />
                    <View style={{ height: '0.1%', width: width - 100, alignSelf: 'center', backgroundColor: '#8e8e8e' }}></View>
                    <TouchableOpacity
                        onPress={() => AsyncStorage.removeItem("user").then(
                            this.props.navigation.navigate("AuthStack")
                        )}
                    >
                        <Text>sign out</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </ScrollView>
        )
    }
}

export default DrawerNavigation;

const styles = StyleSheet.create({
    header: {
        height: '35%',
        backgroundColor: "#2C3E50",
        paddingTop: 10
    },
    img: {
        left: 20,
        width: 60,
        height: 60,
        borderRadius: 60,
        borderColor: '#FFF',
        borderWidth: 0.5,
    }
})