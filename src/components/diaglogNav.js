/**
 * DiaglogNav component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import Nav from "./nav"
import { Link } from "gatsby"

const DiaglogNav = () => {
  return (
    <div className={"header-diaglog"}>
      <Link className="header-link-home" to="/">
        Home page
      </Link>
      <Nav />
    </div>
  )
}

export default DiaglogNav
