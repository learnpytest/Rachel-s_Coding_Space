import * as React from "react"
import { useState, useEffect } from "react"
import { Link } from "gatsby"

import Nav from "./nav"
import DialogHeader from "./dialogHeader"
import { Helmet } from "react-helmet"

import * as layoutStyle from "./layout.module.css"

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
      <div>
        <h1 className={`${layoutStyle.mainHeading}`}>
          <Link to="/">{title}</Link>
        </h1>
        <Nav />
      </div>
    )
  } else {
    header = (
      <div>
        <Link className={`${layoutStyle.headerLinkHome}`} to="/">
          {title}
        </Link>
        <Nav />
      </div>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=MonteCarlo&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <header className="global-header" data-activescrolling={state.scrolled}>
        {header}
        <DialogHeader />
      </header>
      <main>{children}</main>
      <footer style={{textAlign: "center"}}>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>{" "}•{" "}
        <a href="https://www.pinterest.com/">Image Source</a>
      </footer>
    </div>
  )
}

export default Layout
