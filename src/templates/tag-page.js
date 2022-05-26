import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Bio from "../components/bio"

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
      <div className="category">
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
                      nodes.map(({ frontmatter }) => {
                        const {title, slug, createdAt, date} = frontmatter
                        const dateTime = createdAt || date
                        return (
                          <li key={title}>
                            <Link to={slug ? slug : `/blog/${title}`}>
                              {dateTime} - {title ? title : `No Title`}
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
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { regex: $tag } } }
    ) {
      totalCount
      group(field: frontmatter___year) {
        fieldValue
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
            createdAt(formatString: "MM-DD")
            date(formatString: "MM-DD")
          }
        }
      }
    }
  }
`
