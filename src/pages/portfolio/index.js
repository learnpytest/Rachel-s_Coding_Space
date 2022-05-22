import * as React from 'react'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import Bio from '../../components/bio'
import { graphql } from 'gatsby'

const Portfolio = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <div>
      <Layout location={location} title={siteTitle}>
        <Seo />
        <Bio />
      Coming soon.
      </ Layout>
      </div>
  )
}

export default Portfolio

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`