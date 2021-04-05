import React, { Component } from 'react';
import './LeagueHome.css';
import ac from '../images/ac.gif';
import ryan from '../images/ryan.jpeg'
import rick from '../images/rick.jpeg'

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
        <div id="food">
          <div className='homeleft'>
            <a href="/history">
              <img className='pic' src={ac} alt="AC"/>
              </a>
            <h3>HISTORY</h3>
            <p>More about the Mad Dogs and their roots on the banks of the old Raritan</p>
          </div>
          <div className='homecenter'>
            <img className='pic' src={rick} alt="Awards" />
            <h3>2021 AWARDS</h3>
            <p>See the awards each of the Mad Dogs valiantly earned over this past season</p>
          </div>
          <div className='homeright'>
            <img className='pic' src={ryan} alt="Losers" />
            <h3>HALL OF LOSERS</h3>
            <p>Gallery of past losers and their punishments</p>
          </div>
        </div>
      </div>
    );
  }
}
export default LeagueHome;