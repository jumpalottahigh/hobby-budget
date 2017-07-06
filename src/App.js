import React, { Component } from 'react'
import Moment from 'react-moment'
import { Bar, Line, Pie } from 'react-chartjs-2'
import firebase from './firebase.js'
import './App.css'

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
      reportTotalMoneySpent: 0,
      configStartingDate: 0,
      chartData: {},
      chartOptions: {}
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleFilterByYear = this.handleFilterByYear.bind(this)
    this.handleFilterByMonth = this.handleFilterByMonth.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.modelAllPurchasesByCategory = this.modelAllPurchasesByCategory.bind(this)
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

  // Check if the user is logged in
  loggedInState () {
    firebase.auth().onAuthStateChanged(function (user) {
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
    })
  }

  // Handle logout
  handleLogout () {
    firebase.auth().signOut()
  }

  //
  // Chart model creation
  //
  modelAllPurchasesByCategory () {
    // Data to extract
    let labels = []
    let backgroundColors = []
    let allPurchasesByCategory = []
    let currentCategoryTotal = 0

    // Itirate the data and extract labels and datasets
    for (let i = 0, len = this.state.items.length; i < len; i++) {
      let label = this.state.items[i].category
      // Extract label categories and colors for them
      if (!labels.includes(label)) {
        labels.push(label)
        // Generate random color for each label
        backgroundColors.push(`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`)
      }
    }

    // Calculate total spendings per category
    for (let i = 0, len = labels.length; i < len; i++) {
      // Reset itirator states
      currentCategoryTotal = 0

      for (let j = 0, leng = this.state.items.length; j < leng; j++) {
        // Calculate totals by category
        if (labels[i] === this.state.items[j].category) {
          currentCategoryTotal += parseInt(this.state.items[j].price)
        }
      }
      // Push total to result collection
      allPurchasesByCategory.push(currentCategoryTotal)
    }

    // Must return an object literal as required by setState
    return {
      // Chart data object is required
      chartData: {
          labels: labels,
          datasets: [
            {
              data: allPurchasesByCategory,
              backgroundColor: backgroundColors
            }
          ]
        },
        // This object is customizable and not required to display the chart
        chartOptions: {
          title: {
            display: true,
            text: 'Total spendings by category'
          }
        }
    }

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
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
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

  // Lifecycle method: will mount
  componentWillMount () {
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
        let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
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

      // Set initial chartData state to a model
      this.setState(this.modelAllPurchasesByCategory())
    })

    const configRef = firebase.database().ref('config')
    configRef.on('value', (snapshot) => {
      let config = snapshot.val()

      this.setState({
        configStartingDate: config.startingDate
      })
    })

    // Get initial login state
    this.loggedInState()
  }

  //
  // Component mounted
  //
  componentDidMount () {
  }

  // Render
  render () {
    return (
      <div className='container-fluid text-center'>
        <div id='loginSection' className='row pt-1 pb-4 login bg-warning text-white'>
          <h6 className='col-12 mt-3'>You are not logged in. Your data won't be saved to Firebase.</h6>
          <div className='col-12 col-sm-6 col-md-4 offset-md-4'>
            <input className='form-control mb-3' id='email' type='text' name='email' placeholder='Email' />
          </div>
          <div className='col-12 col-sm-6 col-md-4 offset-md-4'>
            <input className='form-control mb-3' id='password' type='password' name='password' placeholder='Password' />
          </div>
          <div className='col-12'>
            <button className='btn btn-primary' id='btnLogin' onClick={this.handleLogin} >Login</button>
          </div>
        </div>
        <div id='logoutSection' className='row pt-1'>
          <div className='col-12 text-right'>
            You are logged in.
            <button className='btn btn-info ml-2' id='btnLogout' onClick={this.handleLogout} >Logout</button>
          </div>
        </div>
        <div>
          <section className='col-12 py-4'>
            <header className='row'>
              <div className='col-12'>
                <h1 className='text-primary'>Budget Tracker</h1>
              </div>
            </header>
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
                  <option value='makeup'>Make up, jewelry and candles</option>
                </select>
                <button className='btn btn-primary'>Add Item</button>
              </div>
            </form>
          </section>

          <section className='col-12 py-4'>
            <Pie
              data={this.state.chartData}
              options={this.state.chartOptions}
            />
            <Bar
              data={this.state.chartData}
              options={{legend: {display: false}}}
            />
          </section>
          <section className='col-12 py-4 bg-info'>
            <h2 className='col-12'>Quick stats:</h2>
            <div className='col-12'>
              <h4>Total money spent: <span className='text-white'>{this.state.reportTotalMoneySpent}</span></h4>
              <h4>Data collected since: <span className='text-white'><Moment format='Do MMM YYYY'>{this.state.configStartingDate}</Moment></span></h4>
            </div>
          </section>
          <section className='col-12 py-4'>
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
        </div>
      </div>
    )
  }
}
export default App
