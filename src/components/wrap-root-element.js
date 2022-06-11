import React from "react"
import { MDXProvider } from "@mdx-js/react"
import CodeNode from "./codeNode"
import AlertNode from "./alertNode"

const components = {
  Alert: AlertNode,
  pre: CodeNode,
  wrapper: ({children}) => (<>{children}</>)
}

export const wrapRootElement = ({ element }) => {
  return <MDXProvider components={components}>{element}</MDXProvider>
}