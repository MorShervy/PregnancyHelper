import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ItemPicture from './ItemPicture';

const ItemPictureList = props => {

    // console.log('props.album=', props)
    // console.log('props.album=', props.week)
    const _renderItem = item => ItemPicture(item, props);

    return (
        <FlatList
            numColumns={3}
            contentContainerStyle={{ alignSelf: 'center', flexDirection: 'column-reverse' }}
            data={props.newArr}
            renderItem={_renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
        />
    )
}

export default ItemPictureList;