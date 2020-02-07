import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { StackActions, NavigationActions, SwitchActions } from 'react-navigation';
import ItemToolList from '../../components/ItemToolList';
import SQL from '../../handlers/SQL';
import { observer } from 'mobx-react'
import contractionStore from '../../mobx/ContractionStore';
import userStore from "../../mobx/UserStore";
import pregnancyStore from "../../mobx/PregnancyStore";
const { height, width, fontScale } = Dimensions.get("window");

const GREY_COLOR = '#8e8e8e';

@observer
class Tools extends Component {
    constructor(props) {
        super(props);
        console.log('tools constructor')

    }

    static navigationOptions = {
        header: null,
    };

    componentDidMount = () => {
        const { navigation } = this.props;

    }

    componentDidUpdate = () => {
        console.log('tools did update')
    }
    render() {

        const { navigation } = this.props;

        handlePrees = (item) => {
            console.log('item=', item)
            if (item.key === 1)
                navigation.navigate('KickTracker')
            else if (item.key === 2)
                navigation.navigate('BellyBump')
            else if (item.key === 3)
                navigation.navigate('ContractionTimer')
            else if (item.key === 4)
                navigation.navigate('DueDate')
            else if (item.key === 5)
                navigation.navigate('Hospital')

        }
        console.log('tools render')
        return (
            <View style={styles.page} >
                <View style={styles.body}>
                    <Text style={styles.txtHeader}>Helpful Tools
                    to Make Your Pregnancy Smoother</Text>
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
    txtHeader: {
        // borderBottomColor: GREY_COLOR,
        // borderBottomWidth: 1,
        color: GREY_COLOR,
        textAlign: 'center',
        fontSize: 14 * fontScale,
        marginTop: '5%',
        marginBottom: '5%',
    }
});