import React, { Component } from 'react'
import Moment from 'react-moment'

export default class Card extends Component {
  render() {
    const { id, category, timestamp, name, price } = this.props

    return (
      <div
        className="card"
        data-category={category}
        data-date={timestamp}
        data-id={id}
        data-name={name}
        data-price={price}
      >
        <h5 className={`badge ${category}`}>
          {category}
          <span
            role="img"
            aria-label="delete"
            data-id={id}
            onClick={this.props.handleDelete}
          >
            🗑️
          </span>
        </h5>
        <h5>{name}</h5>
        <p>
          Price: {price} | Date:{' '}
          <Moment format="Do MMM YYYY">{timestamp}</Moment>
        </p>
      </div>
    )
  }
}
