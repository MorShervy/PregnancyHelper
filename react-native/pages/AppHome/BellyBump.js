import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableHighlight, AsyncStorage, Modal, TouchableOpacity, Image } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import ItemPictureList from '../../components/ItemPictureList';
import BellyBumpHeaderButtons from '../../components/BellyBumpHeaderButtons';
import { Dates } from '../../handlers/Dates';

import { observer } from 'mobx-react'
import pregnancyStore from '../../mobx/PregnancyStore';
import albumStore from '../../mobx/AlbumStore';
import calendarStore from '../../mobx/CalendarStore';
import SQL from '../../handlers/SQL';


const { height, width } = Dimensions.get("window");
const ORANGE_COLOR = '#F4AC32';
const APP_COLOR = '#304251';

@observer
export default class BellyBump extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openModalPic: false,
            pic: [],
            isChangePic: false,
            isLoading: false,
            isUpdatedAlbum: false,
        }
        console.log('Belly bump constructor')
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Belly bump",
            headerLeft: (
                <HeaderBackButton
                    onPress={() => handleHeaderBackButton(navigation)}
                    tintColor={'#FFF'}
                />
            ),

        };
    }

    componentDidMount = async () => {
        const user = await AsyncStorage.getItem('user')
        const userId = JSON.parse(user)
        console.log('userId', userId)
        // if()
        albumStore.getPregnancyAlbumByPregnantId(pregnancyStore.pregnant.PregnantID)
        let difference_in_days = Dates.CalculateDaysDifferenceBetweenTwoDates(pregnancyStore.pregnant.LastMenstrualPeriod)
        let week = (difference_in_days / 7) | 0;
        let w = week > 42 ? 42 : week;
        // console.log('w = ', w)
        pregnancyStore.setCurrWeek(w);
        let newArr = [];
        for (var i = 0; i < w; i++) {
            newArr.push({
                key: i + 1
            })
        }
        this.setState({ newArr })

        // console.log('pregnancyStore.pregnant=', )

    }

    componentDidUpdate = async () => {

    }

    takePicture = async (week) => {
        console.log('albumStore.getPictureInAlbum(week)=', albumStore.getPictureInAlbum(week))
        console.log('albumStore.picture=', albumStore.picture)
        console.log('week', week)
        // await this.setState({ pic: albumStore.album.filter(picture => picture.WeekID === week) });
        // console.log('this.state.pic=', this.state.pic.length)
        // user already have picture on this week
        if (albumStore.picture !== undefined) {
            this.setState({ openModalPic: true });
        }
        // no picture
        else {
            pregnancyStore.setWeek(week);
            this.props.navigation.navigate('CameraPage')
        }

    }

    handleTakePicture = async () => {
        console.log('handleTakePicture')
    }

    handleCreateVideo = async () => {
        console.log('handleCreateVideo')
    }

    changePictureInAlbum = async (week) => {
        pregnancyStore.setWeek(week);
        this.setState({ openModalPic: false })
        this.props.navigation.navigate('CameraPage')

        // let data = await SQL.UpdatePictureToPregnantAlbum(albumStore.picture.PregnantID,week,albumStore.picture.)
    }

    deletePictureFromAlbum = async (week) => {

        this.setState({ openModalPic: false })
        let data = await SQL.DeletPictureFromPregnancyAlbum(albumStore.picture.PregnantID, week)
        console.log('DeletPictureFromPregnancyAlbum=', data)
        albumStore.getPregnancyAlbumByPregnantId(pregnancyStore.pregnant.PregnantID)

    }



    renderPicUri() {
        // console.log('renderPicUri')
        const buttonsData = {
            txtLeft: `DELETE`,
            txtRight: `CHANGE`,
            iconLeft: "md-camera",
            iconRight: "md-videocam"
        }

        const style = {
            fontSize: 17,
            left: -20
        }

        return (
            <Modal
                style={{ flex: 1 }}
                animationType="slide"
                transparent={false}
                visible={this.state.openModalPic}
                onRequestClose={() => {
                    this.setState({ openModalPic: false });
                }}
            >
                <View
                    style={{
                        flex: 0.08,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        backgroundColor: "#2C3E50"
                    }}
                ></View>
                <BellyBumpHeaderButtons
                    buttons={buttonsData}
                    style={style}
                    handleLeftBtn={() => { this.deletePictureFromAlbum(albumStore.picture.WeekID) }}
                    handleRightBtn={() => { this.changePictureInAlbum(albumStore.picture.WeekID) }}
                />
                <Image source={{ uri: albumStore.picture.PictureUri }} style={{ flex: 0.9 }} />
            </Modal>
        );
    }

    render() {
        // console.log('render')
        const { newArr } = this.state

        handleHeaderBackButton = navigation => {
            this.setState({ openModalPic: false });
            // console.log('navigation=', navigation)
            navigation.navigate({
                routeName: 'Home',
            })
        }

        // console.log('this,album = ', albumStore.album)

        if (this.state.openModalPic)
            return this.renderPicUri();

        const buttonsData = {
            txtLeft: `BELLY\nPICTURE`,
            txtRight: `CREATE\nBELLY BUMP`,
            iconLeft: "md-camera",
            iconRight: "md-videocam"
        }

        return (
            <View style={{ flex: 1 }}>
                {/* header buttons row  */}
                <BellyBumpHeaderButtons
                    buttons={buttonsData}
                    handleLeftBtn={this.handleTakePicture}
                    handleRightBtn={this.handleCreateVideo}
                />

                <View style={{ flex: 0.92 }} >
                    <View style={{ width: width - 3, alignSelf: 'center', marginTop: '3%' }}>
                        {/* שימוש בקומפוננטה להצגת כל התמונות ברשימה עם אפשרות לגלילה */}
                        <ItemPictureList
                            handlePress={(week) => this.takePicture(week)}
                            album={albumStore.album}
                            week={pregnancyStore.currWeek}
                            newArr={newArr}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerButtonsStyle: { flex: 0.1, flexDirection: 'row' },
    buttonStyle: { flex: 0.5, backgroundColor: '#F4AC32', borderRightWidth: 1, borderRightColor: '#FFF', justifyContent: 'center' },
    rowDirection: { flexDirection: 'row' },
    iconViewStyle: { marginHorizontal: '7%', alignSelf: 'center' },
    txtButtonStyle: { color: "#FFF", fontWeight: 'bold', fontSize: 15 },

})