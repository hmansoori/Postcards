import React from 'react';
import Time from 'react-time'
import firebase from 'firebase';
//import noUserPic from './no-user-pic.png';

import { Col, Collapse, Well, Modal, Button } from 'react-bootstrap';

// A form the user can use to post a Message
export class MessageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { post: '' };
  }

  //when the text in the form changes
  updatePost(event) {
    this.setState({ post: event.target.value });
  }

  //Posts a new Message to the database. These are saved under the group they belong to within
  //a message child object. Information saved with each message includes a timestamp of when it was
  //written, the user who wrote it, and what the content is.
  postMessage(event) {
    event.preventDefault(); //don't submit

    var MessagesRef = firebase.database().ref('groups/' + this.props.groupId); //the Messages in the JOITC
    var newMessage = {
      text: this.state.post,
      userId: firebase.auth().currentUser.uid, //to look up Messageer info
      time: firebase.database.ServerValue.TIMESTAMP, //MAGIC
    };
    MessagesRef.child('messages').push(newMessage); //upload

    this.setState({ post: '' }); //empty out post (controlled input)
  }

  render() {
    //var currentUser = firebase.auth().currentUser; //get the curent user
    //console.log(this.props.groupId)
    return (
      <Col xs={7}>
        <div className="Message-box write-Message">
          {/* Show image of current user, who must be logged in */}
          {/*<img className="image" src={currentUser.photoURL ? currentUser.photoURL : noUserPic} alt="user avatar" />*/}
          <h3>Messages</h3>
          <form className="Message-input">
            <textarea placeholder="What's Happening..." name="text" value={this.state.post} className="form-control" onChange={(e) => this.updatePost(e)}></textarea>

            <div className="form-group send-Message">
              {/* Disable if invalid post length */}
              <Button bsStyle="info"
                disabled={this.state.post.length === 0}
                onClick={(e) => this.postMessage(e)} >
                <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Share
            </Button>
            </div>
          </form>
        </div>
      </Col>
    );
  }
}

//A list of Messages that have been posted
export class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { Messages: [] };
  }

  //Lifecycle callback executed when the component appears on the screen.
  //It is cleaner to use this than the constructor for fetching data
  componentDidMount() {
    /* Add a listener for changes to the user details object, and save in the state */
    var MessageRef = firebase.database().ref('groups/' + this.props.groupId);
    //console.log(this.props.groupId)
    MessageRef.on('value', (snapshot) => {
      //console.log(snapshot.val())
      this.setState({ messages: snapshot.val() });
    })

    var usersRef = firebase.database().ref('users');
    usersRef.on('value', (snapshot) => {
      this.setState({ users: snapshot.val() });
    });
    var groupObject = {};
    var messageArray = [];
    var groupRef = firebase.database().ref('groups');
    groupRef.on('value', (snapshot) => {
      this.setState({groups: snapshot.val()});
      snapshot.forEach((group) => {
        var groupMessages = [];
        for(var message in group.val().messages) {
          groupMessages.push(group.val().messages[message])
        }
        groupMessages.sort((a, b) => b.time - a.time);
        groupObject[group.key] = groupMessages;
      })
      console.log(groupObject);
      this.setState({allMessages: groupObject})

    })
    

  }

  //When component will be removed
  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('users').off();
    firebase.database().ref('groups/' + this.props.groupId).off();
    firebase.database().ref('groups').off();
  }

  render() {
    var messageItems = [];
    console.log(this.props.groupId);
    //don't show if don't have message data yet (to avoid partial loads)
    if (this.state && this.state.allMessages && (this.props.groupId != null)) {
      var groupToUse = this.state.allMessages[this.props.groupId]
      console.log(groupToUse)
      for (var i = 0; i < groupToUse.length; i++) {
        console.log(groupToUse[i])
        var newMessage = <MessageItem Message={groupToUse[i]}
          // group={this.state.listMessages[i].groupId}
          user={groupToUse[i].userId} />
        messageItems.push(newMessage);
      }

    }

    return (
      <Col xs={7} s={6}>
        <div>
          {messageItems}
        </div>
      </Col>
    );
  }
}

