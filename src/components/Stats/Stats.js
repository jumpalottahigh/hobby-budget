import React, { Component, Fragment } from 'react'
import Moment from 'react-moment'
import firebase from '../../firebase'
import styled from 'styled-components'

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
      items: []
    }
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
        </section>
        <CardHolder>
          {this.state.items
            .slice(0)
            .reverse()
            .map(item => {
              return (
                <div
                  key={item.id}
                  className="card"
                  data-category={item.category}
                  data-date={item.timestamp}
                  data-name={item.name}
                  data-price={item.price}
                >
                  <h5 className={`badge ${item.category}`}>{item.category}</h5>
                  <h5>{item.name}</h5>
                  <p>
                    Price: {item.price} | Date:{' '}
                    <Moment format="Do MMM YYYY">{item.timestamp}</Moment>
                  </p>
                </div>
              )
            })}
        </CardHolder>
      </Fragment>
    )
  }
}
