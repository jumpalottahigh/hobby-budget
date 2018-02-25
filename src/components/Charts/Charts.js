import React, { Component, Fragment } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import firebase from '../../firebase'
import styled from 'styled-components'

const Container = styled.section``

export default class Charts extends Component {
  constructor() {
    super()
    this.state = {
      items: [],
      filteredItems: [],
      allCategories: [],
      allYears: [],
      totalSpendings: 0,
      chartData: {},
      chartOptions: {}
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

  updateChartModel() {
    let labels = []
    let data = []
    let backgroundColor = []
    let currentCategoryTotal = 0

    // Go over all categories
    this.state.allCategories.forEach(category => {
      // Filter by current category and reduce the array into a total sum
      currentCategoryTotal = this.state.items
        .filter(item => item.category === category)
        .reduce((total, current) => total + parseFloat(current.price), 0)
      // Populate chart data, labels and bg colors
      data.push(currentCategoryTotal.toFixed(2))
      labels.push(category)
      backgroundColor.push(
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.6)`
      )
    })

    this.setState({
      // Chart data object is required
      chartData: {
        labels,
        datasets: [
          {
            data,
            backgroundColor
          }
        ]
      },
      // This object is customizable and not required to display the chart
      chartOptions: {
        title: {
          display: true,
          text: `Total spendings by category`
        }
      }
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
      let totalSpendings = 0

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

        // Get total money spent
        totalSpendings += parseFloat(price)
      }

      // Sort categories alphabetically
      allCategories.sort()

      this.setState(
        {
          items: newState,
          allCategories,
          allYears,
          totalSpendings: totalSpendings.toFixed(2)
        },
        () => this.updateChartModel()
      )
    })
  }

  render() {
    return (
      <Fragment>
        <Container>
          {this.state.totalSpendings && (
            <h2>Total spendings: {this.state.totalSpendings}</h2>
          )}
          <Pie data={this.state.chartData} options={this.state.chartOptions} />
        </Container>
        <Container>
          <Bar
            data={this.state.chartData}
            options={{ legend: { display: false } }}
          />
        </Container>
      </Fragment>
    )
  }
}
