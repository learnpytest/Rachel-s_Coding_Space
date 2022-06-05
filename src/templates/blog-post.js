import * as React from "react"
import { Link, graphql } from "gatsby"
import { DiscussionEmbed } from "disqus-react"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

import * as blogPostStyle from "./blog-post.module.css"
import kebabCase from "lodash/kebabCase"

const BlogPostTemplate = ({ data, location, pageContext }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data
  const previousPath = previous?.frontmatter.source === `notion` ? `/blog/${kebabCase(previous?.fields.slug)}` : `/${kebabCase(previous?.fields.slug)}`
  const nextPath = next?.frontmatter.source === `notion` ? `/blog/${kebabCase(next?.fields.slug)}` : `/${kebabCase(next?.fields.slug)}`
  const { timeToRead } = pageContext

  const disqusConfig = {
    shortname: process.env.GATSBY_DISQUS_NAME,
    config: { identifier: post.id },
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article
        className={`${blogPostStyle.blogPost} blog-post`}
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>
            {post.frontmatter.createdAt} - {timeToRead} mins to read
          </p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav>
        <ul className={blogPostStyle.blogPostPointerNav}
        >
          <li className={blogPostStyle.blogPointer}>
            {previous && (
              <Link to={previousPath} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li className={blogPostStyle.blogPointer}>
            {next && (
              <Link to={nextPath} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
      <DiscussionEmbed {...disqusConfig} />
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        createdAt(formatString: "MMMM DD, YYYY")
        description
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
        source
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
        source
      }
    }
  }
`
