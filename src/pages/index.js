import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AlgoliaSearchSite from "../components/algoliaSearchSite"

import { GatsbyImage } from "gatsby-plugin-image"

import * as indexStyle from "./index.module.css"

const PageIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const projects = data.allSanityProject?.edges

  if (projects.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All projects" />
        <Bio />
        <p>
          No projects found. Add project to the sanity project you specified for
          the "gatsby-source-sanity" plugin in gatsby-config.js.
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All projects" />
      <Bio />
      <AlgoliaSearchSite />
      <ul className={`${indexStyle.list}`}>
        {projects.map(({ node: project }) => {
          return (
            <div className={`${indexStyle.foldBox}`}>
              <div className={`${indexStyle.foldGroup}`}>
                <div className={`${indexStyle.foldItem}`}>
                  <div className={`${indexStyle.foldItem}`}>
                    <div className={`${indexStyle.foldItem}`}>
                      <div className={`${indexStyle.foldItem}`}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${indexStyle.text}`}>
                <li key={project.slug.current} className={`${indexStyle.item}`}>
                  <GatsbyImage
                    image={project.image.asset.gatsbyImageData}
                    alt={project.title}
                  />
                  <h3><Link to={project.slug.current}>{project.title}</Link></h3>
                </li>
              </div>
            </div>
          )
        })}
      </ul>
    </Layout>
  )
}

export default PageIndex

export const projectListQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allSanityProject {
      edges {
        node {
          title
          description
          slug {
            current
          }
          image {
            asset {
              gatsbyImageData(fit: FILLMAX, placeholder: BLURRED)
            }
          }
        }
      }
    }
  }
`