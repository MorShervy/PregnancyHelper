import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ImageBackground, TouchableHighlight } from "react-native";


const APP_COLOR = '#304251';
const { height, width } = Dimensions.get("window");

const ItemPicture = ({ item }, props) => {


    if (props.newArr.length > 0) {
        let picture;
        let pic

        if (props.album !== undefined && props.album.length > 0) {
            // console.log('props.album.length=', props.album.length)
            picture = props.album.filter(pic => pic.WeekID === item.key);
            pic = picture[0];
        }

        // if (pic !== undefined)
        //     console.log('pic=', pic.PictureUri)
        return (
            <TouchableHighlight
                style={styles.item}
                underlayColor={APP_COLOR}
                activeOpacity={1}
                onPress={() => props.handlePress(item.key)}
            >

                <ImageBackground
                    style={styles.backgroundImageStyle}
                    imageStyle={{ resizeMode: 'stretch' }}
                    source={
                        (pic !== undefined && { uri: pic.PictureUri } || null)

                    }
                >
                    {pic === undefined && <Text style={styles.txtStyle}>{item.key}</Text>}
                </ImageBackground>
            </TouchableHighlight>
        )
    }
    else {
        return (<View></View>)
    }
}


export default ItemPicture;

const styles = StyleSheet.create({
    item: {
        height: height / 6,
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
    backgroundImageStyle: {
        height: height / 6,
        width: '100%',
        alignSelf: 'center'

    },
    txtStyle: {
        // paddingTop: 20,
        fontSize: 70,
        fontWeight: '100',
        color: 'grey',
        textAlign: 'center',
    }
})