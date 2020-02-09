import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { MaterialIcons, Octicons } from '@expo/vector-icons';

import { observer } from 'mobx-react'
import calendarStore from '../mobx/CalendarStore';

class PlaylistItem {
    constructor(name, uri, isVideo) {
        this.name = name;
        this.uri = uri;
        this.isVideo = isVideo;
    }

}

var PlayList = []

@observer
export default class VideoCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mute: true,
            fullScreen: false,
            shouldPlay: false,
            isLoaded: false,
        }

        var PlayList = [];
        for (i = 0; i < 42; i++) {
            PlayList.push(new PlaylistItem(
                `${i}`,
                `http://ruppinmobile.tempdomain.co.il/site08/PregnantVideo/Weeks${i + 1}.mp4`,
                true
            ))
        }
        this.playList = PlayList;
    }


    componentDidMount = async () => {
        // console.log('did mount video calendar')
        await this.loadCurrentVideo()

        const { isLoaded } = await this._video.getStatusAsync()
        // console.log('isLoadVideo=', isLoaded)
        this.setState({ isLoaded })
    }


    componentDidUpdate = async () => {
        // console.log('did update video calendar')
        if (calendarStore.isLoadVideo) {
            this.loadCurrentVideo().
                then(() => {
                    calendarStore.setIsLoadVideo(false)
                    this.setState(prevState => ({
                        mute: true,
                        shouldPlay: false
                    }))
                    // console.log('yes')
                })


        }

    }

    componentWillUnmount = async () => {
        // console.log('unmpunt')
        await this._video.unloadAsync()
    }

    _mountVideo = async (component) => {
        // console.log('mount video')
        this._video = component;


        // console.log('this._video.isLoaded=', this._video)
    }

    loadCurrentVideo = async () => {
        const { week } = this.props;
        const { playList } = this;
        // console.log('week=', week)
        // console.log('playList=', playList[week - 1].uri)
        let res = await this._video.loadAsync(
            { uri: playList[week - 1].uri },
            initialStatus = { androidImplementation: 'MediaPlayer' },
            downloadFirst = true
        )
        // console.log('res=', res)
    }

    handlePlayAndPause = () => {
        // console.log('this._video=')
        const { shouldPlay, mute } = this.state;
        if (!shouldPlay) {
            this._video.playAsync()
        }
        else {
            this._video.pauseAsync()
        }
        this.setState(prevState => ({
            shouldPlay: !prevState.shouldPlay
        }));
    }

    handleVolume = () => {
        const { mute } = this.state;
        // console.log('should=', shouldPlay)
        this._video.setIsMutedAsync(mute)
        this.setState(prevState => ({
            mute: !prevState.mute
        }))
    }

    render() {
        const { width } = Dimensions.get('window');
        const { isLoaded } = this.state;
        console.log('isLoaded=', isLoaded)
        return (
            <View style={styles.container}>
                <View>
                    {/* <Text style={{ textAlign: 'center' }}> React Native Video </Text> */}
                    <Video
                        ref={this._mountVideo}
                        // source={}
                        // shouldPlay={this.state.shouldPlay}
                        resizeMode="cover"
                        style={{ width: width - 40, height: 300 }}
                        // isMuted={this.state.mute}
                        isLooping={false}
                        useNativeControls={true}
                    // posterSource={require('../assets/images/logo.png')}
                    // usePoster={true}
                    />

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    }
});

