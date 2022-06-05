/**
 * DiaglogNav component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import Nav from "./nav"
import { Link } from "gatsby"

import * as dialogHeader from "./dialog-header.module.css"

const DiaglogNav = () => {
  return (
    <div className={`${dialogHeader.dialog} dialog-header`}>
      <Link className={dialogHeader.headerLinkHome} to="/">
        Home page
      </Link>
      <Nav className="dialog-nav"/>
    </div>
  )
}

export default DiaglogNav
