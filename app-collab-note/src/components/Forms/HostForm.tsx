import React from 'react';
import logo from 'logo.svg';
import './Form.css';

interface Props {
  onSubmit: (data: any) => void;
  initData: {
    username?: string;
    noteId?: string;
    token?: string;
  }
}

interface State {
  username: string,
  noteId: string,
  token: string
}
class HostForm extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const {username, noteId, token} = props.initData;
    this.state = { 
      username: username || '',
      noteId: noteId || '',
      token: token || '',
    };
  }

  updateField = (event: { target: any }): void => {
    const { id, value } = event.target;
    switch(id) {
    case 'username':
      this.setState({ username: value });
      break;
    case 'noteId':
      this.setState({ noteId: value });
      break;
    case 'token':
      this.setState({ token: value });
      break;
    }
  }

  handleSubmit = (): void => {
    const { username, noteId, token }  = this.state;
    if(!!username && !!noteId && !!token) {
      this.props.onSubmit({ username, noteId, token });
    }
    else {
      alert('Some feilds are missing!');
    }
  }

  render(): JSX.Element {
    const { username, noteId, token } = this.state;
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
                value={username}
                onChange={this.updateField}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="noteId"
                id="noteId"
                placeholder="Note ID"
                value={noteId}
                onChange={this.updateField}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="token"
                id="token"
                placeholder="Auth Token"
                value={token}
                onChange={this.updateField}
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="button" className="btn" onClick={this.handleSubmit}>
            Host
          </button>
        </div>
      </div>
    );
  }
}

export default HostForm;
