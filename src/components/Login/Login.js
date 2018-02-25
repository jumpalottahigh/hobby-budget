import React, { Component } from 'react'
import { auth } from '../../firebase'
import Button from '../Button/Button'

import './Login.css'

export default class Login extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      error: null
    }
  }

  logout = () => {
    auth.signOut().then(() => {
      this.setState(
        {
          user: null
        },
        () => {
          window.location.href = '/'
        }
      )
    })
  }

  login = e => {
    e.preventDefault()
    let username = e.target.elements.username.value
    let password = e.target.elements.password.value

    auth
      .signInWithEmailAndPassword(username, password)
      .then(result => {
        const user = result.user
        this.setState(
          {
            user
          },
          () => {
            window.location.href = '/'
          }
        )
      })
      .catch(e => {
        this.setState({ error: e.message })
      })
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user })
      }
    })
  }

  render() {
    return (
      <section>
        <h1>{this.state.user ? `Hi, ${this.state.user.email}` : 'Login'}</h1>
        <div>
          {this.state.user ? (
            <div>
              <Button className="button" onClick={this.logout}>
                Log Out
              </Button>
            </div>
          ) : (
            <form onSubmit={this.login}>
              <label>
                Username:{` `}
                <input name="username" type="text" />
              </label>
              <label>
                Password: {` `}
                <input name="password" type="password" />
              </label>
              {this.state.error && (
                <span className="error">{this.state.error}</span>
              )}
              <Button type="submit" className="button">
                Log In
              </Button>
            </form>
          )}
        </div>
      </section>
    )
  }
}
