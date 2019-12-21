import React, { Component } from "react";
import { Camera } from 'expo-camera';
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

import { StyleSheet, Text, View, TouchableOpacity, Slider, Platform, Modal, Image, Dimensions, AsyncStorage } from "react-native";
import { Ionicons, MaterialIcons, Foundation, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import SQL from "../../handlers/SQL";
import { StackActions, NavigationActions } from "react-navigation";

import { observer } from 'mobx-react'
import pregnancyStore from '../../mobx/PregnancyStore';
import userStore from '../../mobx/UserStore';


const { height, width } = Dimensions.get("window");
const landmarkSize = 2;

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
    state = {
        flash: "off",
        zoom: 0,
        autoFocus: "on",
        type: "back",
        whiteBalance: "auto",
        ratio: "16:9",
        ratios: [],
        newPhotos: false,
        permissionsGranted: false,
        pictureSize: undefined,
        pictureSizes: [],
        pictureSizeId: 0,
        showMoreOptions: false,
        openModalPic: false,
        picUri: "",
        user: null
    };

    static navigationOptions = {
        header: null,
    };

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ permissionsGranted: status === "granted" });

        //remove because using mobx
        // AsyncStorage.getItem("user").then(user => {
        //     this.setState({ user: JSON.parse(user) });
        // });
        // console.log('p id=', pregnancyStore.pregnant.PregnantID)
    }

    btnUploadPictureFromCamera = async () => {
        // console.log('pregnantid=', pregnancyStore.pregnant.PregnantID)
        // console.log('week id=', pregnancyStore.week)
        // console.log('user id=', userStore.user.ID)
        // console.log('picUri=', this.state.picUri)

        let picName = `${userStore.user.ID}${pregnancyStore.pregnant.PregnantID}${pregnancyStore.week}`;
        let { picUri } = this.state

        console.log('imgName=', picName)
        console.log('picUri', picUri)
        SQL.UploadPicture(picUri, picName)

        // SQL.UpdateUserPicture(email, photoUrl).then(res => {
        //     //console.log(res);
        // });
        // await SQL.ImgUpload(photoUrl, imgName);
        // AsyncStorage.setItem(
        //     "user",
        //     JSON.stringify({ email: email, url: photoUrl })
        // );
        // this.setState({ openModalPic: false }, () => {
        //     const replaceAction = StackActions.replace({
        //         routeName: "HomeNav",
        //         action: NavigationActions.navigate("HomeNav")
        //     });
        //     this.props.navigation.dispatch(replaceAction);
        // });
    };

    takePicture = async () => {
        if (this.camera) {
            let photo = await this.camera.takePictureAsync({ quality: 0.7 });
            //.then(console.log("pic=", this.onPictureSaved)); //this.props.navigation.goBack()
            // console.log("photo=", photo);
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
                    style={{
                        flex: 0.1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        backgroundColor: "#2C3E50"
                    }}
                >
                    <TouchableOpacity
                        style={{ alignSelf: "center" }}
                        onPress={() => this.setState({ openModalPic: false })}
                    >
                        <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
                            Cancel
            </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ alignSelf: "center" }}
                        onPress={this.btnUploadPictureFromCamera}
                    >
                        <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
                            Save
            </Text>
                    </TouchableOpacity>
                </View>
                <Image source={{ uri: this.state.picUri }} style={{ flex: 0.9 }} />
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
        <View style={{ flex: 1 }}>
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
                {this.renderTopBar()}
                {this.renderBottomBar()}
            </Camera>
            {this.state.showMoreOptions && this.renderMoreOptions()}
        </View>
    );

    render() {
        const cameraScreenContent = this.state.permissionsGranted
            ? this.renderCamera()
            : this.renderNoPermissions();
        const content = this.state.openModalPic
            ? this.renderPicUri()
            : cameraScreenContent;
        return <View style={styles.container}>{content}</View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
    camera: {
        flex: 1,
        justifyContent: "space-between"
    },
    topBar: {
        flex: 0.2,
        backgroundColor: "transparent",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: Constants.statusBarHeight / 2
    },
    bottomBar: {
        // paddingBottom: isIPhoneX ? 25 : 5,
        backgroundColor: "transparent",
        alignSelf: "flex-end",
        justifyContent: "space-between",
        flex: 0.12,
        flexDirection: "row"
    },
    bottomButton: {
        flex: 0.3,
        height: 58,
        justifyContent: "center",
        alignItems: "center"
    },
    noPermissions: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },
    toggleButton: {
        flex: 0.25,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 20,
        padding: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    autoFocusLabel: {
        fontSize: 20,
        fontWeight: "bold"
    },
    options: {
        position: "absolute",
        bottom: 80,
        left: 30,
        width: 200,
        height: 100,
        backgroundColor: "#000000BA",
        borderRadius: 4,
        padding: 10
    },
    pictureQualityLabel: {
        fontSize: 10,
        marginVertical: 3,
        color: "white"
    },
    pictureSizeContainer: {
        flex: 0.5,
        alignItems: "center",
        paddingTop: 10
    },
    pictureSizeChooser: {
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row"
    },
    pictureSizeLabel: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    row: {
        flexDirection: "row"
    }
});
