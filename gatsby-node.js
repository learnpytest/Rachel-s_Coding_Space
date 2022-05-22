const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  // Define a template for notion blog post
  const notionBlogPost = path.resolve(`./src/templates/notion-blog-post.js`)


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

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields.slug,
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
      const nextPostId = index === notionPosts.length - 1 ? null : notionPosts[index + 1].id
      
      createPage({
        path: "blog/" + post.frontmatter?.title,
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
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark` && node.frontmatter?.slug !== `blog/posts`) {
    const value = createFilePath({ node, getNode })

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
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