//A single Message
class MessageItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = { textUpdate: '' }
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    var currentUser = firebase.auth().currentUser.uid;
    if (this.props.user === currentUser) {
      this.setState({ show: true });
    }
    else {
      this.setState({ show: false });
    }
  }

  componentDidMount() {
    var user = '';
    var userRef = firebase.database().ref('users/' + this.props.user);
    userRef.on('value', (snapshot) => {
      var userObj = snapshot.val();
      user = userObj;
    });

    this.setState({ user: user });
  }



  //A method to "like" a Message
  likeMessage() {
    /* Access the Message in the firebase and add this user's name */
    var MessageRef = firebase.database().ref('groups/' + this.props.group + '/' + this.props.Message.key);
    var MessageLikes = MessageRef.child('likes');

    //toggle logic
    var userId = firebase.auth().currentUser.uid
    var likeObj = this.props.Message.likes || {};
    if (likeObj && likeObj[userId]) { //in likes list already
      likeObj[userId] = null; //remove
    }
    else { //add my like
      likeObj[userId] = true; //just make it true so we have a key
    }

    MessageLikes.set(likeObj) //update the likes!
  }

  render() {
    //like styling, for fun!
    var iLike = false;
    var likeCount = 0; //count likes
    if (this.props.Message.likes) {
      likeCount = Object.keys(this.props.Message.likes).length;
      if (this.props.Message.likes[firebase.auth().currentUser.uid])
        iLike = true;
    }
    var user = this.state.user;

    //var avatar = (user.avatar ? user.avatar : noUserPic);

    return (

      <div className="Message-box">
        {this.state && this.state.user &&
          <div>
            <div>
              {/* This image's src should be the user's avatar */}
              {/* <img className="image" src={avatar} role="presentation" /> */}

              {/* Show the user's handle */}
              <span className="handle">{user.username} {/*space*/}</span>

              {/* Show the time of the Message (use a Time component!) */}
              <span className="time"><Time value={this.props.Message.time} relative /></span>
            </div>

            {/* Show the text of the Message */}
            <div className="Message">{this.props.Message.text}</div>

            {/* Create a section for showing Message likes */}
            <div className="likes">

              {/* Show a heart icon that, when clicked, calls like `likeMessage` function */}
              <i className={'fa fa-heart ' + (iLike ? 'user-liked' : '')} aria-label="like" onClick={() => this.likeMessage()} ></i>

              {/* Show the total number of likes */}
              <span>{/*space*/} {likeCount}</span>
            </div>
            <div> {this.state.show ? <EditBar message={this.props.Message} group={this.props.group} /> : null}
            </div>
          </div>
        }
      </div>
    );
  }
}

class EditBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { textUpdate: '', showModal: false };
    this.editMessage = this.editMessage.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  updatePost(event) {
    this.setState({ textUpdate: event.target.value });
  }

  deleteMessage() {
    var messageRef = firebase.database().ref('groups/' + this.props.group);
    messageRef.child(this.props.message.key).remove();
    this.setState({ showModal: false });

  }

  editMessage(event) {
    event.preventDefault();
    var messageRef = firebase.database().ref('groups/' + this.props.group + '/' + this.props.message.key);
    messageRef.child('text').set(this.state.textUpdate);
    this.setState({ textUpdate: '' });
  }

  open() {
    this.setState({ showModal: true });
  }

  close() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div>
        <Button onClick={() => this.setState({ open: !this.state.open })}><i className="fa fa-sort-desc" aria-label="editMessage" ></i></Button>
        <Collapse in={this.state.open}>
          <div>
            <Well>
              <form>
                <textarea placeholder="Edit Text..." value={this.state.textUpdate} className="form-control" onChange={this.updatePost}></textarea>
                <Button bsStyle="info" type="submit" onClick={this.editMessage}> Submit Edits</Button>
              </form>
              <i className="fa fa-trash-o fa-2x" aria-hidden="true" onClick={this.open}></i>
              <Modal className="delete-modal" show={this.state.showModal} onHide={this.close}>
                <Modal.Body>
                  <p>Are you sure you want to delete this message?</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button bsStyle="warning" onClick={this.deleteMessage}>Delete</Button>
                  <Button onClick={this.close}>Cancel</Button>
                </Modal.Footer>
              </Modal>
            </Well>
          </div>
        </Collapse>
      </div>
    );
  }
}


export default MessageList;