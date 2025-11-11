/**
 * DMV Test - Main Application Controller
 * Handles navigation, routing, and application lifecycle
 */

class DMVApp {
    constructor() {
        this.currentPage = 'home';
        this.statesIndex = [];
        this.currentStateQuestions = {};
        this.currentStateProperties = {};
        this.init();
    }

    /**
     * Initialize application
     */
    async init() {
        console.log('🚀 Initializing DMV Test App...');

        // Set up dark mode
        this.initDarkMode();

        // Set up event listeners
        this.setupEventListeners();

        // Load states index
        await this.loadStatesIndex();

        // Load selected state if exists
        const selectedState = storage.getSelectedState();
        if (selectedState) {
            await this.loadStateData(selectedState.id);
        }

        // Check URL hash for initial page
        const hash = window.location.hash.slice(1); // Remove '#'
        let initialPage = hash || null;

        // Navigate to home or onboarding
        if (!storage.isOnboardingComplete()) {
            this.showOnboarding();
        } else if (!selectedState) {
            this.navigateTo('select-state');
        } else if (initialPage) {
            this.navigateTo(initialPage, false); // false = don't push to history on initial load
        } else {
            this.navigateTo('home');
        }

        console.log('✅ App initialized successfully');
    }

    /**
     * Initialize dark mode
     */
    initDarkMode() {
        const theme = storage.getTheme();
        // Default to dark mode if no preference set
        if (theme === 'dark' || !theme) {
            document.documentElement.classList.add('dark');
            if (!theme) {
                storage.setTheme('dark');
            }
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Dark mode toggle
        document.getElementById('darkModeToggle')?.addEventListener('click', () => {
            this.toggleDarkMode();
        });

        // Navigation links
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // Browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            let page;
            if (e.state?.page) {
                page = e.state.page;
            } else {
                // Fallback to hash if state is null (on initial page load or manual URL change)
                const hash = window.location.hash.slice(1);
                page = hash || 'home';
            }
            this.navigateTo(page, false); // false = don't push to history again
        });

        // Timer events
        document.addEventListener('timerUpdate', (e) => {
            const timerEl = document.getElementById('quizTimer');
            if (timerEl) {
                timerEl.textContent = e.detail.formatted;
                if (e.detail.remaining < 60) {
                    timerEl.classList.add('text-red-600');
                }
            }
        });

