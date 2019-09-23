import React, { Component } from 'react';




export default class SendVerEmail extends Component {

    constructor(props) {
        super(props);

     
        this.txtEmailValue = "";
    }

    btnGetUserByEmailSQL = () => {
        
        const data = {
          email: this.state.txtEmailValue,     
        };
    
        fetch('http://localhost:63911/UsersWS.asmx/GetUserByIdFromSQL', {
          method: 'post',
          headers: new Headers({
            'Content-Type': 'application/json;',
          }),
          body: JSON.stringify(data)
        })
          .then(res => {
            console.log('res=', res);
            return res.json()
          })
          .then(
            (result) => {
              console.log("fetch POST= ", result);
              console.log("fetch POST.d= ", result.d);
              let u = JSON.parse(result.d);
              console.log(u.Address);
              console.log(u.ID);
              console.log(u.Name);
            },
            (error) => {
              console.log("err post=", error);
            });
      }

    render() {
        

    
        return (
            <div>login <br /><br />
                Enter your email:<input type="text" onChange={this.txtEmailValue} /><br /><br />
                <button
          style={{ margin: 20 }}
          onClick={this.btnGetUserByEmailSQL}>send me email</button> <br />
                
            </div>
        );
    }
}