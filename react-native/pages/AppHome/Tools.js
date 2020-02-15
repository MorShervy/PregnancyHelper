import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import * as Permissions from 'expo-permissions';
import ItemToolList from '../../components/ItemToolList';
import { observer } from 'mobx-react'
import permissionStore from '../../mobx/PermissionStore';
import pregnancyStore from '../../mobx/PregnancyStore'
import albumStore from '../../mobx/AlbumStore';
import userStore from '../../mobx/UserStore';

import DueDateCalculatorComponent from '../../components/DueDateCalculatorComponent';
import HospitalComponent from '../../components/HospitalComponent';
import KickTrackerComponent from '../../components/KickTrackerComponent';
import BellyBumpComponent from '../../components/BellyBumpComponent';
import ContractionTimerComponent from "../../components/ContractionTimerComponent";

const { height, width, fontScale } = Dimensions.get("window");

const GREY_COLOR = '#8e8e8e';

@observer
class Tools extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayDueDate: false,
            displayHospital: false,
            displayKickTracker: false,
            displayBellyBump: false,
            displayContractionTimer: false,
        }
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

    handlePrees = (item) => {
        const { navigation } = this.props;
        console.log('item=', item)
        if (item.key === 1)
            this.setState({ displayKickTracker: true })
        else if (item.key === 2) {
            if (permissionStore.camera && permissionStore.cameraRoll)
                this.setState({ displayBellyBump: true })
            else if (!permissionStore.camera)
                this.GetPermissionCameraAsync()
            else
                this.GetPermissionCameraRollAsync()
        }
        else if (item.key === 3)
            this.setState({ displayContractionTimer: true })
        else if (item.key === 4)
            this.setState({ displayDueDate: true })
        else if (item.key === 5) {
            if (permissionStore.location)
                this.setState({ displayHospital: true })
            else
                this.GetPermissionLocationAsync()
        }


    }

    GetPermissionLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        console.log('status=', status)
        if (status === 'granted')
            permissionStore.setLocation(true)
    }

    GetPermissionCameraAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        console.log('status=', status)
        permissionStore.setCamera(status === 'granted')
    }

    GetPermissionCameraRollAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        console.log('status=', status)
        permissionStore.setCameraRoll(status === 'granted')
    }

    render() {
        const { displayDueDate, displayHospital, displayKickTracker, displayBellyBump, displayContractionTimer } = this.state;
        console.log('tools render')
        return (
            <View style={styles.page} >
                {
                    displayContractionTimer &&
                    <ContractionTimerComponent
                        displayComponent={displayContractionTimer}
                        userStore={{ id: userStore.id }}
                        handleCloseContractionTimer={() => this.setState({ displayContractionTimer: false })}

                    />
                }
                {
                    displayBellyBump &&
                    <BellyBumpComponent
                        displayComponent={displayBellyBump}
                        pregnancyStore={{ id: pregnancyStore.id, currWeek: pregnancyStore.currWeek, week: pregnancyStore.week }}
                        albumStore={{ week: albumStore.week }}
                        userStore={userStore.id}
                        handleCloseBellyBump={() => this.setState({ displayBellyBump: false })}
                        setWeek={(w) => albumStore.setWeek(w)}
                    />

                }
                {
                    displayKickTracker &&
                    <KickTrackerComponent
                        displayComponent={displayKickTracker}
                        handleCloseKickTracker={() => this.setState({ displayKickTracker: false })}
                        pregnantId={pregnancyStore.id}
                    />
                }
                {
                    displayDueDate &&

                    <DueDateCalculatorComponent
                        displayComponent={displayDueDate}
                        handleCloseDueDate={() => this.setState({ displayDueDate: false })}
                    />
                }
                {
                    displayHospital &&

                    <HospitalComponent
                        displayComponent={displayHospital}
                        handleCloseHospital={() => this.setState({ displayHospital: false })}
                    />
                }
                <View style={styles.body}>
                    <Text style={styles.txtHeader}>Helpful Tools
                    to Make Your Pregnancy Smoother</Text>
                    <ItemToolList handlePrees={(item) => this.handlePrees(item)} />
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