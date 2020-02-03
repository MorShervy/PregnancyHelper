import { observable, action, computed, runInAction } from 'mobx'

const URL = "http://ruppinmobile.tempdomain.co.il/site08/api";

class AlbumStore {
    @observable album = [];
    @observable picture = {};
    @observable week = 0;

    @action setPicture = (id, picUri) => {
        this.album = [...this.album, { id, picUri }]
        return this.album;
    }

    @action getPregnancyAlbumByPregnantId = pregnantId => {
        console.log('pregnantId=', pregnantId)
        fetch(`${URL}/PregnancyAlbum/${pregnantId}`)
            .then(response => response.json())
            .then(data => {
                runInAction(() => {
                    // console.log('data=', data)
                    this.album = data;
                    return true;
                })
            })
    }

    @action getPictureInAlbum = week => {
        let picArr = this.album.filter(pic => pic.WeekID === week)
        this.picture = picArr[0];
        return this.picture;
    }

    @action setWeek(week) {
        this.week = week;
    }

    get week() {
        return this.week;
    }
}

const albumStore = new AlbumStore();
export default albumStore