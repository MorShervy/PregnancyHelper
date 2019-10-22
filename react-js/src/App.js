import React from 'react';
import { withRouter, HashRouter, Route } from "react-router-dom";
import './App.css';
import SendEmailResetPassword from './pages/sendEmailResetPassword/SendEmailResetPassword';
import ResetPassword from './pages/resetPassword/ResetPassword';
import EmailSent from './pages/sendEmailResetPassword/EmailSent';
import PasswordUpdated from './pages/resetPassword/PasswordUpdated';


function App() {
  return (
    <HashRouter>
      <div>
        <Route exact path="/sendemail" component={SendEmailResetPassword} />
        <Route exact path="/emailsent" component={EmailSent} />
        <Route exact path="/resetpassword/:uid" component={ResetPassword} />
        <Route exact path="/passwordupdated" component={PasswordUpdated} />
      </div>
    </HashRouter>
  );
}

export default withRouter(App);

