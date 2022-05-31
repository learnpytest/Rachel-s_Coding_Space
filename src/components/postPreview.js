import * as React from "react"
import { Link } from "gatsby"
import { Highlight } from "react-instantsearch-hooks-web"

import kebabCase from "lodash/kebabCase"

export function PostPreview ({ hit }) {
  //  const title = hit.title || "NoTitle"
  const { source, slug } = hit
  const path = source === `notion` ? `/blog/${kebabCase(slug)}` : `/${kebabCase(slug)}`

  return (
    <div style={{ position: "relative" }}>
      <article
        className="post-list-item"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h2>
            <span itemProp="headline">
               <Highlight hit={hit} attribute="title"/>
            </span>
          </h2>
        </header>
        <section>
          <p>
            <Highlight hit={hit} attribute="excerpt"/>
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
