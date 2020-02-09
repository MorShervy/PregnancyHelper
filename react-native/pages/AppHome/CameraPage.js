import React, { Component } from "react";
import { Camera } from 'expo-camera';
import * as Permissions from "expo-permissions";
import * as MediaLibrary from 'expo-media-library';
import Constants from "expo-constants";

import { StyleSheet, BackHandler, Text, View, TouchableOpacity, ImageBackground, Platform, Modal, Image, Dimensions, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import SQL from "../../handlers/SQL";



import { observer } from 'mobx-react'
import pregnancyStore from '../../mobx/PregnancyStore';
import userStore from '../../mobx/UserStore';
import albumStore from '../../mobx/AlbumStore';


const { height, width } = Dimensions.get("window");
const landmarkSize = 2;
const ORANGE_COLOR = '#F4AC32';
const APP_COLOR = '#304251';

const flashModeOrder = {
    off: "on",
    on: "auto",
    auto: "torch",
    torch: "off"
};

const flashIcons = {
    off: "flash-off",
    on: "flash-on",
    auto: "flash-auto",
    torch: "highlight"
};

const wbOrder = {
    auto: "sunny",
    sunny: "cloudy",
    cloudy: "shadow",
    shadow: "fluorescent",
    fluorescent: "incandescent",
    incandescent: "auto"
};

const wbIcons = {
    auto: "wb-auto",
    sunny: "wb-sunny",
    cloudy: "wb-cloudy",
    shadow: "beach-access",
    fluorescent: "wb-iridescent",
    incandescent: "wb-incandescent"
};

@observer
export default class CameraPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flash: "off",
            zoom: 0,
            autoFocus: "on",
            type: "back",
            whiteBalance: "auto",
            ratio: "16:9",
            ratios: [],
            newPhotos: false,

            pictureSize: undefined,
            pictureSizes: [],
            pictureSizeId: 0,
            showMoreOptions: false,
            openModalPic: false,
            picUri: "",
            user: null,
            isLoading: false,
        };

        console.log('camera constractor')
        // static navigationOptions = {
        //     header: null,
        // };
    }
    static navigationOptions = {
        header: null,
    };

    componentDidMount = async () => {
        // const { status } = await Permissions.askAsync(Permissions.CAMERA);
        // this.setState({ permissionsGranted: status === "granted" });

        console.log(pregnancyStore.id)

        // adding the event listener for back button android
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount = () => {
        console.log('will unmpunth cameraPage')
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = async () => {
        // console.log(this.props.navigation)
        this.props.handleBack()
        // const navigateAction = NavigationActions.navigate({
        //     routeName: 'BellyBumpScreen',
        //     params: { isCameraPage: false },
        //     action: NavigationActions.navigate({ routeName: 'BellyBump' }),
        // });

        // await this.props.navigation.dispatch(navigateAction);
    }

    handleSavePicture = async () => {
        const { picUri } = this.state
        this.setState({ isLoading: true });
        // console.log('pregnantid=', pregnancyStore.id)
        // console.log('user id=', userStore.id)
        // console.log('album week=', albumStore.week)
        // console.log('picUri=', picUri)

        let data = await SQL.InsertPictureToPregnantAlbum(pregnancyStore.id, albumStore.week, picUri)
        console.log('data2=', data)

        // picture name to save on server
        // let picName = `${userStore.user.ID}${pregnancyStore.pregnant.PregnantID}${pregnancyStore.week}`;

        // console.log('imgName=', picName)
        // console.log('picUri', picUri)

        // save picture in filesystem on the phone at DCIM
        console.log('permissionsGrantedCameraRoll=', this.state.permissionsGrantedCameraRoll)
        if (this.state.permissionsGrantedCameraRoll) {
            const asset = await MediaLibrary.createAssetAsync(picUri);
        }

        this.setState({ isLoading: false, openModalPic: false });
        // this.props.navigation.navigate('BellyBumpScreen');
        this.props.handleBackWithRefresh()


        // SQL.UploadPicture(picUri, picName)

    };

    takePicture = async () => {
        console.log('take picture async')
        //not here for sure


        if (this.camera) {
            let photo = await this.camera.takePictureAsync({ quality: 1 });
            //.then(console.log("pic=", this.onPictureSaved)); //this.props.navigation.goBack()
            console.log("photo=", photo);
            this.setState({ picUri: photo.uri, openModalPic: true });
        }
    };

    toggleFacing = () =>
        this.setState({ type: this.state.type === "back" ? "front" : "back" });

    toggleFlash = () =>
        this.setState({ flash: flashModeOrder[this.state.flash] });

    setRatio = ratio => this.setState({ ratio });

    toggleWB = () =>
        this.setState({ whiteBalance: wbOrder[this.state.whiteBalance] });

    toggleFocus = () =>
        this.setState({ autoFocus: this.state.autoFocus === "on" ? "off" : "on" });

    zoomOut = () =>
        this.setState({
            zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1
        });

    zoomIn = () =>
        this.setState({
            zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1
        });

    toggleMoreOptions = () =>
        this.setState({ showMoreOptions: !this.state.showMoreOptions });



    handleMountError = ({ message }) => console.error(message);

    collectPictureSizes = async () => {
        if (this.camera) {
            const pictureSizes = await this.camera.getAvailablePictureSizesAsync(
                this.state.ratio
            );
            let pictureSizeId = 0;
            if (Platform.OS === "ios") {
                pictureSizeId = pictureSizes.indexOf("High");
            } else {
                // returned array is sorted in ascending order - default size is the largest one
                pictureSizeId = pictureSizes.length - 1;
            }
            this.setState({
                pictureSizes,
                pictureSizeId,
                pictureSize: pictureSizes[pictureSizeId]
            });
        }
    };

    previousPictureSize = () => this.changePictureSize(1);
    nextPictureSize = () => this.changePictureSize(-1);

    changePictureSize = direction => {
        let newId = this.state.pictureSizeId + direction;
        const length = this.state.pictureSizes.length;
        if (newId >= length) {
            newId = 0;
        } else if (newId < 0) {
            newId = length - 1;
        }
        this.setState({
            pictureSize: this.state.pictureSizes[newId],
            pictureSizeId: newId
        });
    };



    renderPicUri() {
        const buttonData = {
            txtLeft: `CANCEL`,
            txtRight: `SAVE`,
            iconLeft: "md-close",
            iconRight: "md-save",

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
                visible={this.state.openModal}
                onRequestClose={() => {
                    this.setState({ openModalPic: false });
                }}
            >
                <View
                    style={styles.headerForModalSave}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ openModalPic: false })
                        }}
                    >
                        <Ionicons name="md-arrow-back" color="#FFF" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.handleSavePicture}
                    >
                        <Ionicons name="md-save" color="#FFF" size={25} />
                    </TouchableOpacity>
                </View>
                <View style={styles.darkBackground}></View>
                <ImageBackground
                    source={{ uri: this.state.picUri }}
                    style={{ flex: 0.73 }}
                    imageStyle={{ resizeMode: 'stretch' }}
                />
                <View style={styles.darkBackground}></View>
            </Modal>
        );
    }

    renderNoPermissions = () => (
        <View style={styles.noPermissions}>
            <Text style={{ color: "white" }}>
                Camera permissions not granted - cannot open camera preview.
      </Text>
        </View>
    );

    renderTopBar = () => (
        <View style={styles.topBar}>
            <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFlash}>
                <MaterialIcons
                    name={flashIcons[this.state.flash]}
                    size={32}
                    color="white"
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleButton} onPress={this.toggleWB}>
                <MaterialIcons
                    name={wbIcons[this.state.whiteBalance]}
                    size={32}
                    color="white"
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFocus}>
                <Text
                    style={[
                        styles.autoFocusLabel,
                        { color: this.state.autoFocus === "on" ? "white" : "#6b6b6b" }
                    ]}
                >
                    AF
        </Text>
            </TouchableOpacity>
        </View>
    );

    renderBottomBar = () => (
        <View style={styles.bottomBar}>
            <TouchableOpacity
                style={styles.bottomButton}
                onPress={this.toggleMoreOptions}
            >
                <Octicons name="kebab-horizontal" size={30} color="white" />
            </TouchableOpacity>

            <View style={{ flex: 0.4 }}>
                <TouchableOpacity
                    onPress={this.takePicture}
                    style={{ alignSelf: "center" }}
                >
                    <Ionicons name="ios-radio-button-on" size={70} color="white" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.bottomButton} onPress={this.toggleFacing}>
                <Ionicons name="ios-reverse-camera" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );

    renderMoreOptions = () => (
        <View style={styles.options}>
            <View style={styles.pictureSizeContainer}>
                <Text style={styles.pictureQualityLabel}>Picture quality</Text>
                <View style={styles.pictureSizeChooser}>
                    <TouchableOpacity
                        onPress={this.previousPictureSize}
                        style={{ padding: 6 }}
                    >
                        <Ionicons name="md-arrow-dropleft" size={14} color="white" />
                    </TouchableOpacity>
                    <View style={styles.pictureSizeLabel}>
                        <Text style={{ color: "white" }}>{this.state.pictureSize}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={this.nextPictureSize}
                        style={{ padding: 6 }}
                    >
                        <Ionicons name="md-arrow-dropright" size={14} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    renderCamera = () => (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            {this.renderTopBar()}
            <Camera
                ref={ref => {
                    this.camera = ref;
                }}
                style={styles.camera}
                onCameraReady={this.collectPictureSizes}
                type={this.state.type}
                flashMode={this.state.flash}
                autoFocus={this.state.autoFocus}
                zoom={this.state.zoom}
                whiteBalance={this.state.whiteBalance}
                ratio={this.state.ratio}
                pictureSize={this.state.pictureSize}
                onMountError={this.handleMountError}
            >
            </Camera>
            {this.renderBottomBar()}
            {this.state.showMoreOptions && this.renderMoreOptions()}
        </View>
    );

    render() {
        const cameraScreenContent = this.props.permissionsGrantedCamera
            ? this.renderCamera()
            : this.renderNoPermissions();
        const content = this.state.openModalPic
            ? this.renderPicUri()
            : cameraScreenContent;
        return <Modal
            style={styles.container}
            animationType="slide"
            transparent={false}
            onRequestClose={() => {
                this.props.handleBack();
            }}
        >
            {content}
        </Modal>;
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 0.80, justifyContent: "space-between" },
    topBar: { flex: 0.1, backgroundColor: "transparent", flexDirection: "row", justifyContent: "space-around", paddingTop: Constants.statusBarHeight },
    bottomBar: { flex: 0.1, backgroundColor: "transparent", alignSelf: "flex-end", justifyContent: "space-between", flexDirection: "row", paddingTop: Constants.statusBarHeight / 2 },
    bottomButton: { flex: 0.3, height: 58, justifyContent: "center", alignItems: "center" },
    noPermissions: { flex: 1, alignItems: "center", justifyContent: "center", padding: 10 },
    toggleButton: { flex: 0.25, height: 40, marginHorizontal: 2, marginBottom: 10, marginTop: 20, padding: 5, alignItems: "center", justifyContent: "center" },
    autoFocusLabel: { fontSize: 20, fontWeight: "bold" },
    options: { position: "absolute", bottom: 100, left: 30, width: 200, height: 100, backgroundColor: "#000000BA", borderRadius: 4, padding: 10 },
    pictureQualityLabel: { fontSize: 10, marginVertical: 3, color: "white" },
    pictureSizeContainer: { flex: 0.5, alignItems: "center", paddingTop: 10 },
    pictureSizeChooser: { alignItems: "center", justifyContent: "space-between", flexDirection: "row" },
    pictureSizeLabel: { flex: 1, alignItems: "center", justifyContent: "center" },
    row: { flexDirection: "row" },
    darkBackground: { flex: 0.1, backgroundColor: '#000' },
    headerForModalSave: { flex: 0.07, backgroundColor: '#141414', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingRight: 15, paddingLeft: 15 }
});
