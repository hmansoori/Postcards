import React from 'react';
import { Link } from 'react-router-dom';
import {Nav, Navbar, NavItem} from 'react-bootstrap'

import AuthUserContext from './AuthUserContext';
import * as routes from '../constants/routes';
import SignOutButton from './SignOut';
import logo from './images/pc_logo.png';


const Navigation = () =>
  <AuthUserContext.Consumer>
    {authUser => authUser
      ? <NavigationAuth />
      : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>
  const NavigationAuth = () =>
  // <ul>
  //   <li><Link to={routes.LANDING}>Landing</Link></li>
  //   <li><Link to={routes.GROUP}>Groups</Link></li>
  //   <li><Link to={routes.ACCOUNT}>Account</Link></li>
  //   <li><SignOutButton /></li>
  // </ul>

  <Navbar inverse >
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#home">
            <img src={logo} alt="logo" width="100px" height="100px"/>
          </a>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav pullRight>
      <li><Link to={routes.LANDING}>Landing</Link></li>
      <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
      </Nav>
    </Navbar>

const NavigationNonAuth = () =>
  // <ul>
  //   <li><Link to={routes.LANDING}>Landing</Link></li>
  //   <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
  // </ul>
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#home">
          <img src={logo} alt="logo" />
        </a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
    <li><Link to={routes.LANDING}>Landing</Link></li>
    <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
    </Nav>
  </Navbar>

export default Navigation;