        document.addEventListener('timerExpired', () => {
            this.showToast('Time\'s up!', 'warning');
            setTimeout(() => this.finishQuiz(), 1000);
        });
    }

    /**
     * Load states index
     */
    async loadStatesIndex() {
        try {
            const response = await fetch('data/states-index.json');
            this.statesIndex = await response.json();
            window.statesIndex = this.statesIndex;
            console.log(`✅ Loaded ${this.statesIndex.length} states`);
        } catch (error) {
            console.error('Error loading states:', error);
            this.showToast('Error loading states', 'error');
        }
    }

    /**
     * Load state data (questions + properties)
     */
    async loadStateData(stateId) {
        this.showLoading();
        try {
            // Load questions
            const questionsResponse = await fetch(`data/${stateId.toLowerCase()}.json`);
            const questions = await questionsResponse.json();

            // Convert array to object with questionNumber as key
            this.currentStateQuestions = {};
            questions.forEach(q => {
                this.currentStateQuestions[q.questionNumber] = q;
            });

            // Load properties
            const propertiesResponse = await fetch('data/test-properties.json');
            const allProperties = await propertiesResponse.json();

            // Find display name from states index
            const state = this.statesIndex.find(s => s.id === stateId);
            const displayName = state ? state.displayName : stateId;

            this.currentStateProperties = allProperties[displayName] || {};

            // Make globally available
            window.currentStateQuestions = this.currentStateQuestions;
            window.currentStateProperties = this.currentStateProperties;

            console.log(`✅ Loaded ${Object.keys(this.currentStateQuestions).length} questions for ${displayName}`);
        } catch (error) {
            console.error('Error loading state data:', error);
            this.showToast('Error loading questions', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Navigate to a page
     * @param {string} page - Page name to navigate to
     * @param {boolean} pushState - Whether to push to browser history (default: true)
     */
    async navigateTo(page, pushState = true) {
        this.currentPage = page;

        // Update browser history
        if (pushState) {
            window.history.pushState({ page }, '', `#${page}`);
        }

        // Update active nav links
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });

        // Render page first (will show loading if needed)
        this.renderPage(page);

        // Ensure states are loaded for select-state page
        if (page === 'select-state' && this.statesIndex.length === 0) {
            await this.loadStatesIndex();
            // Re-render page after states are loaded
            this.renderPage(page);
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Render page content
     */
    renderPage(page) {
        const content = document.getElementById('appContent');
        if (!content) return;

        let html = '';

        switch (page) {
            case 'home':
                html = Pages.home();
                break;
            case 'select-state':
                html = Pages.selectState();
                break;
            case 'practice-tests':
                if (!storage.getSelectedState()) {
                    this.navigateTo('select-state');
                    return;
                }
                html = Pages.practiceTests();
                break;
            case 'quiz':
                html = Pages.quiz();
                break;
            case 'ai-insights':
                html = Pages.aiInsights();
                break;
            case 'statistics':
                html = Pages.statistics();
                break;
            case 'settings':
                html = Pages.settings();
                break;
            case 'flashcards':
                html = Pages.flashcards();
                break;
            case 'simulator-intro':
                html = Pages.simulatorIntro();
                break;
            case 'wrong-questions':
                html = Pages.wrongQuestions();
                break;
            case 'favorites':
                html = Pages.favorites();
                break;
            case 'spaced-repetition':
                html = Pages.spacedRepetition();
                break;
            default:
                html = Pages.home();
        }

        content.innerHTML = html;
    }

    /**
     * Select a state
     */
    async selectState(stateId) {
        const state = this.statesIndex.find(s => s.id === stateId);
        if (!state) return;

        storage.setSelectedState(state);
        await this.loadStateData(stateId);

        this.showToast(`Selected ${state.displayName}`, 'success');
        setTimeout(() => this.navigateTo('home'), 500);
    }

    /**
     * Filter states
     */
    filterStates(query) {
        const grid = document.getElementById('statesGrid');
        if (!grid) return;

        const cards = grid.querySelectorAll('.card');
        cards.forEach(card => {
            const stateName = card.textContent.toLowerCase();
            if (stateName.includes(query.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    /**
     * Start practice test
     */
    startPracticeTest(testNumber) {
        const stateId = storage.getSelectedState()?.id;
        if (!stateId) {
            this.showToast('Please select a state first', 'warning');
            return;
        }

        const questionsPerTest = this.currentStateProperties.practiceQuestionsPerTest || 20;
        const success = quizEngine.startPracticeTest(stateId, testNumber, questionsPerTest);

        if (success) {
            this.navigateTo('quiz');
        } else {
            this.showToast('No questions available', 'error');
        }
    }

    /**
     * Start simulator
     */
    startSimulator() {
        const stateId = storage.getSelectedState()?.id;
        if (!stateId) {
            this.showToast('Please select a state first', 'warning');
            return;
        }

        const questionCount = this.currentStateProperties.simulatorQuestions || 30;
        const timeLimit = 30; // 30 minutes

        const success = quizEngine.startSimulator(stateId, questionCount, timeLimit);

        if (success) {
            this.navigateTo('quiz');
        } else {
            this.showToast('No questions available', 'error');
        }
    }

    /**
     * Submit answer
     */
    submitAnswer(answer) {
        const isCorrect = quizEngine.submitAnswer(answer);
        const isSimulator = quizEngine.currentQuiz?.type === 'simulator';

        if (isSimulator) {
            // Simulator mode: Allow changing answer, show selection with blue border only
            const buttons = document.querySelectorAll('.answer-option');

            // Remove selection from all buttons
            buttons.forEach(btn => {
                btn.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                btn.classList.add('border-gray-200', 'dark:border-gray-700');
            });

            // Highlight selected answer with blue border
            const selectedButton = document.querySelector(`[data-option="${answer}"]`);
            selectedButton.classList.remove('border-gray-200', 'dark:border-gray-700');
            selectedButton.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');

            // Enable next button
            document.getElementById('nextButton').disabled = false;
        } else {
            // Other modes: Disable buttons and show correct/incorrect feedback
            const buttons = document.querySelectorAll('.answer-option');
            buttons.forEach(btn => {
                btn.disabled = true;
                btn.classList.remove('hover:border-blue-500');
            });

            // Highlight selected answer
            const selectedButton = document.querySelector(`[data-option="${answer}"]`);
            const correctAnswer = quizEngine.getCurrentQuestion().correctAnswer;
            const correctButton = document.querySelector(`[data-option="${correctAnswer}"]`);

            if (isCorrect) {
                // Correct answer - add green styling and checkmark
                selectedButton.classList.add('border-green-500', 'bg-green-50', 'dark:bg-green-900/20', 'correct-animation');

                // Add checkmark icon to the button
                const checkmark = document.createElement('i');
                checkmark.className = 'fas fa-check-circle text-green-600 dark:text-green-400 text-2xl ml-auto';
                selectedButton.querySelector('.flex').appendChild(checkmark);
            } else {
                // Wrong answer - add red styling and X mark
                selectedButton.classList.add('border-red-500', 'bg-red-50', 'dark:bg-red-900/20', 'incorrect-animation');

                // Add X mark icon to the wrong button
                const xmark = document.createElement('i');
                xmark.className = 'fas fa-times-circle text-red-600 dark:text-red-400 text-2xl ml-auto';
                selectedButton.querySelector('.flex').appendChild(xmark);

                // Show correct answer with checkmark
                correctButton.classList.add('border-green-500', 'bg-green-50', 'dark:bg-green-900/20');

                const checkmark = document.createElement('i');
                checkmark.className = 'fas fa-check-circle text-green-600 dark:text-green-400 text-2xl ml-auto';
                correctButton.querySelector('.flex').appendChild(checkmark);
            }

            // Enable next button
            document.getElementById('nextButton').disabled = false;
        }
    }

    /**
     * Next question
     */
    nextQuestion() {
        const hasMore = quizEngine.nextQuestion();

        if (hasMore) {
            this.renderPage('quiz');
        } else {
            this.finishQuiz();
        }
    }

    /**
     * Previous question
     */
    previousQuestion() {
        quizEngine.previousQuestion();
        this.renderPage('quiz');
    }

    /**
     * Finish quiz
     */
    finishQuiz() {
        quizEngine.stopTimer();
        const results = quizEngine.calculateResults();
        const content = document.getElementById('appContent');
        if (content) {
            content.innerHTML = Pages.score(results);
        }
    }

    /**
     * Toggle favorite
     */
    toggleFavorite() {
        const question = quizEngine.getCurrentQuestion();
        if (!question) return;

        const isFavorite = quizEngine.toggleFavorite(question.questionNumber);
        const button = document.querySelector('[onclick="app.toggleFavorite()"]');

        if (button) {
            if (isFavorite) {
                button.className = 'p-3 rounded-xl bg-yellow-500 text-white hover:scale-110 transition-all';
                this.showToast('Added to favorites', 'success');
            } else {
                button.className = 'p-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:scale-110 transition-all';
                this.showToast('Removed from favorites', 'info');
            }
        }
    }

    /**
     * Review quiz
     */
    reviewQuiz() {
        const results = quizEngine.calculateResults();
        results.stateId = storage.getSelectedState()?.id;

        // Store results for review
        this.lastResults = results;

        // Start review mode
        if (quizEngine.startReviewMode(results)) {
            this.navigateTo('quiz');
        } else {
            this.showToast('No answers to review', 'error');
        }
    }

    /**
     * Retake quiz
     */
    retakeQuiz() {
        const summary = quizEngine.getSummary();
        quizEngine.reset();

        if (summary.type === 'practice') {
            this.navigateTo('practice-tests');
        } else {
            this.navigateTo('home');
        }
    }

    /**
     * Execute study task
     */
    executeStudyTask(action) {
        const stateId = storage.getSelectedState()?.id;
        if (!stateId) return;

        switch (action) {
            case 'spaced_repetition':
                quizEngine.startSpacedRepetition(stateId);
                this.navigateTo('quiz');
                break;
            case 'practice_test':
                this.navigateTo('practice-tests');
                break;
            case 'flashcards':
                quizEngine.startFlashcards(stateId);
                this.navigateTo('quiz');
                break;
            default:
                this.showToast('Starting...', 'info');
        }
    }

    /**
     * Start flashcards with custom count
     */
    startFlashcards(count = 20) {
        const stateId = storage.getSelectedState()?.id;
        if (!stateId) {
            this.showToast('Please select a state first', 'warning');
            return;
        }

        const success = quizEngine.startFlashcards(stateId, count);

        if (success) {
            this.navigateTo('quiz');
        } else {
            this.showToast('No questions available', 'error');
        }
    }

    /**
     * Start wrong questions review
     */
    startWrongQuestionsReview() {
        const stateId = storage.getSelectedState()?.id;
        if (!stateId) {
            this.showToast('Please select a state first', 'warning');
            return;
        }

        const success = quizEngine.startWrongQuestionsReview(stateId);

        if (success) {
            this.navigateTo('quiz');
        } else {
            this.showToast('No wrong answers to review', 'info');
        }
    }

    /**
     * Start favorites review
     */
    startFavoritesReview() {
        const stateId = storage.getSelectedState()?.id;
        if (!stateId) {
            this.showToast('Please select a state first', 'warning');
            return;
        }

        const success = quizEngine.startFavoritesReview(stateId);

        if (success) {
            this.navigateTo('quiz');
        } else {
            this.showToast('No favorites to review', 'info');
        }
    }

    /**
     * Start spaced repetition
     */
    startSpacedRepetition() {
        const stateId = storage.getSelectedState()?.id;
        if (!stateId) {
            this.showToast('Please select a state first', 'warning');
            return;
        }

        const success = quizEngine.startSpacedRepetition(stateId);

        if (success) {
            this.navigateTo('quiz');
        } else {
            this.showToast('No questions available for review', 'info');
        }
    }

    /**
     * Clear wrong answers
     */
    clearWrongAnswers() {
        if (confirm('Are you sure you want to clear all wrong answers?')) {
            const stateId = storage.getSelectedState()?.id;
            if (stateId) {
                const wrongAnswers = storage.getWrongAnswers();
                wrongAnswers.forEach(key => {
                    if (key.startsWith(`${stateId}_`)) {
                        localStorage.removeItem(`wrong_${key}`);
                    }
                });
                this.showToast('Wrong answers cleared', 'success');
                this.navigateTo('wrong-questions');
            }
        }
    }

    /**
     * Clear favorites
     */
    clearFavorites() {
        if (confirm('Are you sure you want to clear all favorites?')) {
            const stateId = storage.getSelectedState()?.id;
            if (stateId) {
                const favorites = storage.getFavorites();
                favorites.forEach(key => {
                    if (key.startsWith(`${stateId}_`)) {
                        localStorage.removeItem(`favorite_${key}`);
                    }
                });
                this.showToast('Favorites cleared', 'success');
                this.navigateTo('favorites');
            }
        }
    }

    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        storage.setTheme(isDark ? 'dark' : 'light');

        // Re-render charts if on statistics page
        if (this.currentPage === 'statistics') {
            setTimeout(() => statsManager.render7DayChart('performanceChart'), 100);
        }
    }

    /**
     * Export data
     */
    exportData() {
        const data = storage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dmv-test-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Data exported successfully', 'success');
    }

    /**
     * Import data
     */
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const success = storage.importData(event.target.result);
                if (success) {
                    this.showToast('Data imported successfully', 'success');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    this.showToast('Import failed', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    /**
     * Clear all data
     */
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone!')) {
            storage.clearAll();
            this.showToast('All data cleared', 'success');
            setTimeout(() => location.reload(), 1000);
        }
    }

    /**
     * Show onboarding
     */
    showOnboarding() {
        // Simple onboarding - just mark as complete and go to state selection
        storage.completeOnboarding();
        this.navigateTo('select-state');
    }

    /**
     * Show loading overlay
     */
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="flex items-center justify-between space-x-3">
                <div class="flex items-center space-x-2">
                    <i class="fas ${type === 'success' ? 'fa-check-circle text-green-600' : type === 'error' ? 'fa-times-circle text-red-600' : type === 'warning' ? 'fa-exclamation-triangle text-yellow-600' : 'fa-info-circle text-blue-600'}"></i>
                    <span class="text-gray-900 dark:text-white font-medium">${message}</span>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DMVApp();
    window.app = app; // Make globally accessible
});
