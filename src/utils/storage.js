const STORAGE_KEY = "marvelRivalsProgress";

// Load achievements from localStorage and merge with new ones
export const loadAchievements = (defaultAchievements) => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedCompletedIds = savedData ? JSON.parse(savedData) : [];

    // Map achievements and mark completed ones
    return defaultAchievements.map((ach) => ({
        ...ach,
        completed: savedCompletedIds.includes(ach.id),
    }));
};


// Save updated achievements
export const saveAchievements = (achievements) => {
    const completedIds = achievements
        .filter((ach) => ach.completed)
        .map((ach) => ach.id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
};

