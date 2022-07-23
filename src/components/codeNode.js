import React, { useState } from "react"
import Highlight, { defaultProps } from "prism-react-renderer"
import rangeParser from "parse-numeric-range"

import * as codeNodeStyle from "./code-node.module.css"

const CodeNode = props => {
  const [copyState, setCopyState] = useState("Copy")

  const className = props.children.props.className || ""
  const code = props.children.props.children.trim()
  const language = className.replace(/language-/, "")
  const file = props.children.props.file
  const rawToHighlights = props.children.props.highlights || ""
  const getRowsTohightlight = rawToHighlights => {
    const rowNumbers = rangeParser(rawToHighlights)
    if (rowNumbers) {
      return index => rowNumbers.includes(index + 1)
    } else {
      return () => false
    }
  }

  const hightlightRows = getRowsTohightlight(rawToHighlights)

  const getCopiedText = ({ target }) => {
    if (target.value === "Copied!") return
    window.navigator.clipboard.writeText(code)
    setCopyState("Copied!")
    setTimeout(() => {
      setCopyState("Copy")
    }, 5000)
  }

  return (
    <div className={codeNodeStyle.codeNode}>
      <Highlight {...defaultProps} code={code} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          style.padding = "0 1em 1em 1em"
          style.borderRadius = "8px"
          return (
            <pre className={className} style={style}>
              <header className={codeNodeStyle.codeHeader}>
                <div className={codeNodeStyle.text}>
                  <div className={codeNodeStyle.language}>
                    {language || "unknown language"}
                  </div>
                  {
                    <div className={codeNodeStyle.file}>
                      {file && `${file}`}
                    </div>
                  }
                </div>
                <div className={codeNodeStyle.buttonGroup}>
                  <button className={codeNodeStyle.btn} onClick={getCopiedText}>
                    {copyState}
                  </button>
                </div>
              </header>
              <div className={codeNodeStyle.codeBody}>
                {tokens.map((line, i) => {
                  return (
                    <div
                      {...getLineProps({ line, key: i })}
                      style={{
                        background: hightlightRows(i)
                          ? "#FFD68A"
                          : "transparent",
                        opacity: "0.9",
                        color: hightlightRows(i) && "#2A2734",
                      }}
                      className={codeNodeStyle.codeLine}
                    >
                      {line.map((token, key) => {
                        return <span {...getTokenProps({ token, key })}></span>
                      })}
                    </div>
                  )
                })}
              </div>
            </pre>
          )
        }}
      </Highlight>
    </div>
  )
}

export default CodeNode
