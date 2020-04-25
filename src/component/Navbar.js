import React, { Component } from 'react';
import './../styles/nav.css'
import history from "./../history";

class Navbar extends Component {
  render() {
    return (
      <div className="nav">
        <h1 className="head" onClick={() => history.push('/')}> numtaopupla </h1>
      </div>
    );
  }
}

export default Navbar;

