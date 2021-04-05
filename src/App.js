import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'react-dropdown/style.css'
import Navbar from './components/Navbar'
import LeagueHome from './components/LeagueHome'
import { BrowserRouter, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Login from './components/Login.js'
import 'bootstrap/dist/css/bootstrap.min.css';
//import { BrowserRouter, Router } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';

const weeks = ['preseason', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12', 'Week 13', 'Week 14', 'Week 15', 'Week 16', 'Week 17'];

class App extends Component {
  state = {
    response: [],
    post: '',
    responseToPost: '',
    isLogged: false,
    username: '',
    roster: [],
    week: '',
    pic: ''
  };

  componentDidMount() {

    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }


  callApi = async () => {
    const response = await fetch('/accounts');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    //this.setState({responseToPost: body});
    return body;
  };

  changeIsLogged = (isLogged, username, roster, pic) => {
    //in here, get pic and stuff, add othe rprofile info
    sessionStorage.setItem('token', username);
    this.setState({
      isLogged: isLogged,
      username: username,
      roster: roster,
      pic: pic
    });
    // this.getRoster();
  };

  getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    return tokenString
  }

  Testing = () => {
    console.log("testing");
    return 1;
  }
  handleSubmit = async e => {
    e.preventDefault(); //what

    const response = await fetch('/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.post
      }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  }

  getRoster = async e => {
    console.log('made it here ' + e + ' ' + this.state.username + '&' + e);
    const response = await fetch('/roster/' + this.state.username + '&' + e);
    const body = await response.json();
    this.setState({
      week: e,
      roster: body.roster,
      pic: body.logoURL
    })
    console.log("pic: " + this.state.pic);
    console.log("respones id try: " + body.roster[0].fullName);
    body.roster.forEach(player => {
      console.log("PLAYER name: " + player.fullName);
    })
  }

  render() {
    console.log("is logged is " + this.state.isLogged);
    console.log("username is: " + this.state.username);
    console.log("Token is: " + this.getToken());
    const token = this.getToken();
    if (!token) {
      return (
        <Login changeIsLogged={this.changeIsLogged} />
      );
    }
    // if (!token) {
    //   return (
    //     <Login setToken={setToken} />
    //   );
    // }
    // else {
    const listItems = this.state.roster.map((d) => <tr> <td key={d.fullName}>{d.defaultPosition}</td> <td>{d.fullName}</td> </tr>);

    return (
      <BrowserRouter>
        <div className="App">
        <Navbar />
        <header className="App-header">
            <img
              src={this.state.pic}
            />
            Welcome, <p>{this.state.username}</p>
        </header>
        <Route path='/home' component={LeagueHome} />
        <Route path='/about'/>
          {/* <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>ugh {this.state.responseToPost}</p> */}
          <DropdownButton id="dropdown-basic-button" title="Select Week to View Roster" onSelect={this.getRoster} >
            <Dropdown.Item eventKey="0">Preseason</Dropdown.Item>
            <Dropdown.Item eventKey="1">Week 1</Dropdown.Item>
            <Dropdown.Item eventKey="2">Week 2</Dropdown.Item>
            <Dropdown.Item eventKey="3">Week 3</Dropdown.Item>
            <Dropdown.Item eventKey="4">Week 4</Dropdown.Item>
            <Dropdown.Item eventKey="5">Week 5</Dropdown.Item>
            <Dropdown.Item eventKey="6">Week 6</Dropdown.Item>
            <Dropdown.Item eventKey="7">Week 7</Dropdown.Item>
            <Dropdown.Item eventKey="8">Week 8</Dropdown.Item>
            <Dropdown.Item eventKey="9">Week 9</Dropdown.Item>
            <Dropdown.Item eventKey="10">Week 10</Dropdown.Item>
            <Dropdown.Item eventKey="11">Week 11</Dropdown.Item>
            <Dropdown.Item eventKey="12">Week 12</Dropdown.Item>
            <Dropdown.Item eventKey="13">Week 13</Dropdown.Item>
            <Dropdown.Item eventKey="14">Week 14</Dropdown.Item>
            <Dropdown.Item eventKey="15">Week 15</Dropdown.Item>
            <Dropdown.Item eventKey="16">Week 16</Dropdown.Item>
            <Dropdown.Item eventKey="17">Week 17</Dropdown.Item>

          </DropdownButton>

          <p>
            Week: {this.state.week}
          </p>
          <table>
            <tr>
              <th>Position</th>
              <th>Player Name</th>
            </tr>
            {listItems}
          </table>
        </div>
      </BrowserRouter>
    )
    //}
  };
}
export default App;
