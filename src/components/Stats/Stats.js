import React, { Component, Fragment } from 'react'
import Moment from 'react-moment'
import firebase from '../../firebase'
import styled from 'styled-components'
import Button from '../Button/Button'

import Card from './Card/Card'

import './Stats.css'

const Container = styled.section`
  padding: 2rem 1rem;
  grid-template-columns: repeat(3, 1fr);

  h4 {
    grid-column: span 3;
  }

  @media (min-width: 991px) {
    grid-template-columns: repeat(6, 1fr);

    h4 {
      grid-column: span 6;
    }
  }
`

const CardHolder = styled.section`
  grid-gap: 20px;
  padding-top: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;

    h2 {
      grid-column: span 3;
    }
  }
`

export default class Stats extends Component {
  constructor() {
    super()
    this.state = {
      configStartingDate: '',
      items: [],
      currentFilter: '',
      filteredItems: [],
      allCategories: [],
      allYears: []
    }
  }

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

  handleFilterByCategory = e => {
    let cat = e.target.dataset.category
    let filteredItems = []

    if (cat !== 'none') {
      filteredItems = this.state.items.filter(item => item.category === cat)
    }

    this.setState({
      currentFilter: cat,
      filteredItems
    })
  }

  handleFilterByYear = e => {
    let year = new Date(e.target.dataset.timestamp).getFullYear()
    let filteredItems = []

    if (year !== 'none') {
      filteredItems = this.state.items.filter(
        item => new Date(item.timestamp).getFullYear() === year
      )
    }

    this.setState({
      currentFilter: year,
      filteredItems
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
      let allCategories = []
      let allYears = []

      for (let item in items) {
        // Extract short hands
        let { category, name, price, timestamp } = items[item]
        // Push all purchases to state
        newState.push({
          id: item,
          name,
          price,
          category,
          timestamp
        })

        // Get all categories
        if (!allCategories.includes(category)) {
          allCategories.push(category)
        }

        // Get all years
        let year = new Date(timestamp).getFullYear()
        if (!allYears.includes(year)) {
          allYears.push(year)
        }
      }

      // Sort categories alphabetically
      allCategories.sort()

      this.setState({
        items: newState,
        allCategories,
        allYears
      })
    })
  }

  render() {
    return (
      <Fragment>
        <Container>
          {this.state.configStartingDate && (
            <h4>
              Data collected since:{' '}
              <Moment
                date={this.state.configStartingDate}
                format="Do MMM YYYY"
              />
            </h4>
          )}
          {/* Filter by category */}
          {this.state.allCategories && (
            <Fragment>
              <h4>Filter by category:</h4>
              <Button
                className="none"
                data-category="none"
                onClick={this.handleFilterByCategory}
              >
                none
              </Button>
              {this.state.allCategories.map((cat, index) => (
                <Button
                  key={index}
                  className={cat}
                  data-category={cat}
                  onClick={this.handleFilterByCategory}
                >
                  {cat}
                </Button>
              ))}
            </Fragment>
          )}
          {/* Filter by year */}
          {this.state.allYears && (
            <Fragment>
              <h4>Filter by year:</h4>
              <Button data-timestamp="none" onClick={this.handleFilterByYear}>
                none
              </Button>
              {this.state.allYears.map((year, index) => (
                <Button
                  key={index}
                  data-timestamp={year}
                  onClick={this.handleFilterByYear}
                >
                  {year}
                </Button>
              ))}
            </Fragment>
          )}
        </Container>

        {/* If no filtered items, show all items */}
        {!this.state.filteredItems.length ? (
          <CardHolder>
            <h2>All purchases:</h2>
            {this.state.items
              .slice(0)
              .reverse()
              .map(item => {
                return (
                  <Card
                    key={item.id}
                    handleDelete={this.handleDelete}
                    {...item}
                  />
                )
              })}
          </CardHolder>
        ) : (
          <CardHolder>
            <h2>Filtered items: {this.state.currentFilter}</h2>
            {this.state.filteredItems
              .slice(0)
              .reverse()
              .map(item => {
                return (
                  <Card
                    key={item.id}
                    handleDelete={this.handleDelete}
                    {...item}
                  />
                )
              })}
          </CardHolder>
        )}
      </Fragment>
    )
  }
}
