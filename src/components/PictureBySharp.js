import React from "react"
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image"
import { graphql, useStaticQuery } from "gatsby"

export default function PictureBySharp({ remoteFileNodeId, index, name, width, height, alt }) {
  let imgIndex
  let remoteFileId = ""
  const imgSharpSource = useStaticQuery(graphql`
  query sharpQuery {
    allImageSharp {
      nodes {
        id
        gatsbyImageData(placeholder: BLURRED, formats: AUTO)
      }
    }
  }
  `)

  const { nodes } = imgSharpSource?.allImageSharp

  if (name) {
    imgIndex = nodes.findIndex(node =>
      node.gatsbyImageData.images.fallback.src.endsWith(name)
    )
  } else if (remoteFileNodeId) {
    remoteFileId = remoteFileNodeId.length ? remoteFileNodeId[index] : null
    if (remoteFileId) {
      imgIndex = nodes.findIndex(node => node.id === remoteFileId)
    }
  }
  
  if (getImage(nodes[imgIndex])) {
    return (
      <div>
        <GatsbyImage image={getImage(nodes[imgIndex])} width={width || 200} height={height || 200} alt={alt || "文章圖片"} />
      </div>
    )
  } else {
    return (
      <div>
        Woops!
        <StaticImage
          className="bio-avatar"
          layout="fixed"
          formats={["auto", "webp", "avif"]}
          src="../images/profile.gif"
          width={200}
          height={200}
          quality={95}
          alt="Profile picture"
        />
      </div>
    )
  }
}
