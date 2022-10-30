import * as React from "react"
import { Link } from "gatsby"
import { Highlight } from "react-instantsearch-hooks-web"

import * as postPreview from "./post-preview.module.css"
import kebabCase from "lodash/kebabCase"

export function PostPreview ({ hit }) {
  //  const title = hit.title || "NoTitle"
  const { source, slug } = hit
  const path = source === `notion` ? `/blog/${kebabCase(slug)}` : `/${kebabCase(slug)}`
  return (
    <div style={{ position: "relative" }}>
      <article
        className={postPreview.postListItem}
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h2 className={postPreview.title}>
            <span itemProp="headline">
               <Highlight hit={hit} attribute="title"/>
            </span>
          </h2>
        </header>
        <section>
          <p className={postPreview.text}>
            <Highlight hit={hit} attribute="excerpt" className={postPreview.aisHighlight}/>
          </p>
        </section>
      </article>

      <Link
        to={path}
        itemProp="url"
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          bottom: "0px",
          right: "0px",
          zIndex: "3",
        }}
        className="backdrop"
      >
                
      </Link>
    </div>
  )
}
