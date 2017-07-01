import React, { Component } from 'react'
import './App.css'
import firebase from './firebase.js'
import Moment from 'react-moment'

class App extends Component {
  //
  // Constructor
  //
  constructor () {
    super()
    this.state = {
      currentItem: '',
      currentPrice: '',
      currentCategory: 'home-upgrades',
      timestamp: '',
      items: [],
      filterYears: [],
      filterMonths: [],
      reportTotalMoneySpent: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleFilterByYear = this.handleFilterByYear.bind(this)
    this.handleFilterByMonth = this.handleFilterByMonth.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  //
  // Custom handlers
  //
  // Input changes
  handleChange (e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleClick (e) {
    this.filterByCategory(e.target.value)
  }

  // Check login state
  //Check if the user is logged in
  loggedInState () {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let logoutSection = document.getElementById('logoutSection')
        logoutSection.style.display = 'block'
        console.log('singed in')
        console.log(user.email)
        return true
      } else {
        let loginSection = document.getElementById('loginSection')
        loginSection.style.display = 'block'
        console.log('singed out')
        return false
      }
    })
  }

  // Handle login
  handleLogin () {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      console.log(errorCode + errorMessage)
      // ...
      if (errorCode === 'auth/wrong-password') {
        console.log('Wrong password.')
      } else {
        console.error(error)
      }
      // window.location.reload()
    })
  }

  // Handle logout
  handleLogout () {
    firebase.auth().signOut()
  }

  // Remove item
  removeItem (item) {
    const itemRef = firebase.database().ref(`/items/${item.id}`)
    itemRef.remove()
  }

  //
  // Data Filters
  //
  // Filter by category
  filterByCategory (cat) {
    // Collect all UI nodes
    const cards = document.getElementsByClassName('card')

    // Explicitly show or hide nodes
    for (let i = 0, cardLen = cards.length; i < cardLen; i++) {
      if (cat === 'All') {
        cards[i].parentNode.style.display = 'initial'
      } else if (cat === cards[i].dataset.category) {
        cards[i].parentNode.style.display = 'initial'
      } else {
        cards[i].parentNode.style.display = 'none'
      }
    }
  }

  // Filter by year
  handleFilterByYear (e) {
    // Collect all UI nodes
    const cards = document.getElementsByClassName('card')
    const filterYear = e.target.value

    for (let i = 0, cardLen = cards.length; i < cardLen; i++) {
      const cardYear = new Date(parseInt(cards[i].dataset.date, 10)).getFullYear()

      if (filterYear === 'All') {
        cards[i].parentNode.style.display = 'initial'
      } else if (parseInt(filterYear, 10) === parseInt(cardYear, 10)) {
        cards[i].parentNode.style.display = 'initial'
      } else {
        cards[i].parentNode.style.display = 'none'
      }
    }
  }

  // Filter by month
  handleFilterByMonth (e) {
    // Collect all UI nodes
    const cards = document.getElementsByClassName('card')
    const filterMonth = e.target.value

    for (let i = 0, cardLen = cards.length; i < cardLen; i++) {
      let cardMonth = new Date(parseInt(cards[i].dataset.date, 10)).getMonth()
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December']
      cardMonth = monthNames[cardMonth]

      if (filterMonth === 'All') {
        cards[i].parentNode.style.display = 'initial'
      } else if (filterMonth === cardMonth) {
        cards[i].parentNode.style.display = 'initial'
      } else {
        cards[i].parentNode.style.display = 'none'
      }
    }
  }

  // Form submission
  handleSubmit (e) {
    e.preventDefault()
    const itemsRef = firebase.database().ref('items')
    const item = {
      name: this.state.currentItem,
      price: this.state.currentPrice,
      category: this.state.currentCategory,
      timestamp: Date.now()
    }

    itemsRef.push(item)
    this.setState({
      currentItem: '',
      currentPrice: ''
    })
  }

  //
  // Component mounted
  //
  componentDidMount () {
    const itemsRef = firebase.database().ref('items')
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val()
      let newState = []

      for (let item in items) {
        newState.push({
          id: item,
          name: items[item].name,
          price: items[item].price,
          category: items[item].category,
          timestamp: items[item].timestamp
        })
      }

      this.setState({
        items: newState
      })
      
      // FILTERS AND REPORTS
      // Create filters based on item dates
      let cards = document.getElementsByClassName('card')
      let years = []
      let months = []
      let totalMoney = 0

      for (let i = 0, cardLen = cards.length; i < cardLen; i++) {
        let date = new Date(parseInt(cards[i].dataset.date, 10))
        let year = date.getFullYear()
        let month = date.getMonth()
        let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December']
        month = monthNames[month]

        if (!years.includes(year)) {
          years.push(year)
        }

        if (!months.includes(month)) {
          months.push(month)
        }

        if (!isNaN(parseInt(cards[i].dataset.price, 10))) {
          totalMoney += parseInt(cards[i].dataset.price, 10)
        }
      }
      this.setState({
        filterYears: years,
        filterMonths: months,
        reportTotalMoneySpent: totalMoney
      })
    })

    // Get initial login state
    this.loggedInState()
  }

  // Render
  render () {
    return (
      <div className='container text-center'>
        <div id="loginSection" className='row pt-1 pb-4 login'>
          <h6 className='col-12 mt-3 text-warning'>You are not logged in. Your data won't be saved to Firebase.</h6>
          <div className="col-12 col-sm-6 col-md-4 offset-md-4">
            <input className='form-control mb-3' id="email" type='text' name='email' placeholder='Email' />
          </div>
          <div className="col-12 col-sm-6 col-md-4 offset-md-4">
            <input className='form-control mb-3' id="password" type='password' name='password' placeholder='Password' />
          </div>
          <div className="col-12">
            <button className='btn btn-primary' id="btnLogin" onClick={this.handleLogin} >Login</button>
          </div>
        </div>
        <div id="logoutSection" className='row pt-1'>
          <div className='col-12 text-right'>
            You are logged in.
            <button className='btn btn-info ml-2' id="btnLogout" onClick={this.handleLogout} >Logout</button>
          </div>
        </div>
        <header className='row'>
          <div className='col-12'>
            <h1 className='mt-3 text-primary'>Budget Tracker</h1>
          </div>
        </header>
        <div className='row'>
          <section className='col-12'>
            <form onSubmit={this.handleSubmit}>
              <div className='form-group col-12 col-md-6 offset-md-3'>
                <input className='form-control mb-3' type='text' name='currentItem' placeholder='Item / note' onChange={this.handleChange} value={this.state.currentItem} />
                <input className='form-control mb-3' type='text' name='currentPrice' placeholder='Price' onChange={this.handleChange} value={this.state.currentPrice} />
                <select className='form-control mb-3' name='currentCategory' onChange={this.handleChange} value={this.state.currentCategory}>
                  <option value='alcohol'>Alcohol</option>
                  <option value='baby-stuff'>Baby stuff</option>
                  <option value='clothes'>Clothes</option>
                  <option value='electronics'>Electronics</option>
                  <option value='entertainment'>Entertainment</option>
                  <option value='gifts'>Gifts</option>
                  <option value='home-upgrades'>Home upgrades</option>
                  <option value='junk-food'>Junk food</option>
                  <option value='makeup'>Make up</option>
                </select>
                <button className='btn btn-primary'>Add Item</button>
              </div>
            </form>
          </section>
          <section className='col-12'>
            <h2 className='col-12'>Filter by year:</h2>
            <div className='col-12 mb-2'>
              <input type='button' className='btn btn-secondary m-1' onClick={this.handleFilterByYear} value='All' />
              {this.state.filterYears.map((item) => {
                return (
                  <input className='btn btn-secondary m-1' key={item} onClick={this.handleFilterByYear} type='button' value={item} />
                )
              })}
            </div>
            <h2 className='col-12'>Filter by month:</h2>
            <div className='col-12 mb-2'>
              <input type='button' className='btn btn-secondary m-1' onClick={this.handleFilterByMonth} value='All' />
              {this.state.filterMonths.map((item) => {
                return (
                  <input className='btn btn-secondary m-1' key={item} onClick={this.handleFilterByMonth} type='button' value={item} />
                )
              })}
            </div>
          </section>
          <section className='row'>
            <h2 className='col-12'>Filter by category:</h2>
            <div className='col-12 mb-2'>
              <input type='button' className='btn btn-secondary m-1' onClick={this.handleClick} value='All' />
              <input type='button' className='btn m-1 alcohol' onClick={this.handleClick} value='alcohol' />
              <input type='button' className='btn m-1 baby-stuff' onClick={this.handleClick} value='baby-stuff' />
              <input type='button' className='btn m-1 clothes' onClick={this.handleClick} value='clothes' />
              <input type='button' className='btn m-1 electronics' onClick={this.handleClick} value='electronics' />
              <input type='button' className='btn m-1 entertainment' onClick={this.handleClick} value='entertainment' />
              <input type='button' className='btn m-1 gifts' onClick={this.handleClick} value='gifts' />
              <input type='button' className='btn m-1 home-upgrades' onClick={this.handleClick} value='home-upgrades' />
              <input type='button' className='btn m-1 junk-food' onClick={this.handleClick} value='junk-food' />
              <input type='button' className='btn m-1 makeup' onClick={this.handleClick} value='makeup' />
            </div>
            {this.state.items.map((item) => {
              return (
                <div className='col-12 col-sm-6 col-md-6 col-lg-3 mb-3' key={item.id}>
                  <div className='card' data-category={item.category} data-date={item.timestamp} data-name={item.name} data-price={item.price} key={item.id}>
                    <h5><span className={`col-12 badge badge-default ${item.category}`}>{item.category}</span></h5>
                    <h5>{item.name}</h5>
                    <p>Price: {item.price} | Date: <Moment format='Do MMM YYYY'>{item.timestamp}</Moment></p>
                  </div>
                </div>
              )
            })}
          </section>
          <section className='col-12'>
            <h2 className='col-12'>Reports and graphs:</h2>
            <div className='col-12'>
              <h4>Total money spent: {this.state.reportTotalMoneySpent}</h4>
            </div>
          </section>
        </div>
      </div>
    )
  }
}
export default App


