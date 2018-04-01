import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import {HashRouter} from 'react-router-dom';

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = { userId: null, show: false };
  }

  //Lifecycle callback executed when the component appears on the screen.
  //It is cleaner to use this than the constructor for fetching data
  componentDidMount() {
    /* Add a listener and callback for authentication events */
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('Auth state changed: logged in as', user.email);
        this.setState({ userId: user.uid, show: true });
      }
      else {
        console.log('Auth state changed: logged out');
        this.setState({ userId: null, show: false }); //null out the saved state
        HashRouter.push('/login');
      }
    })
  }

    //A callback function for logging out the current user
  signOut() {
    /* Sign out the user, and update the state */
    firebase.auth().signOut();
  }

  render() {
    return (
      <div>
        <header className="container-fluid">
          <div className="logo">
          <h1>Slick</h1>
            <i className="fa fa-cloud fa-3x" aria-label="Messageer logo"></i>
          </div>
          {this.state.userId &&  /*inline conditional rendering*/
            <div className="logout">
              <button className="btn btn-warning" onClick={() => this.signOut() }>Sign out {firebase.auth().currentUser.displayName}</button>
            </div>
          }
        </header>
        <main className="container">
        {/* <div> {this.state.show ? <ChannelLinks/> : null}
        </div> */}
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default App;
