import React, { Component } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import { auth, db } from '../firebase';
import * as routes from '../constants/routes';
import { Button, FormGroup, FormControl } from 'react-bootstrap';
import { Col } from 'react-bootstrap';



const SignUpPage = ({ history }) =>
  <div>
    <h1>Sign Up</h1>
    <SignUpForm history={history} />
  </div>

const INITIAL_STATE = {
  // username: '',
  // email: '',
  // passwordOne: '',
  // passwordTwo: '',
  // error: null,

  username: "",
  email: "",
  password: "",
  passwordCheck: "",
  usernameFilled: false,
  emailFilled: false,
  passwordFilled: false
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});


class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  handleChange(event) {
    this.setState({username: "event.target.value"});
  }

  handleClick(button) {
    if (button == 'usernameFilled') {
      this.setState(byPropKey => ({
        'usernameFilled': !this.state.usernameFilled,
      }));
      console.log("filled");
      console.log(this.state.usernameFilled);
      console.log(this.state.username);
    } else if (button == 'emailFilled') {
      this.setState(byPropKey => ({
        'emailFilled': !this.state.emailFilled,
      }));
      console.log("email filled: " + this.state.email);
    } else if (button == 'passwordFilled') {
      this.setState(byPropKey => ({
        'passwordFilled': !this.state.passwordFilled,
      }));
    }
  }

  saveAndContinue = (e) => {

    const {
      history,
    } = this.props;

    e.preventDefault();

  }

  onSubmit = (event) => {
    // const {
    //   username,
    //   email,
    //   passwordOne,
    // } = this.state;
    //
    const {
      history,
    } = this.props;
    const {
      username,
      email,
      password,
    } = this.state;
    auth.doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {

          // Create a user in your own accessible Firebase Database too
          db.doCreateUser(authUser.uid, username, email)
          .then(() => {
            this.setState(() => ({ ...INITIAL_STATE }));
            history.push(routes.GROUP);
          })
          .catch(error => {
            this.setState(byPropKey('error', error));
            console.log('here');
          });

        })
      .catch(error => {
        this.setState(byPropKey('error', error));
        console.log('here2');
      });

    event.preventDefault();

  }

  render() {
    const username = this.state.username;
    const email = this.state.email;
    const password = this.state.password;
    const passwordCheck = this.state.passwordCheck;

    const usernameFilled = this.state.usernameFilled;
    const emailFilled = this.state.emailFilled;
    const passwordFilled = this.state.passwordFilled;

    const nameIsInvalid =
      username === '';

    const emailIsInvalid =
      email === '';

    const passwordIsInvalid =
      password !== passwordCheck ||
      password === '';


    if (!usernameFilled) {
      return (
        <div class="container">
          <h1>what name do you want to go by?</h1>
          <form>
            <FormGroup controlId="username">
              <FormControl
                  type="text"
                  value={this.state.username}
                  placeholder="Enter your name here"
                  /*onChange={this.handleChange}*/
                onChange={event => this.setState(byPropKey('username', event.target.value))}
              />
              <FormControl.Feedback />
            </FormGroup>
            <Button bsStyle="primary" disabled={nameIsInvalid} onClick={() => this.handleClick('usernameFilled')}>
              Continue
            </Button>
          </form>
        </div>
      );
    } else if (usernameFilled & !emailFilled){
      return (
        <div class="container">
          <h1>hey, {this.state.username}! what email do you want to use?</h1>
          <form>
            <FormGroup controlId="username">
              <FormControl
                  type="text"
                  value={this.state.email}
                  placeholder="Enter your email here"
                  /*onChange={this.handleChange}*/
                onChange={event => this.setState(byPropKey('email', event.target.value))}
              />
              <FormControl.Feedback />
            </FormGroup>
            <Button bsStyle="primary" disabled={emailIsInvalid} onClick={() => this.handleClick('emailFilled')}>
              Continue
            </Button>
          </form>
        </div>
      );
    } else if (usernameFilled & emailFilled & !passwordFilled){
      return (
        <div class="container">
          <h1>set your password</h1>
          <form>
            <FormGroup controlId="password">
              <FormControl
                  type="password"
                  value={this.state.password}
                  placeholder="Enter your password here"
                onChange={event => this.setState(byPropKey('password', event.target.value))}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId="passwordCheck">
              <FormControl
                  type="password"
                  value={this.state.passwordCheck}
                  placeholder="Retype your password here"
                onChange={event => this.setState(byPropKey('passwordCheck', event.target.value))}
              />
              <FormControl.Feedback />
            </FormGroup>
            <Button bsStyle="primary" disabled={passwordIsInvalid} onClick={() => this.handleClick('passwordFilled')}>
              Continue
            </Button>
          </form>
        </div>
      );
    } else {
      return (
        <div><Button bsStyle="primary" onClick={this.onSubmit}>
          Continue
        </Button>
        </div>
      );
    }
  }

}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>
export default withRouter(SignUpPage);
export {
  SignUpForm,
  SignUpLink,
};
