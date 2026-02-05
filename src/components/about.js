/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

const About = () => {
  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto", "webp", "avif"]}
        src="../images/about_prof.jpg"
        width={500}
        height={500}
        quality={90}
        alt="Profile picture"
      />
      <h2>About this Blog</h2>
      <p>
        I started this because I realized that my "decade" of experience feels more like 4 years of experience and then 1 year of experience repeated 6 times. Sure, I've learned how to manage teams and work in different spaces with a lot of emphasis on soft skills and more product manager work these past few years... but somewhere along the way I asked myself "wait, do I really know how this annotation works?". That eventually led to more fundamental questions like "wait, do I even understand how concurrency works? What about scaling and microservice async patterns, like, _really_ do I know it?". Like most developers, I never had a formal path once I started working, and I never went back and tried to learn it. So I guess I'm trying to now.
      </p>
    </div>
  )
}

export default About