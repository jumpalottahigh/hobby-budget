import React, { Component, Fragment } from 'react'
import Moment from 'react-moment'
import firebase from '../../firebase'
import styled from 'styled-components'
import Button from '../Button/Button'

const Container = styled.section`
  padding: 2rem 1rem;
`

export default class Charts extends Component {
  constructor() {
    super()
    this.state = {
      items: [],
      filteredItems: [],
      allCategories: [],
      allYears: []
    }
  }

  handleFilterByCategory = e => {
    let cat = e.target.dataset.category
    let filteredItems = []

    if (cat !== 'none') {
      filteredItems = this.state.items.filter(item => item.category === cat)
    }

    this.setState({
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
      filteredItems
    })
  }

  componentWillMount = () => {
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
        <Container>Chart1</Container>
        <Container>Chart2</Container>
      </Fragment>
    )
  }
}
