import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import ItemToolList from '../../components/ItemToolList';

const { height, width } = Dimensions.get("window");

const GREY_COLOR = '#8e8e8e';

class Tools extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { navigation } = this.props;

        handlePrees = (item) => {
            //console.log('item=', item)
            if (item.key === 2)
                navigation.navigate('BellyBump')
            if (item.key === 6)
                navigation.navigate('Hospital')

        }
        return (
            <View style={styles.page}>
                <View style={styles.body}>
                    <Text style={[styles.pregnancyTool, { color: GREY_COLOR }]}>PREGNANCY TOOLS</Text>
                    <ItemToolList handlePrees={(item) => handlePrees(item)} />
                </View>
            </View>
        );
    }
}
export default Tools;

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    body: {
        marginTop: '3%',
        alignSelf: 'center',
        width: width - 50,
    },
    pregnancyTool: {
        borderBottomColor: GREY_COLOR,
        borderBottomWidth: 1,
    }
});