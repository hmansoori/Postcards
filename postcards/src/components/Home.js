import React, { Component } from 'react';
import withAuthorization from './withAuthorization';
import {MessageBox, MessageList} from './Messages';

class HomePage extends Component {

  render() {
    return (
      <div>
        <MessageBox groupId = 'test'/>
        <MessageList groupId ='test'/>
      </div>
    );
  }
}
  

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);