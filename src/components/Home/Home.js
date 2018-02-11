import React, { Component } from 'react'
import firebase from '../../firebase'

import './Home.css'
class Home extends Component {
  constructor() {
    super()
    this.state = {
      currentItem: '',
      currentPrice: '',
      currentCategory: 'home-upgrades',
      timestamp: ''
    }
  }

  componentWillMount() {
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

    const configRef = firebase.database().ref('config')
    configRef.on('value', snapshot => {
      let config = snapshot.val()

      this.setState({
        configStartingDate: config.startingDate
      })
    })
  }

  render() {
    console.log(this.state)
    return (
      <section>
        <h2>Log a purchase:</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            className="form-control mb-3"
            type="text"
            name="currentItem"
            placeholder="Item / note"
            onChange={this.handleChange}
            value={this.state.currentItem}
          />
          <input
            className="form-control mb-3"
            type="text"
            name="currentPrice"
            placeholder="Price"
            onChange={this.handleChange}
            value={this.state.currentPrice}
          />
          <select
            className="form-control mb-3"
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
          <button className="btn btn-primary">Add Item</button>
        </form>
      </section>
    )
  }
}

export default Home
