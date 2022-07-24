import * as React from "react"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Bio from "../../components/bio"
import { graphql, Link } from "gatsby"

const Portfolio = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <div>
      <Layout location={location} title={siteTitle}>
        <Seo />
        <Bio />
        <h2>About me</h2>
        <p>
          Starting 2021, I took part in full-stack web development program which
          was held by ALPHA Camp, started my journey of JS programming. In
          addition to build interactive web app by utilizing React, Vue,
          Gatsby.js, Bootstrap, REST API, GraphQL, etc., I also have practical
          knowledge and experiences of database works by using MongoDB,
          Mongoose, Sequelize to MySQL, Firebase.
        </p>
        <p>
          Outside of work, I am a tennis player. I enjoy rock climbing and
          traveling to discover new landscapes and cultures.
        </p>
        <h2>Communities </h2>
        <p>
          {" "}
          Here are the technical communities that I have taken part in during my
          journey of learning web app development:
        </p>
        <ul>
          <li>
            <a href="https://discord.com/channels/925294714217967647/945255644271902721">
              ALPHA Camp
            </a>
          </li>
          <li>
            <a href="https://discord.com/channels/956136586154737685/956136586611949631">
              React / JS Study Club
            </a>
          </li>
        </ul>
        <h2>Personal Side projects</h2>
        <ul>
                    <li>
            <p>
              Web Blog - a web space for displaying my portfolio projects and sharing articles about web app coding such as Javascript、Vue、React.  This is booted by Gatsby.
              {" "}
              <Link to='/blog/gatsby-blog-starter'>Read More</Link>
            </p>
            <p>
              <Link to='/'>
                Homepage
              </Link>{" "}
              /
              <a href="https://github.com/learnpytest/Rachel-s_Coding_Space">
                Repository
              </a>
            </p>
          </li>
          <li>
            <p>
              Simple Twitter Clone - This app allows users to create tweets, react to tweets (like/unlike, add
              comments), get notifications of activities, and follow/unfollow
              other users. 
              {" "}
              <Link to='/blog/simple-twitter-clone'>Read More</Link>
            </p>
            <p>
              <a href="https://learnpytest.github.io/Front_End_Vue_Simple_Twitter/#/login">
                Homepage
              </a>{" "}
              /
              <a href="https://github.com/learnpytest/Front_End_Vue_Simple_Twitter">
                Repository
              </a>
            </p>
          </li>
          <li>
            <p>vii-message-window</p>
            <a href="https://www.npmjs.com/package/vii-message-window">
              NPM
            </a>
          </li>
        </ul>
      </Layout>
    </div>
  )
}

export default Portfolio

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
