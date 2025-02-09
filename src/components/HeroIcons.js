import React from "react";
import "./HeroIcons.css";
function HeroIcons({ type, selected, onSelect }) {
  const heroes = [
    { name: "Iron Man", icon: "/images/ironman.png" },
    { name: "Captain America", icon: "/images/captainamerica.png" },
    { name: "Thor", icon: "/images/Thor.png" },
    { name: "Hulk", icon: "/images/hulk.png" },
    { name: "Black Widow", icon: "/images/blackwidow.png" },
    { name: "Spider-Man", icon: "/images/spiderman.png" },
  ];

  return (
    <div className="hero-icons">
      <h4>{type === "characters" ? "As:" : type === "partners" ? "Partnered With:" : "Against:"}</h4>
      <div className="hero-grid">
        {heroes.map((hero) => (
          <div
            key={hero.name}
            className={`hero-icon ${selected.includes(hero.name) ? "selected" : ""}`}
            onClick={() => onSelect(type, hero.name)}
          >
            <img src={hero.icon} alt={hero.name} />
            <span>{hero.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeroIcons;
