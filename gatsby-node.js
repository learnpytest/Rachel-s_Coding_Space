const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const _ = require("lodash")

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  // Define a template for notion blog post
  const notionBlogPost = path.resolve(`./src/templates/notion-blog-post.js`)

  // Define a template for tag that has posts tagged with this
  const taggedPostsPage = path.resolve(`./src/templates/tag-page.js`)

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        markdownPosts: allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
          filter: { frontmatter: { slug: { nin: "blog/posts" } } }
        ) {
          nodes {
            id
            fields {
              slug
            }
            timeToRead
          }
        }
        notionPosts: allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
          filter: { frontmatter: { slug: { eq: "blog/posts" } } }
        ) {
          nodes {
            id
            timeToRead
            frontmatter {
              title
            }
          }
        }
        tagsGroup: allMarkdownRemark(limit: 2000) {
          group(field: frontmatter___tags) {
            fieldValue
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.markdownPosts.nodes
  const notionPosts = result.data.notionPosts.nodes
  const tagsGroup = result.data.tagsGroup.group

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields?.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
          timeToRead: post.timeToRead,
        },
      })
    })
  }

  // Create notion posts pages
  // But only if there's at least one article found at notion source site (import by notion api)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (notionPosts.length > 0) {
    notionPosts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : notionPosts[index - 1].id
      const nextPostId =
        index === notionPosts.length - 1 ? null : notionPosts[index + 1].id
      const postPath = post.frontmatter?.title
        ? post.frontmatter?.title
        : post.id

      createPage({
        path: "blog/" + postPath,
        component: notionBlogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
          timeToRead: post.timeToRead,
        },
      })
    })
  }

  // Create pages that are already categorized by tags
  // But only if there's at least one tag found at tag group
  // `context` is available in the template as a prop and as a variable in GraphQL
  if (tagsGroup.length > 0) {
    let newTagsGroup = []
    tagsGroup.forEach(tags => {
      const tagsArray = tags.fieldValue.split(",")
      newTagsGroup = [...new Set([...tagsArray, ...newTagsGroup])]
    })

    newTagsGroup.forEach(tag => {
      createPage({
        path: `/categories/${_.kebabCase(tag)}/`,
        component: taggedPostsPage,
        context: {
          tag: `/${tag}/`,
        },
      })
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  let value
  if (node.internal.type === `MarkdownRemark`) {
    if (node.frontmatter?.slug === `blog/posts`) {
      value = ""
    } else {
      value = createFilePath({ node, getNode }) || ""
    }

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
      nav: Nav
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type Nav {
      portfolio: String
      blog: String
      categories: String
    }

    type MarkdownRemark implements Node{
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      tags: String
    }

    type Fields {
      slug: String
    }
  `)
}
