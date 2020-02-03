import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, Modal, Dimensions, TouchableOpacity, ImageBackground, BackHandler } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { Ionicons } from "@expo/vector-icons";
import ItemPictureList from '../../components/ItemPictureList';
import BellyBumpHeaderButtons from '../../components/BellyBumpHeaderButtons';
import { Dates } from '../../handlers/Dates';
import SQL from '../../handlers/SQL';
import { NavigationActions } from 'react-navigation';


import { observer } from 'mobx-react'
import pregnancyStore from '../../mobx/PregnancyStore';
import albumStore from '../../mobx/AlbumStore';
import userStore from '../../mobx/UserStore';


const { height, width } = Dimensions.get("window");
const ORANGE_COLOR = '#F4AC32';
const APP_COLOR = '#304251';

@observer
export default class BellyBump extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openModalPic: false,
            album: null,
            picture: null,
            isChangePic: false,
            isLoading: false,
            isUpdatedAlbum: false,
            isCameraPage: false,
            visible: false,
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
        console.log('did mounth BellyBump')
        console.log('currweek-', pregnancyStore.currWeek)
        console.log('userId', userStore.id)
        console.log('pregnant id=', pregnancyStore.id)
        let album = await SQL.GetPregnancyAlbumByPregnantId(pregnancyStore.id)

        let newArr = [];
        for (var i = 0; i < pregnancyStore.currWeek; i++) {
            newArr.push({
                key: i + 1
            })
        }
        this.setState({ newArr, album })

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
    }


    componentDidUpdate = async () => {
        console.log('did updatre BellyBump', this.props.navigation.state.params)

    }
    componentWillUnmount = () => {
        console.log('will unmpunth bellybump')

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);

    }
    handleBackButton = () => {
        this.props.navigation.goBack();
    }

    takePicture = async (week) => {
        const { album } = this.state;
        let picture = album.filter(p => p.WeekID === week)[0]
        console.log('picture=', picture)

        // user already have picture on this week
        if (picture !== undefined) {
            albumStore.setWeek(week)
            this.setState({ openModalPic: true, picture });
        }
        // no picture
        else {
            albumStore.setWeek(week);
            await this.props.navigation.navigate('CameraPage')
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
        const { picture } = this.state;
        Alert.alert(
            'Confirm delete',
            'Are you sure you want to delete this photo?',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        let data = await SQL.DeletPictureFromPregnancyAlbum(picture.PregnantID, week)
                        // console.log('DeletPictureFromPregnancyAlbum=', data)

                        let album = await SQL.GetPregnancyAlbumByPregnantId(picture.PregnantID)
                        this.setState({ openModalPic: false, album })
                    }
                },
            ],
        )
    }

    renderPicUri() {
        const { picture } = this.state;


        // console.log('albumStore.week=', albumStore.week)
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
                    style={styles.headerForModalDelete}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ openModalPic: false })
                        }}
                    >
                        <Ionicons name="md-arrow-back" color="#FFF" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.deletePictureFromAlbum(albumStore.week)}
                    >
                        <Ionicons name="md-trash" color="#FFF" size={25} />
                    </TouchableOpacity>
                </View>
                <View style={styles.darkBackground}></View>
                <ImageBackground
                    source={{ uri: picture.PictureUri }}
                    style={{ flex: 0.63 }}
                    imageStyle={{ resizeMode: 'stretch' }}
                />
                <View style={styles.darkBackground}></View>
            </Modal>
        );
    }



    render() {
        // console.log('render')
        const { newArr, album } = this.state

        handleHeaderBackButton = navigation => {
            this.setState({ openModalPic: false });
            navigation.navigate({
                routeName: 'Home',
            })
        }


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
                            album={album}
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
    darkBackground: { flex: 0.15, backgroundColor: '#2e2e2e' },
    headerForModalDelete: { flex: 0.07, backgroundColor: '#141414', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingRight: 15, paddingLeft: 15 }
})