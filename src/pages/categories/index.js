import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../../components/bio"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import kebabCase from "lodash/kebabCase"

const TagsIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const tags = data.allMdx.group
  let newTagsGroup = []
  let tagCount = {}
  console.log("data", tags)

  const dataCounterByKey = (data, key) => {
    return data.reduce((previous, current) => {
      if (typeof tagCount[key] !== "number") {
        tagCount[key] = 0
      }
      if (current["fieldValue"].toLowerCase().includes(key.toLowerCase())) {
        tagCount[key] += current.totalCount
      }
    }, data[0])
  }

  if (tags.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All categories" />
        <Bio />
        <p>
          No tags found. Add markdown tags to "content/blog" (or the directory
          you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  tags.forEach(({ fieldValue }) => {
    const tagArray = fieldValue.split(",")
    newTagsGroup = [...new Set([...newTagsGroup, ...tagArray])]
  })

  newTagsGroup.forEach(key => {
    dataCounterByKey(tags, key)
  })

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All categories" />
      <Bio />
      <h2>Total {newTagsGroup.length} Categories</h2>
      <ul style={{ listStyle: `none` }}></ul>

      {newTagsGroup.map((tag, index) => {
        return (
          <li style={{ listStyle: `none`}} key={ tag }>
            <Link style={{ textDecoration: `none` }} to={kebabCase(tag)}>{ `${tag} (${tagCount[tag]})` }</Link>
          </li>
        )
      })}
    </Layout>
  )
}

export default TagsIndex

export const categoryQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`

