import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
    </main>
  );
}

// hero content
const Hero = () => (
  <section className="hero">
    <div className="hero__content">
      <h1 className="hero__title">The Happiness Data App</h1>
      <p className="hero__subtitle">Find out the state of happiness around the world</p>

      <Link to="/rankings">Rankings</Link>
      <Link to="/search">Search</Link>
    </div>
  </section>
);

// features section
function Features() {
  const featuresData = [
    {
      heading: "Rankings",
      text:
        "View happiness rankings of as many as 157 countries. Each variable is measured on a scale running from 0 to 10.",
      img: { src: "img/rankings.png", alt: "Rankings icon" }
    },
    {
      heading: "Search",
      text:
        "Search for a country and see how the happiness score changes from 2015-2020",
      img: { src: "img/search.png", alt: "Search icon" }
    },
    {
      heading: "Factors",
      text:
        "Log in to learn about the six happiness factors for each country.",
      img: { src: "img/factors.png", alt: "Factors icon" }
    }
  ];

  return (
    <article className="features">
      <div className="features__header">
        <h2>Features</h2>
      </div>

      <div className="features__box-wrapper">
        {
          // display the information for each of our features in their own Box
          featuresData.map((feature) => (
            <FeatureBox feature={feature} />
          ))
        }
      </div>
    </article>
  );
}

// Display a Feature box when passed in the information for the feature
const FeatureBox = ({ feature }) => (
  <div className="features__box">
    <img src={feature.img.src} alt={feature.img.alt} />
    <h5>{feature.title}</h5>
    <p>{feature.text}</p>
  </div>
);
