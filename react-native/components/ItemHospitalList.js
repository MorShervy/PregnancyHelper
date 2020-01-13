import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ItemHospital from './ItemHospital';
import { Hospitals } from '../data/HospitalData';



const ItemHospitalList = props => {

    const _renderItem = item => ItemHospital(item, props);


    //console.log('props=', props)

    return (
        <FlatList
            //numColumns={3}
            contentContainerStyle={{ backgroundColor: '#FFF', alignItems: 'center' }}
            data={Hospitals}
            renderItem={_renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
        />
    )
}

export default ItemHospitalList;