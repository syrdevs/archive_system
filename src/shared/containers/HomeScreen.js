import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Header from '../components/Header';
import HeroScreen from './HeroScreen';
import ProfileScreen from './ProfileScreen'
import LoginScreen from '../../auth/LoginScreen';
import SignupScreen from '../../auth/SignupScreen';
import HelpScreen from './HelpScreen';

class HomeScreen extends Component {

  render() {
    return (
      <div className="home">
        <Header />
        <Route exact path="/" component={HeroScreen} />
        <Route exact path="/profile" component={ProfileScreen} />
        <Route exact path="/login" component={LoginScreen} />
        <Route exact path="/signup" component={SignupScreen} />
        <Route exact path="/help" component={HelpScreen} />
      </div>
    );
  }
}

export default HomeScreen;
