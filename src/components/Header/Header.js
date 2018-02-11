import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import Button from '../Button/Button'
class Header extends Component {
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
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
        <Button>Login</Button>
      </header>
    )
  }
}

export default Header
