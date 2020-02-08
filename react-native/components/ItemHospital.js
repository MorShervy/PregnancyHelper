import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableHighlight } from "react-native";

const geolib = require('geolib');
const { height, width } = Dimensions.get("window");

const ItemHospital = ({ item }, props) => {

    // console.log('props=', props)

    return (
        <View>
            <TouchableHighlight
                style={styles.item}
                underlayColor={'grey'}
                activeOpacity={1}
                onPress={() => props.onItemClick(item.phone)}
            >
                <Text style={styles.txtStyle}>{item.title}{'\n'}{item.phone}{'\n'}Distance: {(geolib.getDistance(props.currentLocation, item.latLong) / 1000).toString().substring(0, 2)}km</Text>
            </TouchableHighlight>

        </View>
    )
}

export default ItemHospital;

const styles = StyleSheet.create({
    item: {
        width: width - 50,
        marginHorizontal: '2%',
        marginVertical: '2%',
        //paddingTop: '1%',
        backgroundColor: '#304251',
        shadowOpacity: 1,
        shadowColor: "rgba(0,0,0,0.15)",
        shadowRadius: 5,
        elevation: 15,
    },
    txtStyle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center'
    }
})