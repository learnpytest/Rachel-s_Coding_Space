import * as React from "react"
import { graphql, Link } from "gatsby"

import Bio from "../../components/bio"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import AlgoliaSearchSite from "../../components/algoliaSearchSite"

import * as indexStyle from "../index.module.css"
import kebabCase from "lodash/kebabCase"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      <Bio />
      <AlgoliaSearchSite />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || "NoTitle"

          return (
            <li key={post.id} style={{ position: "relative" }}>
              <article
                className={`${indexStyle.postListItem}`}
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                      <span itemProp="headline">{title}</span>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
         
              <Link
                to={`/blog/${kebabCase(post.fields?.slug)}`}
                itemProp="url"
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: "-10px",
                  bottom: "-10px",
                  right: "-10px",
                }}
                className="backdrop"
              ></Link>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

export const blogQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___createdAt], order: DESC }
      filter: { frontmatter: { source: { in: "notion" } } }
    ) {
      nodes {
        id
        excerpt
        fields {
          slug
        }
        frontmatter {
          date: createdAt(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
