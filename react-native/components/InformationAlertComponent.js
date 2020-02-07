

import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableNativeFeedback, Modal, TouchableHighlight } from 'react-native';



const { height, width, fontScale } = Dimensions.get("window");
const GREY_COLOR = '#e0e0e0';
const APP_COLOR = '#304251';
const TXT_GREY = '#808080';

export default class InformationAlertComponent extends Component {



    render() {
        const { props } = this;
        return (
            <Modal
                visible={props.displayAlert}
                transparent={true}
                animationType={"fade"}
                onRequestClose={() => {
                    props.handleCloseAlert()
                }}
            >
                <View style={styles.mainOuterContainer}>
                    <View style={styles.mainContainer}>
                        <View style={styles.topPart}>
                            <Text style={styles.txtTopPart}>{props.header}</Text>
                        </View>
                        <View style={styles.middlePart}>
                            <Text>{props.body}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }


}

const styles = StyleSheet.create({
    mainOuterContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000088'
    },
    mainContainer: {
        flexDirection: 'column',
        height: '55%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        // borderWidth: 1,
        // borderColor: '#FF0000',
        padding: 3,
    },
    topPart: {
        flex: 0.1,
        width: '100%',
        // borderWidth: 1,
        // borderColor: '#00FF00',
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    txtTopPart: {
        color: APP_COLOR,
        fontWeight: '500',
        fontSize: 15 * fontScale,
    },
    middlePart: {
        flex: 1,
        width: '100%',
        // borderWidth: 1,
        // borderColor: '#FF6600',
        textAlign: 'center',
        textAlignVertical: 'center',
        padding: 3,
        color: '#FFF',
        paddingHorizontal: 10,
        // marginVertical: 2,
        // flexDirection: 'column',
        // justifyContent: 'flex-start',

    },
    btnStyle: {
        flex: 0.33,
        // borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 5,
    },
    txtMiddlePart: {
        color: TXT_GREY,
        fontWeight: '400',
        fontSize: 11.5 * fontScale,
    }
})