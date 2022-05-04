import React, { Component } from 'react'

class Navbar extends Component {

  render() {
    const style = {
      color: 'white',
    }
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Omni Bank
        </a>

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <p style={style}>{this.props.account}</p>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
