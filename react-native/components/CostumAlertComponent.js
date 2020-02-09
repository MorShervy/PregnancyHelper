import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableNativeFeedback, Modal, TouchableHighlight } from 'react-native';



const { height, width, fontScale } = Dimensions.get("window");
const GREY_COLOR = '#e0e0e0';

export default class CostumAlertComponent extends Component {

    renderButtons() {
        const { props } = this;
        if (props.buttons !== undefined && props.buttons.length > 0) {
            const res = props.buttons.map((b, index) => (
                <TouchableHighlight
                    key={index}
                    style={styles.btnStyle}
                    onPress={() => props.handleButtonClick(b.key)}
                    underlayColor={GREY_COLOR}

                >
                    <Text style={styles.txtMiddlePart}>{b.text}</Text>
                </TouchableHighlight>
            ))
            return res;
        }
        return <View></View>
    }

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
                    <View style={[styles.mainContainer, { height: props.style }]}>
                        <View style={styles.topPart}>
                            <Text style={styles.txtTopPart}>{props.header}</Text>
                        </View>
                        <View style={styles.middlePart}>
                            {this.renderButtons()}
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
        // height: '27%',
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        // borderWidth: 1,
        // borderColor: '#FF0000',
        padding: 3,
    },
    topPart: {
        flex: 0.25,
        width: '100%',
        // borderWidth: 1,
        // borderColor: '#00FF00',
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    txtTopPart: {
        fontWeight: '500',
        fontSize: 14 * fontScale,
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
        marginVertical: 2,
        flexDirection: 'column',
        justifyContent: 'space-evenly',

    },
    btnStyle: {
        flex: 0.33,
        // borderWidth: 1,
        // borderColor: '#FF6600',
        paddingHorizontal: 14,
        paddingVertical: 5,
    },
    txtMiddlePart: {

        fontSize: 12 * fontScale,
    }
})