import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const About = () => {
  return (
    <div className="about-container">
      <Link to="/" className="back-link">← Back to Home</Link>
      <div className="about-image-wrapper">
        <StaticImage
          className="about-avatar"
          layout="fixed"
          formats={["auto", "webp", "avif"]}
          src="../images/about_prof.jpg"
          width={300} // Reduced slightly for better balance
          height={300}
          quality={95}
          alt="Profile picture"
        />
      </div>
      <div className="about-content">
        <h2>About this Blog</h2>
        <p>
          This is my brain dump and "active recall" conversation repo with LLMs to formalize knowledge that I've never touched on.
        </p>
        <p>
          How did Twitter and Slack solve infinite scroll? How did offset pagination evolve? Stuff that I've taken for granted.
        </p>
      </div>
    </div>
  )
}

export default About