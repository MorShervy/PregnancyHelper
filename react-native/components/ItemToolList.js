import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ItemTool from './ItemTool';
import { ToolsData } from '../data/ToolsData';

const ItemToolList = props => {

    const _renderItem = item => ItemTool(item, props);

    return (
        <View style={{ paddingTop: '5%' }}>

            <FlatList
                style={{ flexDirection: 'column' }}
                numColumns={3}
                contentContainerStyle={styles.container}
                data={ToolsData}
                renderItem={_renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>

    )
}
export default ItemToolList;

const styles = StyleSheet.create({
    container: {
        //display: 'flex',
        //flexDirection: 'row',
        //justifyContent: 'flex-start',
        //flexWrap: 'wrap',
        alignItems: 'center'
    },
});