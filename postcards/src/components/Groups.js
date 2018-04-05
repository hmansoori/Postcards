import React from 'react';
import {MessageBox, MessageList} from './Messages';
import firebase from 'firebase';
import {Link} from 'react-router-dom';

import {Col, ListGroup, ListGroupItem, Well, Collapse, Button} from 'react-bootstrap';

class GroupLinks extends React.Component {
  constructor(props) {
    super(props)
    this.state = { textValue: '', group: {}}
    this.updateText = this.updateText.bind(this);
    this.createNewGroup = this.createNewGroup.bind(this);
  }

componentWillMount() {
   var group = firebase.database().ref('groups')
    group.on('value', (snapshot) => {
      var groups = snapshot.val();
      this.setState({group: groups});
    }); 
}

  updateText(event) {
    this.setState({ textValue: event.target.value })
  }

  createNewGroup(event) {
      event.preventDefault();
    var group = firebase.database().ref('groups')
    var newGroup = group.child(this.state.textValue).key;
    //history.push('groups/'+newGroup);
  }

  render() {
    var keys = Object.keys(this.state.group);
    console.log(this.props.children);
    var groups = keys.map((Group) => {
      var url = "/groups/"+Group;
      return <ListGroupItem><Link to={url}>{Group}</Link></ListGroupItem>
    });
    return (
      <div>
      <Col xs={4} s={2} m={2} className="Group-nav">
        <h3>Groups</h3>
        <ListGroup className="list-unstyled">
          {groups}
          <ListGroupItem className="create-Group-item">
            <div>
                <Button className="create-Group-btn" bsStyle="info" onClick={ ()=> this.setState({ open: !this.state.open })}>New Group</Button>
                <Collapse in={this.state.open}>
                <div>
                  <Well>
                    <form>
                      <textarea placeholder="Group Name..." name="text" value={this.state.textUpdate} onChange = {this.updateText} className="form-control"></textarea>
                      <Button bsStyle="info" type="submit" onClick={this.createNewGroup}>Create</Button>
                    </form>
                  </Well>
                </div>
                </Collapse>
            </div>
          </ListGroupItem>
        </ListGroup>
      </Col>
      <Col xs={7} className="message-section">
      {this.props.children}
      </Col>
      </div>
    );
  }
}
export {GroupLinks};

class Group extends React.Component {
    componentWillMount() {
        console.log(this.props.params);
        console.log(this.props);
    }
    render() {
        var groupId = this.props.params.groupId;
        return (
           <div>
            <MessageBox groupId={groupId}/>
            <MessageList groupId={groupId}/>
            </div>
        );
    }
}
export default Group;