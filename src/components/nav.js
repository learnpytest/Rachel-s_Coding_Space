/**
 * Nav component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import * as navStyle from "./nav.module.css"
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
            rss
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
        <ul className={navStyle.mainNavList} style={{ listStyle: `none` }}>
          {Object.entries(navLinks).map(([key, value]) => {
            const path = value === `RSS File` ? `rss.xml` : kebabCase(value)            
            return (
              <li key={key} className={`${navStyle.mainNavItem} main-nav-item`}>
                <Link
                  to={`/${path}`}
                  activeStyle={{
                    color: "#7F1C06",
                    textDecoration: "none",
                  }}
                  partiallyActive={true}
                  className={navStyle.mainNavLink}
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
