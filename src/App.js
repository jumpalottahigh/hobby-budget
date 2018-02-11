import React, { Component, Fragment } from 'react'
import './App.css'

// UI Components
import Header from './components/Header/Header'
import Main from './components/Main/Main'
import Footer from './components/Footer/Footer'

export class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <Main />
        <Footer />
      </Fragment>
    )
  }
}

export default App
