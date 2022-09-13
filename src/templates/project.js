import * as React from "react"
import { graphql, Link } from "gatsby"
import BlockContent from "@sanity/block-content-to-react"

import Layout from "../components/layout"
import Seo from "../components/seo"

import { GatsbyImage } from "gatsby-plugin-image"

import * as projectStyle from "./project.module.css"

const Project = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const project = data.sanityProject

  if (!project) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="Project" />
        <p>
          No project information found. Add project information to the sanity
          project you specified.
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Project" />
      <GatsbyImage
        image={project.image.asset.gatsbyImageData}
        alt={project.title}
      />
      <h2>{project.title.trim() || "No Title"}</h2>
      <BlockContent
        blocks={project.body}
        projectId="264x5s83"
        dataset="production"
      />
      <Link to="/">Back To Home</Link>
    </Layout>
  )
}

export default Project

export const projectQuery = graphql`
  query ($slug: String) {
    site {
      siteMetadata {
        title
      }
    }
    sanityProject(slug: { current: { eq: $slug } }) {
      title
      body {
        children {
          text
          _type
          _key
        }
        _type
      }
      image {
        asset {
          gatsbyImageData(fit: FILLMAX, placeholder: BLURRED)
        }
      }
    }
  }
`
