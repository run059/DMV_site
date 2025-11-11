/**
 * DMV Test - LocalStorage Management
 * Handles all data persistence using browser localStorage
 */

class StorageManager {
    constructor() {
        this.KEYS = {
            SELECTED_STATE: 'dmv_selected_state',
            USER_STATS: 'dmv_user_stats',
            ANSWERS: 'dmv_answers',
            FAVORITES: 'dmv_favorites',
            WRONG_ANSWERS: 'dmv_wrong_answers',
            TEST_PROGRESS: 'dmv_test_progress',
            STREAK: 'dmv_streak',
            LAST_STUDY_DATE: 'dmv_last_study_date',
            SPACED_REPETITION: 'dmv_spaced_repetition',
            SETTINGS: 'dmv_settings',
            THEME: 'dmv_theme',
            ONBOARDING_COMPLETE: 'dmv_onboarding_complete'
        };

        this.initializeStorage();
    }

    /**
     * Initialize storage with default values if not exists
     */
    initializeStorage() {
        if (!this.get(this.KEYS.USER_STATS)) {
            this.set(this.KEYS.USER_STATS, {
                totalQuestionsSolved: 0,
                correctAnswers: 0,
                incorrectAnswers: 0,
                testsTaken: 0,
                accuracyRate: 0,
                lastUpdated: new Date().toISOString()
            });
        }

        if (!this.get(this.KEYS.STREAK)) {
            this.set(this.KEYS.STREAK, {
                currentStreak: 0,
                bestStreak: 0,
                lastStudyDate: null
            });
        }

        if (!this.get(this.KEYS.SETTINGS)) {
            this.set(this.KEYS.SETTINGS, {
                notifications: true,
                sound: true,
                darkMode: false,
                language: 'en'
            });
        }

        if (!this.get(this.KEYS.ANSWERS)) {
            this.set(this.KEYS.ANSWERS, {});
        }

        if (!this.get(this.KEYS.FAVORITES)) {
            this.set(this.KEYS.FAVORITES, []);
        }

        if (!this.get(this.KEYS.WRONG_ANSWERS)) {
            this.set(this.KEYS.WRONG_ANSWERS, []);
        }

        if (!this.get(this.KEYS.TEST_PROGRESS)) {
            this.set(this.KEYS.TEST_PROGRESS, {});
        }

        if (!this.get(this.KEYS.SPACED_REPETITION)) {
            this.set(this.KEYS.SPACED_REPETITION, {});
        }
    }

