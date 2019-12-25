import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableHighlight, AsyncStorage, Modal, TouchableOpacity, Image } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { Ionicons } from "@expo/vector-icons";
import ItemPictureList from '../../components/ItemPictureList';


import { observer } from 'mobx-react'
import pregnancyStore from '../../mobx/PregnancyStore';
import albumStore from '../../mobx/AlbumStore';
import SQL from '../../handlers/SQL';

const { height, width } = Dimensions.get("window");

@observer
export default class BellyBump extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openModalPic: false,
            pic: [],
            isChangePic: false,
        }

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

    componentWillMount = async () => {
        const user = await AsyncStorage.getItem('user')
        const userId = JSON.parse(user)
        console.log('userId', userId)
        albumStore.getPregnancyAlbumByPregnantId(pregnancyStore.pregnant.PregnantID)

        // console.log('pregnancyStore.pregnant=', )

    }

    componentDidUpdate = async () => {
        albumStore.getPregnancyAlbumByPregnantId(pregnancyStore.pregnant.PregnantID)
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
    }

    renderPicUri() {
        // console.log('renderPicUri')
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
                        flex: 0.1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        backgroundColor: "#2C3E50"
                    }}
                >
                    <TouchableOpacity
                        style={{ alignSelf: "center" }}
                        onPress={() => { this.deletePictureFromAlbum(albumStore.picture.WeekID) }}
                    >
                        <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
                            Delete
            </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ alignSelf: "center" }}
                        onPress={() => { this.changePictureInAlbum(albumStore.picture.WeekID) }}
                    >
                        <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
                            Change
            </Text>
                    </TouchableOpacity>
                </View>
                <Image source={{ uri: albumStore.picture.PictureUri }} style={{ flex: 0.9 }} />
            </Modal>
        );
    }

    render() {
        // console.log('render')

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

        return (
            <View style={{ flex: 1 }}>
                {/* header buttons row  */}
                <View style={styles.headerButtonsStyle}>
                    {/* belly picture button */}
                    <TouchableHighlight
                        style={styles.buttonStyle}
                        underlayColor={'#F4AC32'}
                        activeOpacity={1}
                        onPress={(week) => this.takePicture(week)}
                    >
                        <View style={styles.rowDirection}>
                            <View style={styles.iconViewStyle}>
                                <Ionicons name="md-camera" size={30} color="#FFF" />
                            </View>
                            <Text style={styles.txtButtonStyle}>BELLY{"\n"}PICTURE</Text>
                        </View>
                    </TouchableHighlight>
                    {/* create belly bump button */}
                    <TouchableHighlight
                        style={styles.buttonStyle}
                        underlayColor={'#F4AC32'}
                        activeOpacity={1}
                        onPress={() => this.createBellyBump}
                    >
                        <View style={styles.rowDirection}>
                            <View style={styles.iconViewStyle}>
                                <Ionicons name="md-videocam" size={30} color="#FFF" />
                            </View>
                            <Text style={styles.txtButtonStyle}>CREATE{"\n"}BELLY BUMP</Text>
                        </View>
                    </TouchableHighlight>
                </View>

                <View style={{ flex: 0.9 }} >
                    <View style={{ width: width - 3, alignSelf: 'center', marginTop: '3%' }}>
                        {/* שימוש בקומפוננטה להצגת כל התמונות ברשימה עם אפשרות לגלילה */}
                        <ItemPictureList handlePress={(week) => this.takePicture(week)} album={albumStore.album} />
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