

import React, { useState, useEffect } from "react";
import { View, TouchableHighlight, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ORANGE_COLOR = '#F4AC32';
const APP_COLOR = '#304251';

export default function BellyBumpHeaderButtons(props) {

    useEffect(() => {
        // console.log('props=', props)

    }, [])

    return (
        <View style={styles.headerButtonsStyle}>
            {/* handle left button for usecase */}
            <TouchableHighlight
                style={[styles.buttonStyle, { borderRightWidth: 2, borderRightColor: '#FFF' }]}
                underlayColor={APP_COLOR}
                activeOpacity={1}
                onPress={() => props.handleLeftBtn()}
            //on press belly bump (week) => this.takePicture(week) (props.handleSavePicture !== undefined && 
            >
                <View style={styles.rowDirection}>
                    <View style={styles.iconViewStyle}>
                        <Ionicons name={props.buttons.iconLeft} size={30} color="#FFF" />
                    </View>
                    <Text style={[
                        styles.txtButtonStyle,
                        props.style !== undefined &&
                        { fontSize: props.style.fontSize, left: props.style.left }
                    ]}>{props.buttons.txtLeft}</Text>
                </View>
            </TouchableHighlight>
            {/* handdle right button for usecase*/}
            <TouchableHighlight
                style={[styles.buttonStyle, { borderLeftWidth: 2, borderLeftColor: '#FFF' }]}
                underlayColor={APP_COLOR}
                activeOpacity={1}
                onPress={() => props.handleRightBtn()}
            >
                <View style={styles.rowDirection}>
                    <View style={styles.iconViewStyle}>
                        <Ionicons name={props.buttons.iconRight} size={30} color="#FFF" />
                    </View>
                    <Text style={[
                        styles.txtButtonStyle,
                        props.style !== undefined &&
                        { fontSize: props.style.fontSize, left: props.style.left }
                    ]}>{props.buttons.txtRight}</Text>
                </View>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    headerButtonsStyle: { flex: 0.07, flexDirection: 'row' },
    buttonStyle: { flex: 0.5, backgroundColor: '#F4AC32', justifyContent: 'center' },
    rowDirection: { flexDirection: 'row', justifyContent: 'space-evenly' },
    iconViewStyle: { alignSelf: 'center' },
    txtButtonStyle: { color: "#FFF", fontWeight: 'bold', fontSize: 15 },

})