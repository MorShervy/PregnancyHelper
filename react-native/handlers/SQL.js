const URL = "http://ruppinmobile.tempdomain.co.il/site08/api";

export default class SQL {

    static Register(email, password) {
        console.log('email=', email, 'pass=', password)

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${URL}/user/Register`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
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


}