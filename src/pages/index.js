import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AlgoliaSearchSite from "../components/algoliaSearchSite"

import * as indexStyle from "./index.module.css"

const PageIndex = ({ data, location }) => {
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
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug} style={{position: "relative"}}>
              <article
                className={`${indexStyle.postListItem}`}
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.createdAt}</small>
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
              <Link to={post.fields.slug} itemProp="url" style={{position: "absolute", top: "-10px", left: "-10px", bottom: "-10px", right: "-10px"}} className="backdrop"></Link>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default PageIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___createdAt], order: DESC }
      filter: {frontmatter: {source: {nin: "notion"}}}
      ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          createdAt(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
