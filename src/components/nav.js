/**
 * Nav component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import kebabCase from "lodash/kebabCase"

const Nav = () => {
  const data = useStaticQuery(graphql`
    query NavQuery {
      site {
        siteMetadata {
          nav {
            portfolio
            blog
            categories
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const navLinks = data.site.siteMetadata?.nav || ""

  return (
    <>
      {navLinks && (
        <ul className="nav-list" style={{ listStyle: `none` }}>
          {Object.entries(navLinks).map(([key, value]) => {
            return (
              <li key={key}>
                <Link
                  to={`/${kebabCase(value)}`}
                  activeStyle={{
                    color: "#7F1C06",
                    textDecoration: "none",
                  }}
                  partiallyActive={true}
                >
                  {value}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

export default Nav
