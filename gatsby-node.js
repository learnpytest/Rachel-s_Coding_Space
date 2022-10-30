const path = require(`path`)
const {
  createFilePath,
  createRemoteFileNode,
} = require(`gatsby-source-filesystem`)
const _ = require("lodash")

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  //   // Define a template for project
  const projectPage = path.resolve(`./src/templates/project.js`)

  //   // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  //   // Define a template for tag that has posts tagged with this
  const taggedPostsPage = path.resolve(`./src/templates/tag-page.js`)

  //   // Get all markdown blog posts sorted by date
  let result

  result = await graphql(
    `
      {
        allSanityProject {
          edges {
            node {
              slug {
                current
              }
            }
          }
        }
        postsFromNotion: allMdx(
          sort: { fields: [frontmatter___createdAt], order: DESC }
          filter: { frontmatter: { source: { in: "notion" } } }
          limit: 1000
        ) {
          nodes {
            id
            timeToRead
            frontmatter {
              title
              slug
              source
            }
          }
        }
        postsNotFromNotion: allMdx(
          sort: { fields: [frontmatter___createdAt], order: DESC }
          filter: { frontmatter: { source: { nin: "notion" } } }
          limit: 1000
        ) {
          nodes {
            id
            timeToRead
            frontmatter {
              title
              slug
              source
            }
          }
        }
        tagsGroup: allMdx(limit: 2000) {
          group(field: frontmatter___tags) {
            fieldValue
          }
        }
      }
    `
  )

  try {
    if (result.errors) {
      reporter.panicOnBuild(
        `There was an error loading your blog posts`,
        result.errors
      )
      // return
    }
  } catch (err) {
    console.log(err)
  }
  const projects = result.data.allSanityProject.edges.map(({ node }) => node)
  const postsNotFromNotion = result.data.postsNotFromNotion.nodes
  const postsFromNotion = result.data.postsFromNotion.nodes
  const tagsGroup = result.data.tagsGroup.group

  //   // Create projects pages
  projects.forEach(project => {
    createPage({
      path: project.slug.current,
      component: projectPage, //
      context: {
        slug: project.slug.current,
      },
    })
  })

  //   // Create blog posts pages
  //   // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  //   // `context` is available in the template as a prop and as a variable in GraphQL

  function takeTemplateToCreatePage(_data, _pathPrefix) {
    if (!_data.length) return
    try {
      _data.forEach((post, index) => {
        const previousPostId = index === 0 ? null : _data[index - 1].id
        const nextPostId =
          index === _data.length - 1 ? null : _data[index + 1].id
        const path = `${_pathPrefix}/${_.kebabCase(post.frontmatter?.slug)}`

        createPage({
          path,
          component: blogPost,
          context: {
            previousPostId,
            nextPostId,
            slug: post.frontmatter?.slug,
            timeToRead: post.timeToRead,
          },
        })
      })
    } catch (err) {
      console.log("createPage error", err)
    }
  }

  takeTemplateToCreatePage(postsNotFromNotion, "")
  takeTemplateToCreatePage(postsFromNotion, "/blog")

  //   // Create pages that are already categorized by tags
  //   // But only if there's at least one tag found at tag group
  //   // `context` is available in the template as a prop and as a variable in GraphQL
  if (tagsGroup.length > 0) {
    let newTagsGroup = []
    tagsGroup.forEach(tags => {
      const tagsArray = tags.fieldValue.split(",")
      newTagsGroup = [...new Set([...tagsArray, ...newTagsGroup])]
    })

    newTagsGroup.forEach(tag => {
      createPage({
        path: `/categories/${_.kebabCase(tag)}`,
        component: taggedPostsPage,
        context: {
          tag: `/${tag}/`,
        },
      })
    })
  }
}

exports.onCreateNode = async ({
  node,
  actions,
  getNode,
  createNodeId,
  cache,
}) => {
  const { createNodeField, createNode } = actions
  let embeddedImagesRemote
  let remoteImageArray = []
  let value

  if (node.internal.type === `Mdx` && node.frontmatter) {
    if (node.frontmatter.source === `file`) {
      value = createFilePath({ node, getNode }) || ""
    } else {
      value = node.frontmatter.slug
    }
    if (node.frontmatter.embeddedImagesRemote) {
      remoteImageArray = [...node.frontmatter.embeddedImagesRemote.split(",")]

      if (remoteImageArray.length) {
        embeddedImagesRemote = await Promise.all(
          remoteImageArray.map(url => {
            try {
              return createRemoteFileNode({
                url,
                parentNodeId: node.id,
                createNode,
                createNodeId,
                cache,
              })
            } catch (error) {
              console.error(error)
            }
          })
        )

        await createNodeField({
          name: `remoteFileNodeId`,
          node,
          value: embeddedImagesRemote
            ? embeddedImagesRemote.map(image => image.children[0])
            : [],
        })
      }
    }
  }

  console.log("check node", node)
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
      rss: String
    }

    type Frontmatter {
      title: String
      createdAt: Date @dateformat
      year: String
      month: String
      description: String
      slug: String
      source: String
      tags: String
      embeddedImagesRemote: String
    }

    type Fields {
      remoteFileNodeId: [String]
    }
  `)
}
