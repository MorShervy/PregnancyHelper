import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableHighlight } from "react-native";

const { height, width } = Dimensions.get("window");
const GREY_COLOR = '#8e8e8e';
const BG_FEET = '#A52A2A';
const BG_CAMERA = '#F5DEB3';
const BG_CONTRACTION = '#2F4F4F';
const BG_BABYNAMES = '#94b8b8';
const BG_DUEDATE = '#e0ebeb';
const BG_HOSPITAL = '#F05555';
const APP_COLOR = '#304251';

const ItemTool = ({ item }, props) => (
    <TouchableHighlight
        style={styles.item}
        underlayColor={APP_COLOR}
        activeOpacity={1}
        onPress={() => props.handlePrees(item)}
    >
        <View>
            <View style={[styles.circleFrame, {
                backgroundColor: (item.key === 1 && BG_FEET ||
                    item.key === 2 && BG_CAMERA ||
                    item.key === 3 && BG_CONTRACTION ||
                    item.key === 4 && BG_BABYNAMES ||
                    item.key === 5 && BG_DUEDATE ||
                    item.key === 6 && BG_HOSPITAL)
            }]}>

                <Image
                    style={{ height: 55, width: 55 }}
                    source={(item.key === 1 && require('../assets/icons/feet.png') ||
                        item.key === 2 && require('../assets/icons/camera.png') ||
                        item.key === 3 && require('../assets/icons/contraction.png') ||
                        item.key === 4 && require('../assets/icons/babyNames.png') ||
                        item.key === 5 && require('../assets/icons/schedule.png') ||
                        item.key === 6 && require('../assets/icons/hospital.png'))}
                />
            </View>
            <Text style={styles.title}>{item.title}</Text>
        </View>
    </TouchableHighlight>
);
export default ItemTool;

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: '3.7%',
        paddingBottom: '3.7%',
        paddingTop: '3.7%',
        //alignSelf: 'center'
    },
    circleFrame: {
        height: 90,
        width: 90,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        alignSelf: 'center',
        paddingTop: '3%',
        color: GREY_COLOR,
        fontSize: 12
    },
});
