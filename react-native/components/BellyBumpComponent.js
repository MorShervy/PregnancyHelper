import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, View, Text, Alert, ImageBackground, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from "@expo/vector-icons";
import ItemPictureList from './ItemPictureList';
import CostumAlertComponent from './CostumAlertComponent';
import SQL from '../handlers/SQL';

const { height, width, fontScale } = Dimensions.get("window");
const ORANGE_COLOR = '#F4AC32';
const APP_COLOR = '#304251';

export default function BellyBumpComponent(props) {

    const [weekArray, setWeekArray] = useState(null)
    const [image, setImage] = useState(null)
    const [album, setAlbum] = useState(null)
    const [picture, setPicture] = useState(null)
    const [displayPhoto, setDisplayPhoto] = useState(false)
    const [displayAddPhoto, setDisplayAddPhoto] = useState(false)
    const [loading, setLoading] = useState(true)
    const [close, setClose] = useState(false)

    useEffect(() => {
        getPregnancyAlbumAsnyc()
        createDynamicArrayByCurrWeek()

        const interval = setTimeout(() => {
            setLoading(false)
        }, 1000);
        return () => clearInterval(interval);
    }, [])

    useEffect(() => {

        if (loading && close) {
            setClose(false)
        }
        else if (!loading) {
            setClose(false);
            props.handleCloseBellyBump()
        }
    }, [close])

    useEffect(() => {
        if (image === null)
            return;

        handleSavePicture();

    }, [image])

    const getPregnancyAlbumAsnyc = async () => {
        let sqlRes = await SQL.GetPregnancyAlbumByPregnantId(props.pregnancyStore.id)
        // console.log('album================', sqlRes)
        setAlbum([...sqlRes])
    }

    const createDynamicArrayByCurrWeek = () => {
        let newArr = [];
        for (var i = 0; i < props.pregnancyStore.currWeek; i++) {
            newArr.push({ key: i + 1 })
        }
        setWeekArray(newArr)
    }

    const deletePhotoFromAlbum = async (week) => {
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
                        let data = await SQL.DeletPictureFromPregnancyAlbum(props.pregnancyStore.id, week)
                        console.log('DeletPictureFromPregnancyAlbum=', data)
                        getPregnancyAlbumAsnyc()
                        setDisplayPhoto(false)
                    }
                },
            ],
        )
    }

    const takePicture = (week) => {
        let p;
        if (typeof (album) === "object")
            p = album.filter(p => p.WeekID === week)[0]
        console.log('picture=', p)

        // user already have picture on this week
        if (p !== undefined) {
            props.setWeek(week)
            setDisplayPhoto(true)
            setPicture(p)

        }
        // no picture
        else {
            props.setWeek(week)
            setDisplayAddPhoto(true)

        }

    }

    const handleAddPhoto = async (key) => {
        setDisplayAddPhoto(false)
        // CAMERA key eqaul to 0
        // GALLERY key equal to 1
        // console.log('key ley key key=', key)
        if (key === 0) {
            let result = await ImagePicker.launchCameraAsync({ quality: 1 })
            if (!result.cancelled) {
                setImage(result)
            }
        }
        else {
            let result = await ImagePicker.launchImageLibraryAsync({ quality: 1 })
            if (!result.cancelled) {
                setImage(result)
            }
        }
    }

    const handleSavePicture = async () => {
        console.log('uri=', image.uri)
        let data = await SQL.InsertPictureToPregnantAlbum(props.pregnancyStore.id, props.albumStore.week, image.uri)
        console.log('data2=', data)
        await MediaLibrary.createAssetAsync(image.uri);
        // let picName = `${userStore.id}${pregnancyStore.id}${pregnancyStore.week}`;
        // SQL.UploadPicture(picUri, picName)
        getPregnancyAlbumAsnyc()
    }

    const renderPhoto = () => (
        <Modal
            visible={displayPhoto}
            transparent={false}
            animationType={"slide"}
            onRequestClose={() => setDisplayPhoto(false)}
        >
            <View style={styles.headerForModalDelete}>
                <TouchableOpacity onPress={() => setDisplayPhoto(false)}>
                    <Ionicons name="md-arrow-back" color="#FFF" size={25} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deletePhotoFromAlbum(props.albumStore.week)}>
                    <Ionicons name="md-trash" color="#FFF" size={25} />
                </TouchableOpacity>
            </View>
            <View style={styles.darkBackground}></View>
            <ImageBackground
                source={{ uri: picture.PictureUri }}
                style={{ flex: 0.63 }}
                imageStyle={{ resizeMode: 'cover' }}
            />
            <View style={styles.darkBackground}></View>
        </Modal>
    )


    const renderHeader = () => (
        <View style={styles.headerForModal}>
            <View style={{ flex: 0.2 }}>
                <TouchableOpacity
                    style={{ paddingHorizontal: 20 }}
                    onPress={() => setClose(true)}
                >
                    <Ionicons name="md-arrow-back" color="#FFF" size={28} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Text style={styles.txtHeader}>Belly Bump</Text>
            </View>
        </View>
    )

    return (
        <Modal
            visible={props.displayComponent}
            transparent={false}
            animationType={"slide"}
            onRequestClose={() => setClose(true)}
        >
            <CostumAlertComponent
                displayAlert={displayAddPhoto}
                header={'Add Photo'}
                buttons={[{ key: 0, text: 'From Camera' }, { key: 1, text: 'From Gallery' }]}
                handleButtonClick={key => handleAddPhoto(key)}
                handleCloseAlert={() => setDisplayAddPhoto(false)}
                style={'23%'}
            />

            {
                loading &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading...</Text>
                    <ActivityIndicator
                        style={{ alignItems: 'center', justifyContent: 'center' }}
                        color={APP_COLOR}
                        size={30} />
                </View>
            }
            {
                displayPhoto &&
                renderPhoto()
            }
            {
                !loading &&
                <View style={{ flex: 1 }}>
                    {renderHeader()}
                    <View style={{ flex: 0.9 }} >
                        <View style={{ width: width - 3, alignSelf: 'center', paddingVertical: 4 }}>
                            <Text style={{ color: ORANGE_COLOR, fontSize: 14 * fontScale, fontWeight: '500', textAlign: 'center', paddingVertical: 5 }}>Take Your Weekly Belly Photo</Text>
                            {/* שימוש בקומפוננטה להצגת כל התמונות ברשימה עם אפשרות לגלילה */}
                            <ItemPictureList
                                handlePress={(week) => takePicture(week)}
                                album={album}
                                newArr={weekArray}
                            />
                        </View>
                    </View>
                </View>
            }

        </Modal>
    )

}

const styles = StyleSheet.create({
    headerButtonsStyle: { flex: 0.1, flexDirection: 'row' },
    buttonStyle: { flex: 0.5, backgroundColor: '#F4AC32', borderRightWidth: 1, borderRightColor: '#FFF', justifyContent: 'center' },
    rowDirection: { flexDirection: 'row' },
    iconViewStyle: { marginHorizontal: '7%', alignSelf: 'center' },
    txtButtonStyle: { color: "#FFF", fontWeight: 'bold', fontSize: 15 },
    darkBackground: { flex: 0.15, backgroundColor: '#2e2e2e' },
    headerForModalDelete: { flex: 0.07, backgroundColor: '#141414', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingRight: 15, paddingLeft: 15 },
    headerForModal: {
        flex: 0.08,
        backgroundColor: APP_COLOR,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 3
    },
    txtHeader: {
        color: '#FFF',
        fontSize: 12 * fontScale,
        fontWeight: '500'
    },
})