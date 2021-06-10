import React from "react";
import logo from "../../logo.png";
import './Form.css';


interface Props {
  onSubmit: (data: any) => void;
}

interface State {
  username: string,
  roomId: string
}

class JoinForm extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { username: '', roomId: '' };
  }

  updateField = (event: any) => {
    const { id, value } = event.target;
    switch(id) {
      case 'username':
        this.setState({ username: value });
        break;
      case 'roomId':
        this.setState({ roomId: value });
        break;
    }
  }

  handleSubmit = () => {
    const { username, roomId }  = this.state;
    if(!!username && !!roomId) {
      this.props.onSubmit({ username, roomId });
    }
    else {
      alert('Username or Room ID is missing!');
    }
  }

  render() {
    return (
      <div className="base-container">
        <div className="image">
          <img src={logo} alt="Joplin logo" />
        </div>
        <h3>Joplin Collab Note</h3>
        <div className="content">
          <div className="form">
            <div className="form-group">
              <input 
                type="text" 
                name="username" 
                id="username" 
                placeholder="Username" 
                onChange={this.updateField}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="roomId"
                id="roomId"
                placeholder="Room ID"
                onChange={this.updateField}
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="button" className="btn" onClick={this.handleSubmit}>
            Join
          </button>
        </div>
      </div>
    );
  }
}

export default JoinForm;