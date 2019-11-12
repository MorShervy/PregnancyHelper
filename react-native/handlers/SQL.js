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
        console.log('email=', email, 'pass=', password)

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
}