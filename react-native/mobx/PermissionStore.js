import { decorate, observable, action, computed, runInAction, configure, observe } from 'mobx'

class PermissionStore {

    @observable location = false;
    @observable camera = false;
    @observable cameraRoll = false;

    @action setCameraRoll(permission) {
        this.cameraRoll = permission
    }

    get cameraRoll() {
        return this.cameraRoll
    }

    @action setCamera(permission) {
        this.camera = permission
    }

    get camera() {
        return this.camera;
    }

    @action setLocation(permission) {
        this.location = permission
    }

    get location() {
        return this.location;
    }
}

const permissionStore = new PermissionStore();
export default permissionStore;