import React from 'react';
import { MessageBox, MessageList } from './Messages';
import firebase from 'firebase';
import withAuthorization from './withAuthorization';

import { Col, ListGroup, ListGroupItem, Well, Collapse, Button } from 'react-bootstrap';

class GroupLinks extends React.Component {
  constructor(props) {
    super(props)
    this.state = { textValue: '' }
    this.updateText = this.updateText.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.joinGroup = this.joinGroup.bind(this);
    this.createNewGroup = this.createNewGroup.bind(this);
  }

  componentDidMount() {
    var groupRef = firebase.database().ref('groups')

    var groupsToDisplay = {};
    groupRef.on('value', (snapshot) => {
      var findGroups = {};
      var currUser = firebase.auth().currentUser.uid;
      var userGroupRef = firebase.database().ref('users/' + currUser + '/groups');
      var allGroups = snapshot.val();
      if (allGroups != null) {
        userGroupRef.on('value', (snapshot) => {
          findGroups = snapshot.val()
          for (var key in findGroups) {
            if (key in allGroups) {
              groupsToDisplay[key] = allGroups[key];
            }
          }
          this.setState({ group: groupsToDisplay });
        })
      }
    })
  }

  updateText(event) {
    this.setState({ textValue: event.target.value })
  }

  //Creates a new group. The group is saved to firebase under a uniqueID, and the text value 
  //entered by the user is saved as the group's groupName property.
  //New groups are shown in the group list once created.
  createNewGroup(event) {
    event.preventDefault();
    this.setState({ group: '' })

    var groupRef = firebase.database().ref('groups')
    var currUser = firebase.auth().currentUser.uid;
    var userRef = firebase.database().ref('users/' + currUser)
    var newGroup = groupRef.push().key;
    var groupCode = Math.floor(1000 + Math.random() * 9000);
    groupRef.child(newGroup).set({ groupName: this.state.textValue, code: groupCode });
    userRef.child('groups').child(newGroup).set(this.state.textValue);
    this.setState({ newGroup: { [newGroup]: { groupName: this.state.textValue} } })

  }

  joinGroup(event) {
    event.preventDefault();
    var groupRef = firebase.database().ref('groups');
    var enteredCode = this.state.textValue;
    var userId = firebase.auth().currentUser.uid;
    var userRef = firebase.database().ref('users/' +userId);
    groupRef.on('value', (snapshot) => {
      snapshot.forEach((group) => {
        if (group.val().code == this.state.textValue) {
          userRef.child('groups').child(group.key).set(group.val().groupName);
          this.setState({newGroup: {[group]: {groupName: group.val().groupName}}})
        }
      })
      
    })
  }

  //Changes the groupID in state when the user clicks on a group in the list.
  //This new state is then passed to the messageBox and messageList components.
  handleClick(event) {
    var thisComponent = this;
    var id = event.target.id;
    this.setState({ groupId: id });
  }

  render() {

    if (this.state.group) {
      //Item to be filled with available groups.
      var groups = [];
      //Populates list with names of available groups.
      for (var obj in this.state.group) {
        var groupId = this.state.group[obj].groupName;
        var newItem = <ListGroupItem onClick={this.handleClick} id={obj}>{this.state.group[obj].groupName}</ListGroupItem>
        groups.push(newItem);
      }
      return (
        <div>
          <Col xs={4} s={2} m={2} className="Group-nav">
            <h3>Groups</h3>
            <ListGroup className="list-unstyled">
              {groups}
              <ListGroupItem className="create-Group-item">
                <div>
                  <Button className="create-Group-btn" bsStyle="info" onClick={() => this.setState({ open: !this.state.open })}>New Group</Button>
                  <Collapse in={this.state.open}>
                    <div>
                      <Well>
                        <form>
                          <textarea placeholder="Group Name..." name="text" value={this.state.textUpdate} onChange={this.updateText} className="form-control"></textarea>
                          <Button bsStyle="info" type="submit" onClick={this.createNewGroup}>Create</Button>
                        </form>
                      </Well>
                    </div>
                  </Collapse>
                </div>
              </ListGroupItem>
              <ListGroupItem className="join-Group-item">
                <div>
                  <Button className="join-Group-btn" bsStyle="info" onClick={() => this.setState({ openJoin: !this.state.openJoin })}>Join Group</Button>
                  <Collapse in={this.state.openJoin}>
                    <div>
                      <Well>
                        <form>
                          <textarea placeholder="Enter Group Code..." name="text" value={this.state.textUpdate} onChange={this.updateText} className="form-control"></textarea>
                          <Button bsStyle="info" type="submit" onClick={this.joinGroup}>Join</Button>
                        </form>
                      </Well>
                    </div>
                  </Collapse>
                </div>
              </ListGroupItem>
            </ListGroup>
          </Col>
          <Col xs={7} className="message-section">

            <MessageBox groupId={this.state.groupId} />
            <MessageList groupId={this.state.groupId} />

          </Col>
        </div>
      );
    } else {
      return null;
    }
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(GroupLinks);
