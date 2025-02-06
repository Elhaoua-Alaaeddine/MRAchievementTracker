import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import FilterMenu from "./components/FilterMenu";
import achievementsData from "./data/achievements";
import categoryProgress from "./data/categoryProgress";
import { characterGroups } from "./data/characterGroups";
import rewardImages from "./data/rewardImages";
import "./styles.css";
import { loadAchievements, saveAchievements } from "./utils/storage";
function App() {
  const [achievements, setAchievements] = useState([]);
  const [filters, setFilters] = useState({
    characters: [],
    partners: [],
    opponents: [],
    map: "",
  });
  const [activeCategory, setActiveCategory] = useState("Galacta's Guide");
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [isMenuOpen, setIsMenuOpen] = useState(true); // Track menu state

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const categories = Object.keys(categoryProgress);

  useEffect(() => {
    const loadedAchievements = loadAchievements(achievementsData).map(
      (ach) => ({
        ...ach,
        opponent: ach.opponent || null,
        partner: ach.partner || null,
        character: ach.character || null,
      })
    );

    setAchievements(loadedAchievements);
    // const handleResize = () => setIsMobile(window.innerWidth < 768);
    // window.addEventListener("resize", handleResize);
    // return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFilterChange = (type, values) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: values,
    }));
  };

  const toggleAchievement = (id) => {
    setAchievements((prevAchievements) => {
      const updatedAchievements = prevAchievements.map((ach) => {
        if (ach.id === id) {
          const updatedAch = { ...ach, completed: !ach.completed };

          // Ensure null values are saved properly
          if (!updatedAch.opponent) updatedAch.opponent = null;
          if (!updatedAch.partner) updatedAch.partner = null;
          if (!updatedAch.character) updatedAch.character = null;

          return updatedAch;
        }
        return ach;
      });

      saveAchievements(updatedAchievements);
      return updatedAchievements;
    });
  };

  // Get all group names
  const groupNames = Object.keys(characterGroups);

  // Filter out group names from the character list
  const allCharacters = [
    ...new Set(
      achievementsData
        .flatMap((ach) => [ach.character, ach.partner, ach.opponent])
        .filter((char) => char && !groupNames.includes(char)) // Exclude group names
    ),
  ];
  const allMaps = [
    ...new Set(achievementsData.map((ach) => ach.map).filter(Boolean)),
  ];
  const filteredAchievements = achievements.filter((ach) => {
    // Ensure achievement is in the selected category
    const categoryMatch = ach.category === activeCategory;

    // Check if filters are applied
    const hasCharacterFilter = filters.characters.length > 0;
    const hasPartnerFilter = filters.partners.length > 0;
    const hasOpponentFilter = filters.opponents.length > 0;

    // Match only if a filter is selected for that category
    const isInterchangeable = (selected, achCharacter) => {
      if (!selected) return false;
      if (selected.includes("Bruce Banner") && achCharacter === "Hulk")
        return true;
      if (selected.includes("Hulk") && achCharacter === "Bruce Banner")
        return true;
      return selected.includes(achCharacter);
    };

    const characterMatch = hasCharacterFilter
      ? isInterchangeable(filters.characters, ach.character)
      : false;
    const matchesCharacterOrGroup = (
      selectedCharacters,
      achCharacter,
      useGroup
    ) => {
      if (!selectedCharacters.length) return false;

      return selectedCharacters.some((selected) => {
        // Direct match
        if (selected === achCharacter) return true;

        // Group matching logic
        if (useGroup) {
          for (const [groupName, groupMembers] of Object.entries(
            characterGroups
          )) {
            // Check if the achievement uses a group like "Mutants"
            if (achCharacter === groupName && groupMembers.includes(selected)) {
              return true; // If "Storm" is selected and achievement is "Mutants", match!
            }
          }
        }

        return false;
      });
    };

    // Apply filtering
    const partnerMatch = hasPartnerFilter
      ? matchesCharacterOrGroup(
          filters.partners,
          ach.partner,
          ach.useGroupForPartner
        )
      : false;

    const opponentMatch = hasOpponentFilter
      ? matchesCharacterOrGroup(
          filters.opponents,
          ach.opponent,
          ach.useGroupForOpponent
        )
      : false;
    // If no filters are selected, default to showing everything in the selected category
    const noFiltersApplied =
      !hasCharacterFilter && !hasPartnerFilter && !hasOpponentFilter;

    // If filters are applied, ensure at least one matches
    const hasAnyMatch = characterMatch || partnerMatch || opponentMatch;

    // Apply map filtering strictly
    const mapMatch = filters.map === "" || ach.map === filters.map;

    return categoryMatch && (noFiltersApplied || hasAnyMatch) && mapMatch;
  });

  const sortedAchievements = [...filteredAchievements].sort(
    (a, b) => a.completed - b.completed
  );

  const totalPoints = achievements
    .filter((ach) => ach.category === activeCategory && ach.completed)
    .reduce((sum, ach) => sum + ach.rewardPoints, 0);

  const { checkpoints, rewards } = categoryProgress[activeCategory];
  let nextCheckpoint =
    checkpoints.find((cp) => cp > totalPoints) ||
    checkpoints[checkpoints.length - 1];
  let nextReward =
    rewards[checkpoints.indexOf(nextCheckpoint)] || rewards[rewards.length - 1];

  return (
    <div className="app-layout">
      <FilterMenu
        filters={filters}
        onFilterChange={handleFilterChange}
        allCharacters={allCharacters}
        allMaps={allMaps}
        isMenuOpen={isMenuOpen} // Pass the menu state
        toggleMenu={toggleMenu} // Pass function to control menu
      />
      <div
        className={`main-content ${isMenuOpen ? "menu-open" : "menu-closed"}`}
      >
        <h1>Marvel Rivals Achievement Tracker</h1>

        <div className="category-toggle">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${
                category === activeCategory ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="progress-container">
          <span className="progress-text">
            Achievement Points | {totalPoints}/{nextCheckpoint}
          </span>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              animate={{ width: `${(totalPoints / nextCheckpoint) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="reward-display">
            {rewardImages[nextReward] && (
              <img
                src={rewardImages[nextReward]}
                alt={nextReward}
                className="reward-icon"
              />
            )}
            <span className="reward-text">{nextReward}</span>
          </div>
        </div>

        <ul className="achievement-list">
          {sortedAchievements.map((ach) => (
            <motion.li
              key={ach.id}
              className={`achievement-card ${ach.completed ? "completed" : ""}`}
              layout
              initial={{ opacity: 0 }} // Start slightly below and transparent
              animate={{ opacity: 1 }} // Fade in and slide up smoothly
              exit={{ opacity: 0 }} // Fade out when removed
              transition={{
                layout: { duration: 0.5, ease: "easeInOut" }, // Controls reordering speed
                opacity: { duration: 0.3, ease: "easeInOut" }, // Controls fade speed
              }} // Smoother easing
            >
              <div className="achievement-details">
                <h3 className="achievement-title">{ach.title}</h3>
                <p className="achievement-description">{ach.description}</p>
                {ach.character && (
                  <p>
                    <strong>Character:</strong> {ach.character}
                  </p>
                )}
                {ach.partner && (
                  <p>
                    <strong>Partner:</strong> {ach.partner}
                  </p>
                )}
                {ach.opponent && (
                  <p>
                    <strong>Opponent:</strong> {ach.opponent}
                  </p>
                )}
                {ach.map && (
                  <p>
                    <strong>Map:</strong> {ach.map}
                  </p>
                )}
                {ach.hint && (
                  <div className="achievement-hint">
                    <span>Hint: {ach.hint}</span>
                  </div>
                )}
              </div>
              <div className="achievement-reward">
                <div className="reward-info">
                  <span className="reward-points">
                    {ach.rewardPoints ?? 0} points
                  </span>

                  <button
                    onClick={() => toggleAchievement(ach.id)}
                    className={`button ${
                      ach.completed ? "undo-button" : "complete-button"
                    }`}
                  >
                    {ach.completed ? "Undo" : "Complete"}
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
