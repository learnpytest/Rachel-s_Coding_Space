import * as React from "react"
import { useState, useEffect } from "react"
import { Link } from "gatsby"
import Nav from "./nav"
import DiaglogNav from "./diaglogNav"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  // Nav loadable component will only show up when mouse scroll on browser
  // This function will use in useEffect to fullfil client side action
  const [state, setState] = useState({
    scrolled: false,
  })

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100
      if (isScrolled !== state.scrolled) {
        setState({
          scrolled: !state.scrolled,
        })
      }
    }
    document.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      document.removeEventListener("scroll", handleScroll)
    }
  }, [state.scrolled])

  if (isRootPath) {
    header = (
      <>
        <h1 className="main-heading">
          <Link to="/">{title}</Link>
        </h1>
        <div className="main-nav">
          <Nav />
        </div>
      </>
    )
  } else {
    header = (
        <div className={"header-link-page"}>
          <Link className="header-link-home" to="/">
            {title}
          </Link>
          <Nav />
        </div>
    )
  }

  return (
    <div
      className="global-wrapper"
      data-is-root-path={isRootPath} 
    >
      <header className="global-header" data-activescrolling={state.scrolled}>{header}<DiaglogNav /></header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
