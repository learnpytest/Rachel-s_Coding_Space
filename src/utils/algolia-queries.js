const striptags = require('striptags')
const indexName = `Pages`

const pageQuery = `
  {
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
    projects: allSanityProject {
      edges {
        node {
          id
          title
          description
          body {
            children {
              text
            }
          }
          slug {
            current
          }
        }
      }
    }
  }
`

function pageToAlgoliaRecord(indices, post) {

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
}

function projectToAlgoliaRecord({node: {id, title, description, slug, body}}){
  return {
    objectID: id,
    title,
    description,
    text: body[0].children.map(({text}) => text).join(","),
    slug: slug.current
  }
}

const queries = [
  {
    query: pageQuery,
    transformer: ({data}) => data.pages.nodes.reduce(pageToAlgoliaRecord, []),
    indexName
  },
  {
    query: pageQuery,
    transformer: ({data}) => data.projects.edges.map(projectToAlgoliaRecord),
    indexName
  }
]

module.exports = queries