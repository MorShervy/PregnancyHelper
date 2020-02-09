import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, Modal, Dimensions, TouchableOpacity, ImageBackground, BackHandler } from 'react-native';
import * as Permissions from "expo-permissions";
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { HeaderBackButton } from 'react-navigation-stack';
import { Ionicons } from "@expo/vector-icons";
import ItemPictureList from '../../components/ItemPictureList';
import BellyBumpHeaderButtons from '../../components/BellyBumpHeaderButtons';
import { Dates } from '../../handlers/Dates';
import SQL from '../../handlers/SQL';
import { NavigationActions } from 'react-navigation';
import CostumAlertComponent from '../../components/CostumAlertComponent';

import { observer } from 'mobx-react'
import pregnancyStore from '../../mobx/PregnancyStore';
import albumStore from '../../mobx/AlbumStore';
import userStore from '../../mobx/UserStore';
import CameraPage from './CameraPage';


const { height, width, fontScale } = Dimensions.get("window");
const ORANGE_COLOR = '#F4AC32';
const APP_COLOR = '#304251';
const DARKBLUE_COLOR = '#1B1B3A';
const buttonsData = {
    txtLeft: `BELLY\nPICTURE`,
    txtRight: `CREATE\nBELLY BUMP`,
    iconLeft: "md-camera",
    iconRight: "md-videocam"
}


@observer
export default class BellyBump extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openModalPic: false,
            openCamera: false,
            album: null,
            picture: null,
            isChangePic: false,
            isLoading: false,
            isUpdatedAlbum: false,
            isCameraPage: false,
            visible: false,
            permissionsGrantedCamera: false,
            permissionsGrantedCameraRoll: false,
            displayAlert: false,
        }
        console.log('Belly bump constructor')
    }

    static navigationOptions = ({ navigation }) => {
        return {
            // header: navigation.state.params !== undefined ? navigation.state.params.header : undefined,
            headerTitle: "Belly bump",
            headerLeft: (
                <HeaderBackButton
                    onPress={() => {
                        const navigateAction = NavigationActions.navigate({
                            routeName: 'Home',
                            action: NavigationActions.navigate({ routeName: 'Tools' }),
                        });

                        navigation.dispatch(navigateAction);
                    }}
                    tintColor={'#FFF'}
                />
            ),

        };
    }

    componentDidMount = async () => {
        this.getCameraPermissionAsync()
        let album = await SQL.GetPregnancyAlbumByPregnantId(pregnancyStore.id)
        console.log('album================', typeof (album))
        // console.log('pregn=bellybump=', pregnancyStore.currWeek)
        let newArr = [];
        for (var i = 0; i < pregnancyStore.currWeek; i++) {
            newArr.push({
                key: i + 1
            })
        }
        this.setState({ newArr, album })

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
    }


    getCameraPermissionAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ permissionsGrantedCamera: status === "granted" });
    }

    componentDidUpdate = async () => {
        console.log('did updatre BellyBump', this.props.navigation.state.params)

    }
    componentWillUnmount = () => {
        console.log('will unmpunth bellybump')

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);

    }
    handleBackButton = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'Home',
            action: NavigationActions.navigate({ routeName: 'Tools' }),
        });

        this.props.navigation.dispatch(navigateAction);
    }

    takePicture = async (week) => {
        const { album } = this.state;

        let picture;
        if (typeof (album) === "object")
            picture = album.filter(p => p.WeekID === week)[0]
        console.log('picture=', picture)

        // user already have picture on this week
        if (picture !== undefined) {
            albumStore.setWeek(week)
            this.setState({ openModalPic: true, picture });
        }
        // no picture
        else {
            albumStore.setWeek(week);
            // await this.props.navigation.navigate('CameraPageScreen')
            this.setState({ displayAlert: true })
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

    handleBackCamera = async () => {
        this.setState({ openCamera: false })

    }

    handleBackWithRefresh = async () => {
        let album = await SQL.GetPregnancyAlbumByPregnantId(pregnancyStore.id)
        this.setState({ openCamera: false, album })
    }

    handleAddPhoto = async (key) => {
        // CAMERA key eqaul to 0
        // GALLERY key equal to 1
        // console.log('key ley key key=', key)
        if (key === 0) {
            let result = await ImagePicker.launchCameraAsync({
                // mediaTypes: 'Image',
                // allowsEditing: true,
                // aspect: [1,1],
                quality: 1
            })

            if (!result.cancelled) {
                this.setState({ picUri: result.uri },
                    () => this.handleSavePicture()
                )
            }
            this.setState({ displayAlert: false })
        }
        else {
            let result = await ImagePicker.launchImageLibraryAsync({
                // mediaTypes: 'Images',
                quality: 1,
            })

            if (!result.cancelled) {
                this.setState({ picUri: result.uri },
                    () => this.handleSavePicture()
                )
            }
            this.setState({ displayAlert: false })
        }

    }

    handleSavePicture = async () => {
        const { picUri } = this.state
        let data = await SQL.InsertPictureToPregnantAlbum(pregnancyStore.id, albumStore.week, picUri)
        console.log('data2=', data)
        console.log('permissionsGrantedCameraRoll=', this.state.permissionsGrantedCameraRoll)
        if (this.state.permissionsGrantedCameraRoll) {
            const asset = await MediaLibrary.createAssetAsync(picUri);
        }
        this.handleBackWithRefresh()
    }

    handleCloseAlert = () => {
        this.setState({ displayAlert: false, })
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
        const { newArr, album, openCamera, openModalPic, permissionsGrantedCamera, displayAlert } = this.state

        if (openModalPic)
            return this.renderPicUri();

        if (openCamera)
            return <CameraPage
                permissionsGrantedCamera={permissionsGrantedCamera}
                handleBack={this.handleBackCamera}
                handleBackWithRefresh={this.handleBackWithRefresh}
            />



        return (
            <View style={{ flex: 1 }}>
                <CostumAlertComponent
                    displayAlert={displayAlert}
                    header={'Add Photo'}
                    buttons={[{ key: 0, text: 'From Camera' }, { key: 1, text: 'From Gallery' }]}
                    handleButtonClick={key => this.handleAddPhoto(key)}
                    handleCloseAlert={this.handleCloseAlert}
                    style={'23%'}
                />
                {/* header buttons row  */}
                {/* <BellyBumpHeaderButtons
                    buttons={buttonsData}
                    handleLeftBtn={this.handleTakePicture}
                    handleRightBtn={this.handleCreateVideo}
                /> */}

                <View style={{ flex: 0.9 }} >
                    <View style={{ width: width - 3, alignSelf: 'center', paddingTop: 5 }}>
                        <Text style={{ color: ORANGE_COLOR, fontSize: 14 * fontScale, fontWeight: '500', textAlign: 'center', paddingVertical: 5 }}>Take Your Weekly Belly Photo</Text>
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