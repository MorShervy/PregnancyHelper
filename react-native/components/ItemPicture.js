import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableHighlight } from "react-native";

const { height, width } = Dimensions.get("window");

const ItemPicture = ({ item }, props) => (
    <TouchableHighlight
        style={styles.item}
        underlayColor={'grey'}
        activeOpacity={1}
        onPress={() => console.log('click')}
    >
        <Text style={styles.txtStyle}>{item.key}</Text>
    </TouchableHighlight>
)

export default ItemPicture;

const styles = StyleSheet.create({
    item: {
        width: width / 3,
        marginHorizontal: '1%',
        marginVertical: '1%',
        //paddingTop: '1%',
        backgroundColor: 'lightgrey'
    },
    txtStyle: {
        fontSize: 70,
        fontWeight: 'bold',
        color: 'grey',
        textAlign: 'center'
    }
})