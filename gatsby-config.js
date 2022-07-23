require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const striptags = require("striptags")

const blogAlgoliaQuery = `
  query {
    pages: allMarkdownRemark(limit: 1000) {
      nodes {
        id
        excerpt
        frontmatter {
          title
          date: createdAt(formatString: "MMMM DD, YYYY")
          description
          source
          slug
        }
        html
      }
    }
  }
`
const queries = [
  {
    query: blogAlgoliaQuery,
    transformer: ({ data }) => {
      // 1 break each post into an array of searchable chunks
      // 2 return a flattened array of all indices
      return data.pages.nodes.reduce((indices, post) => {
        // 1 description (if it exists)
        // 2 each paragraph
        const paragraphChunks = striptags(post.html, ["\n"])
          .split("\n")
          .filter(
            paragraphChunk =>
              !!paragraphChunk.trim() && paragraphChunk.trim() !== "\n"
          )

   

        const chunks = paragraphChunks.map((chnk, index) => ({
          id: post.id + index,
          slug: post.frontmatter.slug,
          date: post.frontmatter.date,
          title: post.frontmatter.title,
          source: post.frontmatter.source,
          excerpt: chnk,
        }))

        if (post.frontmatter.description) {
          chunks.push({
            id: post.id + new Date().getTime(),
            slug: post.frontmatter.slug,
            date: post.frontmatter.date,
            title: post.frontmatter.title,
            source: post.frontmatter.source,
            excerpt: post.excerpt,
          })
        }

        const filtered = chunks.filter(chnk => !!chnk.excerpt)

        return [...indices, ...filtered]
      }, [])
    },
  },
]

module.exports = {
  siteMetadata: {
    title: `Rachel's coding space`,
    author: {
      name: `Rachel Chen`,
      summary: `who lives and works in Taipei, Taiwan.`,
    },
    description: `A web space for displaying portfolio projects showcase and sharing articles about web app coding such as Javascript、Vue、React.`,
    siteUrl: `https://gatsbystarterblogsource.gatsbyjs.io/`,
    social: {
      twitter: `rachelchen`,
      instagram: `rachelchen8788`,
    },
    nav: {
      portfolio: `Portfolio`,
      blog: `Blog`,
      categories: `Categories`,
      rss: `RSS File`,
    },
  },
  plugins: [
    `gatsby-plugin-preact`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-notion-api`,
      options: {
        token: process.env.GATSBY_INTEGRATION_TOKEN,
        databaseId: process.env.GATSBY_DATABASE_ID,
        propsToFrontmatter: true,
        lowerTitleLevel: true,
      },
    },
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.ALGOLIA_APP_ID,
        // Use Admin API key without GATSBY_ prefix, so that the key isn't exposed in the application
        // Tip: use Search API key with GATSBY_ prefix to access the service from within components
        apiKey: process.env.ALGOLIA_API_KEY,
        indexName: process.env.ALGOLIA_INDEX_NAME, // for all queries
        queries,
        chunkSize: 10000, // default: 1000
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `remark-image-load`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
              withWebp: true,
              showCaptions: true,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          // `remark-code-block`,
          // `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-remark-images`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          quality: 70,
          formats: ["auto", "webp", "avif"],
          placeholder: "blurred",
          breakpoints: [750, 1080, 1366, 1920],
        },
      },
    },
    `gatsby-transformer-sharp`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: `ADD YOUR TRACKING ID HERE`,
    //   },
    // },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          `remark-image-load`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
              withWebp: true,
              showCaptions: true,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.createdAt,
                  url: site.siteMetadata.siteUrl + node.frontmatter.slug,
                  guid: site.siteMetadata.siteUrl + node.frontmatter.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___createdAt] },
                ) {
                  nodes {
                    excerpt
                    html
                    frontmatter {
                      title
                      createdAt
                      slug
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Gatsby Starter Blog RSS Feed",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter Blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-react-helmet`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    // {
    //   resolve: `gatsby-plugin-schema-snapshot`,
    //   options: {
    //     path: `schema.gql`,
    //     update: process.env.GATSBY_UPDATE_SCHEMA_SNAPSHOT,
    //   },
    // },
    `gatsby-plugin-webpack-bundle-analyser-v2`,
    `gatsby-plugin-perf-budgets`,
  ],
}
