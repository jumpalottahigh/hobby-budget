import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Header.css'

const activeStyle = {
  color: 'red',
  fontWeight: 600,
  fontSize: '0.95rem'
}

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
            <br />
            {` `}
            Budget Tracker
          </h4>
        </Link>
        <nav>
          <NavLink to="/">Add</NavLink>
          <NavLink to="/stats" activeStyle={activeStyle}>
            Stats
          </NavLink>
          <NavLink to="/charts" activeStyle={activeStyle}>
            Charts
          </NavLink>
        </nav>
        <NavLink className="login" to="/login" activeStyle={activeStyle}>
          Account
        </NavLink>
      </header>
    )
  }
}

export default Header
