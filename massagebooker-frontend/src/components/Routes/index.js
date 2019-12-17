import React from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import DashBoard from '../Dashboard';
import Header from '../Header';
import Index from '../Index';
import InfoPage from '../InfoPage';
import LoginIndex from '../LoginIndex';
import MyPage from '../MyPage';
import Stats from '../Stats';
import StretchAppointmentDisplay from '../StretchingSessions';
import TV from '../TV';

const Routes = ({ user }) => {
    if (!user) {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" render={() => <LoginIndex />} />
                    <Route exact path="/tv" render={() => <TV />} />
                    <Route render={() => <Redirect to={{ pathname: '/' }} />} />
                </Switch>
            </Router>
        );
    } else {
        return (
            <>
                <Router>
                    <Header user={user} />
                    <div>
                        <Route exact path="/" render={() => <Index user={user} />} />
                        <Route exact path="/stretching" render={() => <StretchAppointmentDisplay />} />
                        <Route exact path="/dashboard" render={() => <DashBoard />} />
                        <Route exact path="/mypage" render={() => <MyPage />} />
                        <Route exact path="/stats" render={() => <Stats />} />
                        <Route exact path="/tv" render={() => <TV />} />
                        <Route exact path="/info" render={() => <InfoPage />} />
                    </div>
                </Router>
            </>
        );
    }
};

export default Routes;
