import React, { Component } from 'react';
//import './Login.html';

class Login extends Component {
  state = {
    isLogged: false,
    username: '',
    roster: [],
    pic: ''
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  getRoster = async e => {
    console.log('made it here ' + this.state.username);
    const response = await fetch('/roster/' + this.state.username);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    // this.setState({
    //   response: response
    // })
    console.log('uhh ' + response);
  }
  handleSubmit = async e => {
    e.preventDefault();
    console.log("Username: " + this.state.username + " Password: " + this.state.password);
    const response = await fetch('/accounts');
    ///' + this.state.username + '&' + this.state.password);
    const body = await response.json();
    console.log("response: " + response + ' body: ' + body);
    if (response.status !== 200) throw Error(body.message);
    else {
      console.log('pee pee ');
      this.setState({
        isLogged: true,
        username: this.state.username
      })
    }
    const response2 = await fetch('/rosters/' + this.state.username);
    const body2 = await response2.json();
    this.setState({
      roster: body2.roster,
      pic: body2.logoURL
    })
    this.props.changeIsLogged(this.state.isLogged, this.state.username, this.state.roster, this.state.pic);
    this.getRoster();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" id="username" onChange={this.handleChange} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" id="password" onChange={this.handleChange} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}
export default Login;