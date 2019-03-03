import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import './index.css'

const query = graphql`
  query SiteTitle {
    site {
      siteMetadata {
        title
      }
    }
  }
`

const Layout = ({ children }) => {
  const data = useStaticQuery(query)

  return (
    <React.Fragment>
      <h1>{data.site.siteMetadata.title}</h1>
      {children}
    </React.Fragment>
  )
}

export default Layout