    /**
     * Get item from localStorage
     */
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    /**
     * Set item in localStorage
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    }

    /**
     * Remove item from localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    /**
     * Clear all app data
     */
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            this.remove(key);
        });
        this.initializeStorage();
    }

    // ==================== State Management ====================

    getSelectedState() {
        return this.get(this.KEYS.SELECTED_STATE);
    }

    setSelectedState(state) {
        return this.set(this.KEYS.SELECTED_STATE, state);
    }

    // ==================== User Statistics ====================

    getUserStats() {
        return this.get(this.KEYS.USER_STATS);
    }

    updateUserStats(stats) {
        const current = this.getUserStats();
        const updated = { ...current, ...stats, lastUpdated: new Date().toISOString() };

        // Calculate accuracy rate
        const total = updated.correctAnswers + updated.incorrectAnswers;
        updated.accuracyRate = total > 0 ? (updated.correctAnswers / total * 100).toFixed(1) : 0;

        return this.set(this.KEYS.USER_STATS, updated);
    }

    incrementStats(correct) {
        const stats = this.getUserStats();
        stats.totalQuestionsSolved += 1;
        if (correct) {
            stats.correctAnswers += 1;
        } else {
            stats.incorrectAnswers += 1;
        }
        this.updateUserStats(stats);
    }

    incrementTestsTaken() {
        const stats = this.getUserStats();
        stats.testsTaken += 1;
        this.updateUserStats(stats);
    }

    // ==================== Answers ====================

    getAnswers(stateId = null) {
        const allAnswers = this.get(this.KEYS.ANSWERS);
        if (stateId) {
            return allAnswers[stateId] || {};
        }
        return allAnswers;
    }

    saveAnswer(stateId, questionNumber, answer, isCorrect) {
        const answers = this.getAnswers();
        if (!answers[stateId]) {
            answers[stateId] = {};
        }

        answers[stateId][questionNumber] = {
            answer: answer,
            correct: isCorrect,
            timestamp: new Date().toISOString()
        };

        this.set(this.KEYS.ANSWERS, answers);

        // Update stats
        this.incrementStats(isCorrect);

        // Track wrong answer
        if (!isCorrect) {
            this.addWrongAnswer(stateId, questionNumber);
        }
    }

    // ==================== Favorites ====================

    getFavorites() {
        return this.get(this.KEYS.FAVORITES);
    }

    addFavorite(stateId, questionNumber) {
        const favorites = this.getFavorites();
        const key = `${stateId}_${questionNumber}`;

        if (!favorites.includes(key)) {
            favorites.push(key);
            this.set(this.KEYS.FAVORITES, favorites);
        }
    }

    removeFavorite(stateId, questionNumber) {
        const favorites = this.getFavorites();
        const key = `${stateId}_${questionNumber}`;
        const index = favorites.indexOf(key);

        if (index > -1) {
            favorites.splice(index, 1);
            this.set(this.KEYS.FAVORITES, favorites);
        }
    }

    isFavorite(stateId, questionNumber) {
        const favorites = this.getFavorites();
        const key = `${stateId}_${questionNumber}`;
        return favorites.includes(key);
    }

    // ==================== Wrong Answers ====================

    getWrongAnswers() {
        return this.get(this.KEYS.WRONG_ANSWERS);
    }

    addWrongAnswer(stateId, questionNumber) {
        const wrongAnswers = this.getWrongAnswers();
        const key = `${stateId}_${questionNumber}`;

        if (!wrongAnswers.includes(key)) {
            wrongAnswers.push(key);
            this.set(this.KEYS.WRONG_ANSWERS, wrongAnswers);
        }
    }

    removeWrongAnswer(stateId, questionNumber) {
        const wrongAnswers = this.getWrongAnswers();
        const key = `${stateId}_${questionNumber}`;
        const index = wrongAnswers.indexOf(key);

        if (index > -1) {
            wrongAnswers.splice(index, 1);
            this.set(this.KEYS.WRONG_ANSWERS, wrongAnswers);
        }
    }

    clearWrongAnswers() {
        this.set(this.KEYS.WRONG_ANSWERS, []);
    }

    // ==================== Test Progress ====================

    getTestProgress(stateId, testNumber) {
        const progress = this.get(this.KEYS.TEST_PROGRESS);
        const key = `${stateId}_test_${testNumber}`;
        return progress[key] || { completed: false, score: 0, answers: {} };
    }

    saveTestProgress(stateId, testNumber, progressData) {
        const progress = this.get(this.KEYS.TEST_PROGRESS);
        const key = `${stateId}_test_${testNumber}`;
        progress[key] = {
            ...progressData,
            lastUpdated: new Date().toISOString()
        };
        this.set(this.KEYS.TEST_PROGRESS, progress);
    }

    // ==================== Streak Management ====================

    getStreak() {
        return this.get(this.KEYS.STREAK);
    }

    updateStreak() {
        const streak = this.getStreak();
        const today = new Date().toDateString();
        const lastDate = streak.lastStudyDate ? new Date(streak.lastStudyDate).toDateString() : null;

        if (lastDate === today) {
            // Already studied today
            return streak;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastDate === yesterdayStr) {
            // Consecutive day
            streak.currentStreak += 1;
        } else if (lastDate === null) {
            // First study
            streak.currentStreak = 1;
        } else {
            // Streak broken
            streak.currentStreak = 1;
        }

        // Update best streak
        if (streak.currentStreak > streak.bestStreak) {
            streak.bestStreak = streak.currentStreak;
        }

        streak.lastStudyDate = new Date().toISOString();
        this.set(this.KEYS.STREAK, streak);
        return streak;
    }

    // ==================== Spaced Repetition ====================

    getSpacedRepetitionData(stateId, questionNumber) {
        const data = this.get(this.KEYS.SPACED_REPETITION);
        const key = `${stateId}_${questionNumber}`;
        return data[key] || {
            easeFactor: 2.5,
            interval: 1,
            repetitions: 0,
            nextReview: new Date().toISOString(),
            lastReviewed: null
        };
    }

    updateSpacedRepetition(stateId, questionNumber, quality) {
        const data = this.get(this.KEYS.SPACED_REPETITION);
        const key = `${stateId}_${questionNumber}`;
        const current = this.getSpacedRepetitionData(stateId, questionNumber);

        // SM-2 Algorithm
        if (quality >= 3) {
            if (current.repetitions === 0) {
                current.interval = 1;
            } else if (current.repetitions === 1) {
                current.interval = 6;
            } else {
                current.interval = Math.round(current.interval * current.easeFactor);
            }
            current.repetitions += 1;
        } else {
            current.repetitions = 0;
            current.interval = 1;
        }

        current.easeFactor = Math.max(1.3, current.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + current.interval);
        current.nextReview = nextReview.toISOString();
        current.lastReviewed = new Date().toISOString();

        data[key] = current;
        this.set(this.KEYS.SPACED_REPETITION, data);
    }

    getDueReviews(stateId) {
        const data = this.get(this.KEYS.SPACED_REPETITION);
        const now = new Date();
        const dueReviews = [];

        Object.keys(data).forEach(key => {
            if (key.startsWith(`${stateId}_`)) {
                const item = data[key];
                const nextReview = new Date(item.nextReview);
                if (nextReview <= now) {
                    const questionNumber = parseInt(key.split('_')[1]);
                    dueReviews.push({
                        questionNumber,
                        ...item
                    });
                }
            }
        });

        return dueReviews;
    }

    // ==================== Settings ====================

    getSettings() {
        return this.get(this.KEYS.SETTINGS);
    }

    updateSettings(settings) {
        const current = this.getSettings();
        const updated = { ...current, ...settings };
        return this.set(this.KEYS.SETTINGS, updated);
    }

    // ==================== Theme ====================

    getTheme() {
        return this.get(this.KEYS.THEME) || 'light';
    }

    setTheme(theme) {
        return this.set(this.KEYS.THEME, theme);
    }

    // ==================== Onboarding ====================

    isOnboardingComplete() {
        return this.get(this.KEYS.ONBOARDING_COMPLETE) === true;
    }

    completeOnboarding() {
        return this.set(this.KEYS.ONBOARDING_COMPLETE, true);
    }

    // ==================== Export/Import ====================

    exportData() {
        const data = {};
        Object.values(this.KEYS).forEach(key => {
            data[key] = this.get(key);
        });
        return JSON.stringify(data, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            Object.keys(data).forEach(key => {
                this.set(key, data[key]);
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // ==================== 7-Day Performance History ====================

    get7DayPerformance() {
        const stats = this.getUserStats();
        const answers = this.getAnswers();
        const today = new Date();
        const performance = [];

        // Get last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();

            let correct = 0;
            let total = 0;

            // Count answers for this day
            Object.values(answers).forEach(stateAnswers => {
                Object.values(stateAnswers).forEach(answer => {
                    const answerDate = new Date(answer.timestamp).toDateString();
                    if (answerDate === dateStr) {
                        total++;
                        if (answer.correct) correct++;
                    }
                });
            });

            performance.push({
                date: dateStr,
                label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                correct,
                total,
                accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
            });
        }

        return performance;
    }
}

// Create global instance
const storage = new StorageManager();
