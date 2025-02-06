import React from "react";
import "./styles.css";

const Sidebar = ({ filters, setFilters, achievements, isCollapsed, toggleSidebar }) => {
  const uniqueCharacters = [...new Set(achievements.map((ach) => ach.character))];
  const uniquePartners = [...new Set(achievements.map((ach) => ach.partner).filter(Boolean))];
  const uniqueOpponents = [...new Set(achievements.map((ach) => ach.opponent).filter(Boolean))];

  const handleMultiSelect = (type, value) => {
    setFilters((prevFilters) => {
      const currentValues = prevFilters[type] || [];

      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return { ...prevFilters, [type]: updatedValues };
    });
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="collapse-button" onClick={toggleSidebar}>
        {isCollapsed ? "▶" : "◀"}
      </button>

      <div className="filter-section">
        <h3>As:</h3>
        <div className="filter-icons">
          {uniqueCharacters.map((char) => (
            <button
              key={char}
              className={`filter-icon ${filters.character.includes(char) ? "selected" : ""}`}
              onClick={() => handleMultiSelect("character", char)}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Partnered With:</h3>
        <div className="filter-icons">
          {uniquePartners.map((partner) => (
            <button
              key={partner}
              className={`filter-icon ${filters.partner.includes(partner) ? "selected" : ""}`}
              onClick={() => handleMultiSelect("partner", partner)}
            >
              {partner}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Against:</h3>
        <div className="filter-icons">
          {uniqueOpponents.map((opponent) => (
            <button
              key={opponent}
              className={`filter-icon ${filters.opponent.includes(opponent) ? "selected" : ""}`}
              onClick={() => handleMultiSelect("opponent", opponent)}
            >
              {opponent}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
