import React from 'react';
import { withRouter, HashRouter, Route } from "react-router-dom";
import './App.css';
import SendEmailResetPassword from './pages/sendEmailResetPassword/SendEmailResetPassword';
import ResetPassword from './pages/resetPassword/ResetPassword';


function App() {
  return (
    <HashRouter>
      <div>
        <Route exact path="/sendemail" component={SendEmailResetPassword} />
        <Route exact path="/resetpassword/:uid" component={ResetPassword} />
      </div>
    </HashRouter>
  );
}

export default withRouter(App);

