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
          I started this because I realized that my "decade" of experience feels 
          more like 4 years of experience and then 1 year of experience repeated 6 times.
        </p>
        <p>
          Sure, I learned a lot of things along the way, but I also forgot a lot of things too. So this is just my brain dump and "active recall" conversations with LLM to formalize my knowledge.
        </p>
      </div>
    </div>
  )
}

export default About