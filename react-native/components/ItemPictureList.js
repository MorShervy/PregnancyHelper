import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ItemPicture from './ItemPicture';
import { PictureData } from '../data/PictureData';

const ItemPictureList = props => {

    // console.log('props.album=', props)

    const _renderItem = item => ItemPicture(item, props);

    return (
        <FlatList
            numColumns={3}
            contentContainerStyle={{ alignSelf: 'center', flexDirection: 'column-reverse' }}
            data={PictureData}
            renderItem={_renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
        />
    )
}

export default ItemPictureList;