import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import firebase from '../../firebase'
class Header extends Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <header>
        <a className="brand" href="/">
          <h4>
            <span role="img" aria-label="money bag emoji">
              💰
            </span>
            {` `}
            Budget Tracker
          </h4>
        </a>
        <nav>
          <Link to="/">Add</Link>
          <Link to="/charts">Charts</Link>
        </nav>
        <Link className="login" to="/login">
          Account
        </Link>
      </header>
    )
  }
}

export default Header
