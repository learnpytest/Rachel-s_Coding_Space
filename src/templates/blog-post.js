import * as React from "react"
import { Link, graphql } from "gatsby"
import { DiscussionEmbed } from "disqus-react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from "@mdx-js/react"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import PictureBySharp from "../components/PictureBySharp"
import * as blogPostStyle from "./blog-post.module.css"
import kebabCase from "lodash/kebabCase"

const BlogPostTemplate = ({ data, location, pageContext }) => {
  const [state, setState] = React.useState({
    scrolled: false,
  })

  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 500
      if (isScrolled !== state.scrolled) {
        setState({
          scrolled: !state.scrolled,
        })
      }
    }
    document.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      document.removeEventListener("scroll", handleScroll)
    }
  }, [state.scrolled])

  const post = data.mdx
  const remoteFileNodeId = post?.fields?.remoteFileNodeId
  // const postMdx = data.mdx

  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data
  const previousPath =
    previous?.frontmatter.source === `notion`
      ? `/blog/${kebabCase(previous?.frontmatter.slug)}`
      : `/${kebabCase(previous?.frontmatter.slug)}`
  const nextPath =
    next?.frontmatter.source === `notion`
      ? `/blog/${kebabCase(next?.frontmatter.slug)}`
      : `/${kebabCase(next?.frontmatter.slug)}`
  const { timeToRead } = pageContext

  const disqusConfig = {
    shortname: process.env.GATSBY_DISQUS_NAME,
    config: { identifier: post.frontmatter.slug },
  }

  const components = {
    PictureBySharp: props => (
      <PictureBySharp {...props} remoteFileNodeId={remoteFileNodeId} />
    ),
  }

  return (
    <>
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
          <section itemProp="articleBody">
            <MDXProvider components={components}>
              <MDXRenderer>{post.body}</MDXRenderer>
            </MDXProvider>
          </section>
          <hr />
          <footer>
            <Bio />
          </footer>
        </article>
        <nav>
          <ul className={blogPostStyle.blogPostPointerNav}>
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
        {state.scrolled && <DiscussionEmbed {...disqusConfig} />}
      </Layout>
    </>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $previousPostId: String
    $nextPostId: String
    $slug: String
  ) {
    site {
      siteMetadata {
        title
      }
    }

    mdx(frontmatter: { slug: { eq: $slug } }) {
      id
      frontmatter {
        title
        createdAt(formatString: "MMMM DD, YYYY")
        description
        slug
      }
      fields {
        remoteFileNodeId
      }
      body
    }
    previous: mdx(id: { eq: $previousPostId }) {
      frontmatter {
        title
        source
        slug
      }
    }
    next: mdx(id: { eq: $nextPostId }) {
      frontmatter {
        title
        source
        slug
      }
    }
  }
`
