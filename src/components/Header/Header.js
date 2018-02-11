import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
class Header extends Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <header>
        <Link className="brand" to="/">
          <h4>
            <span role="img" aria-label="money bag emoji">
              💰
            </span>
            {` `}
            Budget Tracker
          </h4>
        </Link>
        <nav>
          <Link to="/">Add</Link>
          <Link to="/stats">Stats</Link>
        </nav>
        <Link className="login" to="/login">
          Account
        </Link>
      </header>
    )
  }
}

export default Header
