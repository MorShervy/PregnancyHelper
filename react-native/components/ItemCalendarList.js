import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ItemCalendar from './ItemCalendar';


const ItemCalendarList = (props) => {
    console.log('ItemCalendarList===', props)
    const _renderItem = () => ItemCalendar(props);

    const data = [
        {
            key: props.weekData.key,
            title: props.weekData.title,
            body: props.weekData.body
        }
    ]

    return (

        <FlatList
            // style={{ }}
            // contentContainerStyle={{ paddingTop: 100 }}
            data={data}
            renderItem={_renderItem}
            keyExtractor={(index) => index.toString()}
            showsVerticalScrollIndicator={false}
        />

    )


}

export default ItemCalendarList;