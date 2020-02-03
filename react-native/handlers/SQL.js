const URL = "http://ruppinmobile.tempdomain.co.il/site08/api";

export default class SQL {


    static Register(email, password, dueDate, lastMenstrualPeriod) {
        console.log('email=', email, 'pass=', password)
        console.log('dueDate=', dueDate, 'lastMenstrualPeriod=', lastMenstrualPeriod)


        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${URL}/user/Register`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        dueDate,
                        lastMenstrualPeriod
                    })
                });
                //console.log(`${URL}/user/register`, res);
                const data = await res.json();
                //console.log('data=', data)
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        })
    } // END Register 

    static Login(email, password) {
        //console.log('email=', email, 'pass=', password)

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${URL}/user/Login`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });
                //console.log(`${URL}/user/Login`, res);
                const data = await res.json();
                //console.log('data=', data)
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        })
    } // END Login 

    static async GetPregnancyByUserId(id) {
        // console.log('userId=', id);

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${URL}/Pregnancy/${id}`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    },
                })
                // console.log(`${URL}/user/Login`, res);
                const data = await res.json();
                // console.log('data=', data)
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        })
    }

    static async GetPregnancyAlbumByPregnantId(pregnantId) {

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${URL}/PregnancyAlbum/${pregnantId}`, {
                    method: "GET",
                    headers: {
                        'content-type': 'application/json'
                    },
                })
                // console.log(`${URL}/PregnancyAlbum/${pregnantId}`, res);
                const data = await res.json();
                // console.log('data=', data)
                resolve(data);
            }
            catch (error) {
                reject(error)
            }
        })
    }

    static async InsertPictureToPregnantAlbum(pregnantId, weekId, pictureUri) {

        console.log("pregnantId=", pregnantId)
        console.log("weekId", weekId)
        console.log("pictureUri", pictureUri)

        return new Promise(async (resolve, reject) => {
            try {

                const res = await fetch(`${URL}/PregnancyAlbum/InsertPictureToPregnantAlbum/`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        pregnantId,
                        weekId,
                        pictureUri
                    })
                });
                //console.log(`${URL}/user/Login`, res);
                const data = await res.json();
                //console.log('data=', data)
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        })

    }

    static async UpdatePictureToPregnantAlbum(pregnantId, weekId, pictureUri) {

        console.log("pregnantId=", pregnantId)
        console.log("weekId", weekId)
        console.log("pictureUri", pictureUri)

        return new Promise(async (resolve, reject) => {
            try {

                const res = await fetch(`${URL}/PregnancyAlbum/UpdatePictureInPregnancyAlbum/`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        pregnantId,
                        weekId,
                        pictureUri
                    })
                });
                //console.log(`${URL}/user/Login`, res);
                const data = await res.json();
                //console.log('data=', data)
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        })

    }

    static async DeletPictureFromPregnancyAlbum(pregnantId, weekId) {

        console.log("pregnantId=", pregnantId)
        console.log("weekId", weekId)


        return new Promise(async (resolve, reject) => {
            try {

                const res = await fetch(`${URL}/PregnancyAlbum/DeletPictureFromPregnancyAlbum/`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        pregnantId,
                        weekId
                    })
                });
                //console.log(`${URL}/PregnancyAlbum/DeletPictureFromPregnancyAlbum/`, res);
                const data = await res.json();
                //console.log('data=', data)
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        })

    }

    static async GetContractionsByUserId(id) {
        // console.log('userId=', id);

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${URL}/Contraction/${id}`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    },
                })
                // console.log(`${URL}/Contraction/${id}`, res);
                const data = await res.json();
                // console.log('data=', data)
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        })
    }

    static async InsertContraction(userId, startTime, endTime, length, timeApart, dateTime) {

        console.log("userId=", userId)
        console.log("startTime", startTime)
        console.log("endTime", endTime)
        console.log("length", length)
        console.log("timeApart", timeApart)
        console.log("timeApart", dateTime)

        return new Promise(async (resolve, reject) => {
            try {

                const res = await fetch(`${URL}/contraction/InsertContraction/`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        userId,
                        startTime,
                        endTime,
                        length,
                        timeApart,
                        dateTime
                    })
                });
                //console.log(`${URL}/contraction/InsertContraction/`, res);
                const data = await res.json();
                //console.log('data=', data)
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        })
    }

    static async DeleteContractionByUserId(userId) {

        console.log("userId=", userId)

        return new Promise(async (resolve, reject) => {
            try {

                const res = await fetch(`${URL}/contraction/DeleteContractionByUserId/`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        userId
                    })
                });
                //console.log(`${URL}/contraction/DeleteContractionByUserId/`, res);
                const data = await res.json();
                //console.log('data=', data)
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        })

    }

    static async GetKickTrackerByPregnantId(id) {
        // console.log('userId=', id);

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${URL}/kicktracker/${id}`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    },
                })
                // console.log(`${URL}/kicktracker/${id}`, res);
                const data = await res.json();
                // console.log('data=', data)
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        })
    }

    static async InsertKickTracker(pregnantId, date, length, time, kicks) {

        console.log("pregnantId=", pregnantId)
        console.log("date", date)
        console.log("length", length)
        console.log("time", time)
        console.log("kicks", kicks)

        return new Promise(async (resolve, reject) => {
            try {

                const res = await fetch(`${URL}/kicktracker/InsertKickTracker/`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        pregnantId,
                        date,
                        length,
                        time,
                        kicks
                    })
                });
                //console.log(`${URL}/kicktracker/InsertKickTracker/`, res);
                const data = await res.json();
                //console.log('data=', data)
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        })
    }

    static async DeleteKickTrackerByPregnantId(pregnantId) {

        console.log("pregnantId=", pregnantId)

        return new Promise(async (resolve, reject) => {
            try {

                const res = await fetch(`${URL}/kicktracker/DeleteKickTrackerByPregnantId/`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        pregnantId
                    })
                });
                //console.log(`${URL}/kicktracker/DeleteKickTrackerByPregnantId/`, res);
                const data = await res.json();
                //console.log('data=', data)
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        })

    }

    static UploadPicture(picUri, picName) {

        let dataI = new FormData();
        dataI.append('picture', {
            uri: picUri,
            name: picName,
            type: 'image/jpg'
        });

        const config = {
            method: 'POST',
            body: dataI,
        }

        fetch(`${URL}/PregnancyAlbum/UploadPicture/`, config)
            .then((responseData) => {
                // Log the response form the server
                let res = responseData._bodyText
                debugger;
                console.log("res=", res)
                if (responseData.status == 201) {

                    alert(`uploaded successfully!`);
                }
                else {

                    alert('error uploding ...');
                }
            })
            .catch(err => {
                alert('err upload= ' + err);

            })
    }
}