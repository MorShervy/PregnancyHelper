import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableHighlight } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { Ionicons } from "@expo/vector-icons";
import ItemPictureList from '../../components/ItemPictureList';


import { observer } from 'mobx-react'
import pregnancyStore from '../../mobx/PregnancyStore';

const { height, width } = Dimensions.get("window");

@observer
export default class BellyBump extends Component {
    constructor(props) {
        super(props);

    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Belly bump",
            headerLeft: (
                <HeaderBackButton
                    onPress={() => handleHeaderBackButton(navigation)}
                    tintColor={'#FFF'}
                />
            ),

        };
    }

    takePicture = week => {
        pregnancyStore.setWeek(week);
        this.props.navigation.navigate('CameraPage')
    }

    render() {

        handleHeaderBackButton = navigation => {
            console.log('navigation=', navigation)
            navigation.navigate({
                routeName: 'Home',
            })
        }



        return (
            <View style={{ flex: 1 }}>
                {/* header buttons row  */}
                <View style={styles.headerButtonsStyle}>
                    {/* belly picture button */}
                    <TouchableHighlight
                        style={styles.buttonStyle}
                        underlayColor={'#F4AC32'}
                        activeOpacity={1}
                        onPress={(key) => this.takePicture(key)}
                    >
                        <View style={styles.rowDirection}>
                            <View style={styles.iconViewStyle}>
                                <Ionicons name="md-camera" size={30} color="#FFF" />
                            </View>
                            <Text style={styles.txtButtonStyle}>BELLY{"\n"}PICTURE</Text>
                        </View>
                    </TouchableHighlight>
                    {/* create belly bump button */}
                    <TouchableHighlight
                        style={styles.buttonStyle}
                        underlayColor={'#F4AC32'}
                        activeOpacity={1}
                        onPress={() => this.createBellyBump}
                    >
                        <View style={styles.rowDirection}>
                            <View style={styles.iconViewStyle}>
                                <Ionicons name="md-videocam" size={30} color="#FFF" />
                            </View>
                            <Text style={styles.txtButtonStyle}>CREATE{"\n"}BELLY BUMP</Text>
                        </View>
                    </TouchableHighlight>
                </View>

                <View style={{ flex: 0.9 }} >
                    <View style={{ width: width - 3, alignSelf: 'center', marginTop: '3%' }}>
                        {/* שימוש בקומפוננטה להצגת כל התמונות ברשימה עם אפשרות לגלילה */}
                        <ItemPictureList handlePress={(key) => this.takePicture(key)} />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerButtonsStyle: { flex: 0.1, flexDirection: 'row' },
    buttonStyle: { flex: 0.5, backgroundColor: '#F4AC32', borderRightWidth: 1, borderRightColor: '#FFF', justifyContent: 'center' },
    rowDirection: { flexDirection: 'row' },
    iconViewStyle: { marginHorizontal: '7%', alignSelf: 'center' },
    txtButtonStyle: { color: "#FFF", fontWeight: 'bold', fontSize: 15 },

})