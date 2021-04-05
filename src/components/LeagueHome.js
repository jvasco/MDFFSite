import React, { Component } from 'react';
import './LeagueHome.css';
import ac from '../images/ac.gif';

class LeagueHome extends Component {
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
    const response = await fetch('/accounts/' + this.state.username + '&' + this.state.password);
    const body = await response.json();
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

      <div style={{ 'max-width': '1200px', 'margin-top': "100px" }}>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Karma" />
        <div class="w3-row-padding w3-padding-16 w3-center" id="food">
          <div class="w3-quarter">
            <a href="/history"><img src={ac} alt="AC" style={{ width: "100%" }} /></a>
            <h3>HISTORY</h3>
            <p>Find out more about this league of extrodinary gentlemen, and their roots on the banks of the old Raritan</p>
          </div>
          <div class="w3-quarter">
            <img src="/w3images/cherries.jpg" alt="Cherries" style={{ width: "100%" }} />
            <h3>Cherries, interrupted</h3>
            <p>Lorem ipsum text praesent tincidunt ipsum lipsum.</p>
            <p>What else?</p>
          </div>
          <div class="w3-quarter">
            <img src="/w3images/wine.jpg" alt="Pasta and Wine" style={{ width: "100%" }} />
            <h3>Once Again, Robust Wine and Vegetable Pasta</h3>
            <p>Lorem ipsum text praesent tincidunt ipsum lipsum.</p>
          </div>
        </div>
      </div>
    );
  }
}
export default LeagueHome;