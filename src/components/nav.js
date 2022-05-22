/**
 * Nav component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'

const Nav = () => {
  const data = useStaticQuery(graphql`
      query NavQuery {
      site {
        siteMetadata {
          nav {
						portfolio
            blog
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const navLinks = data.site.siteMetadata?.nav || ''

  return (
    <>
      {navLinks && (
      <ul className='nav-list' style={{ listStyle: `none` }}>
        <li><Link to={`/${navLinks.portfolio}`} activeStyle={{ color: "#7F1C06", cursor: "auto", textDecoration: "none" }} partiallyActive={true}>{navLinks.portfolio}</Link></li>
        <li><Link to={`/${navLinks.blog}`} activeStyle={{ color: "#7F1C06", cursor: "auto", textDecoration: "none" }} partiallyActive={true}>{navLinks.blog}</Link></li>
      </ul>
      )}
    </>
  )
}

export default Nav