// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"
// normalize CSS across browsers
import "./src/normalize.css"
// custom CSS styles
import "./src/style.css"
// import "./src/style/remark-copy.css"

// Highlighting for code blocks
// import "prismjs/themes/prism-okaidia.css"

import { wrapRootElement as wrapRoot } from "./src/components/wrap-root-element"

// export const onClientEntry = () => {
//   window.getRemarkCopiedText = (text, element) => {
//     if (element.textContent === "Copied!") return
//     window.navigator.clipboard.writeText(text)
//     element.textContent = "Copied!"
//     setTimeout(() => {
//       element.textContent = "Copy"
//     }, 5000)
//   }
// }

export const wrapRootElement = wrapRoot
