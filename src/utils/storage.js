const STORAGE_KEY = "marvelRivalsProgress";

export const loadAchievements = (defaultAchievements) => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedCompletedIds = savedData ? JSON.parse(savedData) : [];

    return defaultAchievements.map((ach) => ({
        ...ach,
        completed: savedCompletedIds.includes(ach.id),
    }));
};


export const saveAchievements = (achievements) => {
    const completedIds = achievements
        .filter((ach) => ach.completed)
        .map((ach) => ach.id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
};

