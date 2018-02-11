import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

class Header extends Component {
  render() {
    return (
      <header className="header">
        <nav className="brand">
          <a href="/">
            <h4>
              <span role="img" aria-label="money bag emoji">
                💰
              </span>
              {` `}
              Budget Tracker
            </h4>
          </a>
        </nav>
        <nav className="main">
          <Link to="/">Home</Link>
          {/* /about (goes to old page full length) */}
          <Link to="/about">About</Link>
          <a href="/blog">Blog</a>
        </nav>
      </header>
    )
  }
}

export default Header
