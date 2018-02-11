import React, { Component, Fragment } from 'react'
import Moment from 'react-moment'
import firebase from '../../firebase'
import styled from 'styled-components'
import Button from '../Button/Button'

import './Stats.css'

const CardHolder = styled.section`
  grid-gap: 20px;
  padding-top: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

export default class Stats extends Component {
  constructor() {
    super()
    this.state = {
      configStartingDate: '',
      items: [],
      displayItems: false
    }
  }

  // filterLastMonth = () => {
  //   const itemsRef = firebase.database().ref('items')

  //   itemsRef
  //     .orderByChild('category')
  //     .limitToLast(10)
  //     .on('value', snap => {
  //       console.log(snap.val())
  //     })
  // }

  handleDelete = e => {
    const key = e.target.dataset.id
    const confirmed = window.confirm(
      'Are you sure you want to delete this item?'
    )

    if (confirmed) {
      const itemsRef = firebase.database().ref('items')
      itemsRef.child(key).remove()
    }
  }

  handleShowAllItems = () => {
    let opposite = !this.state.displayItems

    this.setState({
      displayItems: opposite
    })
  }

  componentWillMount = () => {
    // Get starting date
    const configRef = firebase.database().ref('config')
    configRef.on('value', snapshot => {
      let config = snapshot.val()

      this.setState({
        configStartingDate: config.startingDate
      })
    })

    // Get all purchases
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
      <Fragment>
        <section>
          {this.state.configStartingDate && (
            <h4>
              Data collected since:{' '}
              <Moment
                date={this.state.configStartingDate}
                format="Do MMM YYYY"
              />
            </h4>
          )}
          <Button onClick={this.handleShowAllItems}>
            {this.state.displayItems ? 'Hide ' : 'Show '}All Purchases
          </Button>
          {/* <Button onClick={this.filterLastMonth}>Show last month</Button> */}
        </section>
        {this.state.displayItems ? (
          <CardHolder>
            <h2>All purchases:</h2>
            {this.state.items
              .slice(0)
              .reverse()
              .map(item => {
                console.log('runs')
                return (
                  <div
                    key={item.id}
                    className="card"
                    data-category={item.category}
                    data-date={item.timestamp}
                    data-id={item.id}
                    data-name={item.name}
                    data-price={item.price}
                  >
                    <h5 className={`badge ${item.category}`}>
                      {item.category}
                      <span
                        role="img"
                        aria-label="delete"
                        data-id={item.id}
                        onClick={this.handleDelete}
                      >
                        🗑️
                      </span>
                    </h5>
                    <h5>{item.name}</h5>
                    <p>
                      Price: {item.price} | Date:{' '}
                      <Moment format="Do MMM YYYY">{item.timestamp}</Moment>
                    </p>
                  </div>
                )
              })}
          </CardHolder>
        ) : null}
      </Fragment>
    )
  }
}
