import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableHighlight } from "react-native";

const APP_COLOR = '#304251';
const { height, width } = Dimensions.get("window");

const ItemPicture = ({ item }, props) => {
    console.log("props=", props)
    return (
        <TouchableHighlight
            style={styles.item}
            underlayColor={APP_COLOR}
            activeOpacity={1}
            onPress={() => props.handlePress(item.key)}
        >
            <Text style={styles.txtStyle}>{item.key}</Text>
        </TouchableHighlight>
    )
}

export default ItemPicture;

const styles = StyleSheet.create({
    item: {
        width: width / 3,
        marginHorizontal: '1%',
        marginVertical: '1%',
        //paddingTop: '1%',
        backgroundColor: 'lightgrey',
        shadowColor: "rgba(0,0,0,1.0)",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 10,
    },
    txtStyle: {
        fontSize: 70,
        fontWeight: '500',
        color: 'grey',
        textAlign: 'center'
    }
})