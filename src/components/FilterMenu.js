import { Filter } from "lucide-react";
import React, { useState } from "react";
import Select from "react-select";
import "./FilterMenu.css";

function FilterMenu({ filters, onFilterChange, allCharacters, allMaps }) {
  const [isOpen, setIsOpen] = useState(false); // Controls menu visibility on mobile

  const characterOptions = allCharacters.map((char) => ({
    value: char,
    label: char,
  }));

  const mapOptions = [
    { value: "", label: "All Maps" },
    ...allMaps.map((map) => ({ value: map, label: map })),
  ];

  const clearFilters = () => {
    onFilterChange("characters", []);
    onFilterChange("partners", []);
    onFilterChange("opponents", []);
    onFilterChange("map", "");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className={`filter-toggle-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter size={30} />
      </button>

      {/* Filter Menu Overlay */}
      <div className={`filter-menu ${isOpen ? "open" : "closed"}`}>
        <h3>Filter Achievements</h3>

        <div className="filter-group">
          <h4>Character</h4>
          <Select
            options={characterOptions}
            isMulti
            value={filters.characters.map((char) => ({
              value: char,
              label: char,
            }))}
            onChange={(selected) =>
              onFilterChange(
                "characters",
                selected.map((s) => s.value)
              )
            }
            placeholder="Add characters..."
          />
        </div>

        <div className="filter-group">
          <h4>Partner</h4>
          <Select
            options={characterOptions}
            isMulti
            value={filters.partners.map((char) => ({
              value: char,
              label: char,
            }))}
            onChange={(selected) =>
              onFilterChange(
                "partners",
                selected.map((s) => s.value)
              )
            }
            placeholder="Add partners..."
          />
        </div>

        <div className="filter-group">
          <h4>Opponent</h4>
          <Select
            options={characterOptions}
            isMulti
            value={filters.opponents.map((char) => ({
              value: char,
              label: char,
            }))}
            onChange={(selected) =>
              onFilterChange(
                "opponents",
                selected.map((s) => s.value)
              )
            }
            placeholder="Add opponents..."
          />
        </div>

        <div className="filter-group">
          <h4>Map / Game Mode</h4>
          <Select
            options={mapOptions}
            value={
              mapOptions.find((opt) => opt.value === filters.map) ||
              mapOptions[0]
            }
            onChange={(selected) =>
              onFilterChange("map", selected ? selected.value : "")
            }
            placeholder="Choose a map..."
          />
        </div>

        {/* Clear Filters Button */}
        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear All Filters
        </button>
      </div>

      {/* Background Overlay for Mobile */}
      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
}

export default FilterMenu;
