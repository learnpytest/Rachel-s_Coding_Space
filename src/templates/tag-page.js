import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Bio from "../components/bio"

import * as tagPostStyle from "./tag-post.module.css"
import kebabCase from "lodash/kebabCase"

const tagPage = ({ pageContext, data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const { tag } = pageContext
  const tagName = tag.replace(/\//g, "")
  const { group, totalCount } = data.allMarkdownRemark
  const tagText = `${totalCount} articles ${
    totalCount === 1 ? "is" : "s are"
  } associated with this category.`

  return (
    <Layout location={location} site={siteTitle}>
      <Seo />
      <Bio />
      <div className={`${tagPostStyle.category}`}>
        <header>
          <h2>
            {tagName} <small className="text">Category - </small>{" "}
            <small>{tagText}</small>
          </h2>
        </header>

        <section>
          {group.length &&
            group.reverse().map(({ nodes, fieldValue }) => {
              return (
                <div>
                  <h3 className="fieldYear">{fieldValue}</h3>
                  <ul>
                    {nodes.length &&
                      nodes.map(({ frontmatter, fields }) => {
                        const {title, createdAt, source} = frontmatter
                        const { slug } = fields
                        const path = source === `notion` ? `/blog/${kebabCase(slug)}` : `/${kebabCase(slug)}`
                        return (
                          <li key={title}>
                            <Link to={path}>
                              {createdAt} - {title ? title : `No Title`}
                            </Link>
                          </li>
                        )
                      })}
                  </ul>
                </div>
              )
            })}
        </section>
      </div>
      <Link to="/categories">All categories</Link>
    </Layout>
  )
}

export default tagPage

export const tagQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(
      limit: 2000
      sort: { fields: [frontmatter___createdAt], order: DESC }
      filter: { frontmatter: { tags: { regex: $tag } } }
    ) {
      totalCount
      group(field: frontmatter___year) {
        fieldValue
        nodes {
          frontmatter {
            title
            createdAt(formatString: "MM-DD")
            source
          }
        }
      }
    }
  }
`
