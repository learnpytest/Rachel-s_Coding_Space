// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"
// normalize CSS across browsers
import "./src/normalize.css"
// custom CSS styles
import "./src/style.css"
import "./src/style/remark-copy.css"

// Highlighting for code blocks
import "prismjs/themes/prism-okaidia.css"

import React from "react"
import { MDXProvider } from "@mdx-js/react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
const Alert = ({ title, type, children }) => {
  return (
    <div className={`alert alert-${type}`}>
      <h4 className={type}>{title}</h4>
      {children}
    </div>
  )
}

// const Image = ({ alt}) => {
//   return (
//           <StaticImage quality={95} width={550} height={550} layout="fixed" formats={["auto", "webp", "avif", "png"]} alt={alt}/>
//   )
// }
const components = {
    Alert,
GatsbyImage: (props) => {
  return <GatsbyImage {...props} getImage={getImage}/>
}

}

export const onClientEntry = () => {
  window.getRemarkCopiedText = (text, element) => {
    if (element.textContent === "Copied!") return
    window.navigator.clipboard.writeText(text)
    element.textContent = "Copied!"
    setTimeout(() => {
      element.textContent = "Copy"
    }, 5000)
  }
}

export const wrapRootElement = ({ element }) => {
  return <MDXProvider components={components}>{element}</MDXProvider>
}
