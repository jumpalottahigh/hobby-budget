import React, { Component, Fragment } from 'react'
import firebase from '../../firebase'
import { auth } from '../../firebase'
import Button from '../Button/Button'
import styled from 'styled-components'

import './Home.css'

const Form = styled.form`
  display: grid;
  justify-content: center;
  grid-gap: 10px;
  grid-template-rows: repeat(4, 45px);
`

class Home extends Component {
  constructor() {
    super()
    this.state = {
      currentItem: '',
      currentPrice: '',
      currentCategory: 'home-upgrades',
      timestamp: '',
      userIsLoggedIn: false
    }
  }

  // Input changes
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  // Form submission
  handleSubmit = e => {
    e.preventDefault()

    // Both fields need to be filled in for successful submit
    if (this.state.currentItem === '' || this.state.currentPrice === '') {
      return
    }

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

  componentWillMount() {
    // Get user state
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ userIsLoggedIn: true })
      }
    })

    const itemsRef = firebase.database().ref('items')

    itemsRef.on('value', snapshot => {
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
    })
  }

  render() {
    return (
      <section>
        {this.state.userIsLoggedIn ? (
          <Fragment>
            <h2>Add a purchase:</h2>
            <Form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="currentItem"
                placeholder="Item / note"
                onChange={this.handleChange}
                value={this.state.currentItem}
              />
              <input
                type="text"
                name="currentPrice"
                placeholder="Price"
                onChange={this.handleChange}
                value={this.state.currentPrice}
              />
              <select
                name="currentCategory"
                onChange={this.handleChange}
                value={this.state.currentCategory}
              >
                <option value="alcohol">Alcohol</option>
                <option value="baby-stuff">Baby stuff</option>
                <option value="clothes">Clothes</option>
                <option value="drone">Drones &amp; parts</option>
                <option value="electronics">Electronics</option>
                <option value="entertainment">Entertainment</option>
                <option value="gifts">Gifts</option>
                <option value="home-decor">Home decor &amp; candles</option>
                <option value="home-upgrades">Home upgrades</option>
                <option value="junk-food">Junk food</option>
                <option value="makeup">Make up &amp; jewelry</option>
              </select>
              <Button>Add Item</Button>
            </Form>
          </Fragment>
        ) : (
          <Fragment>You have to login to add items.</Fragment>
        )}
      </section>
    )
  }
}

export default Home
