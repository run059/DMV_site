/**
 * DMV Test - Quiz Engine
 * Handles quiz logic, question management, and test orchestration
 */

class QuizEngine {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.userAnswers = [];
        this.startTime = null;
        this.timer = null;
        this.timeLimit = null;
    }

    /**
     * Start a new practice test
     */
    startPracticeTest(stateId, testNumber, questionsPerTest) {
        const allQuestions = window.currentStateQuestions || {};
        const questionNumbers = Object.keys(allQuestions).map(Number);

        // Get questions for this specific test
        const startIndex = (testNumber - 1) * questionsPerTest;
        const endIndex = startIndex + questionsPerTest;
        const testQuestions = questionNumbers.slice(startIndex, endIndex);

        this.questions = testQuestions.map(num => ({
            ...allQuestions[num],
            questionNumber: num
        }));

        this.currentQuiz = {
            type: 'practice',
            stateId,
            testNumber,
            totalQuestions: this.questions.length
        };

        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = new Date();

        return this.questions.length > 0;
    }

    /**
     * Start test simulator
     */
    startSimulator(stateId, questionCount, timeLimit) {
        const allQuestions = window.currentStateQuestions || {};
        const questionNumbers = Object.keys(allQuestions).map(Number);

        // Randomly select questions
        const shuffled = questionNumbers.sort(() => Math.random() - 0.5);
        const selectedNumbers = shuffled.slice(0, questionCount);

        this.questions = selectedNumbers.map(num => ({
            ...allQuestions[num],
            questionNumber: num
        }));

        this.currentQuiz = {
            type: 'simulator',
            stateId,
            totalQuestions: this.questions.length,
            timeLimit: timeLimit
        };

        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = new Date();
        this.timeLimit = timeLimit;

        // Start timer
        if (timeLimit > 0) {
            this.startTimer(timeLimit);
        }

        return this.questions.length > 0;
    }

    /**
     * Start flashcard mode
     */
    startFlashcards(stateId, count = 20) {
        const allQuestions = window.currentStateQuestions || {};
        const questionNumbers = Object.keys(allQuestions).map(Number);

        // Shuffle and select
        const shuffled = questionNumbers.sort(() => Math.random() - 0.5);
        const selectedNumbers = shuffled.slice(0, count);

        this.questions = selectedNumbers.map(num => ({
            ...allQuestions[num],
            questionNumber: num
        }));

        this.currentQuiz = {
            type: 'flashcard',
            stateId,
            totalQuestions: this.questions.length
        };

        this.currentQuestionIndex = 0;
        this.userAnswers = [];

        return this.questions.length > 0;
    }

    /**
     * Start wrong questions review
     */
    startWrongQuestionsReview(stateId) {
        const allQuestions = window.currentStateQuestions || {};
        const wrongAnswers = storage.getWrongAnswers();

        const wrongQuestionNumbers = wrongAnswers
            .filter(key => key.startsWith(`${stateId}_`))
            .map(key => parseInt(key.split('_')[1]));

        this.questions = wrongQuestionNumbers.map(num => ({
            ...allQuestions[num],
            questionNumber: num
        }));

        this.currentQuiz = {
            type: 'wrong_review',
            stateId,
            totalQuestions: this.questions.length
        };

        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = new Date();

        return this.questions.length > 0;
    }

    /**
     * Start favorites review
     */
    startFavoritesReview(stateId) {
        const allQuestions = window.currentStateQuestions || {};
        const favorites = storage.getFavorites();

        const favoriteNumbers = favorites
            .filter(key => key.startsWith(`${stateId}_`))
            .map(key => parseInt(key.split('_')[1]));

        this.questions = favoriteNumbers.map(num => ({
            ...allQuestions[num],
            questionNumber: num
        }));

        this.currentQuiz = {
            type: 'favorites',
            stateId,
            totalQuestions: this.questions.length
        };

        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = new Date();

        return this.questions.length > 0;
    }

    /**
     * Start spaced repetition review
     */
    startSpacedRepetition(stateId) {
        const priorityQuestions = aiEngine.getPriorityQuestions(stateId, 20);
        const allQuestions = window.currentStateQuestions || {};

        this.questions = priorityQuestions.map(num => ({
            ...allQuestions[num],
            questionNumber: num
        }));

        this.currentQuiz = {
            type: 'spaced_repetition',
            stateId,
            totalQuestions: this.questions.length
        };

        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = new Date();

        return this.questions.length > 0;
    }

    /**
     * Get current question
     */
    getCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            return null;
        }
        return this.questions[this.currentQuestionIndex];
    }

    /**
     * Submit answer
     */
    submitAnswer(answer) {
        const question = this.getCurrentQuestion();
        if (!question) return;

        const isCorrect = answer === question.correctAnswer;

        this.userAnswers.push({
            questionNumber: question.questionNumber,
            userAnswer: answer,
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect,
            timestamp: new Date()
        });

        // Save to storage
        storage.saveAnswer(
            this.currentQuiz.stateId,
            question.questionNumber,
            answer,
            isCorrect
        );

        // Update spaced repetition
        const quality = isCorrect ? 4 : 1; // 4 = good, 1 = failed
        storage.updateSpacedRepetition(
            this.currentQuiz.stateId,
            question.questionNumber,
            quality
        );

        // Update streak
        storage.updateStreak();

        return isCorrect;
    }

    /**
     * Go to next question
     */
    nextQuestion() {
        this.currentQuestionIndex++;
        return this.currentQuestionIndex < this.questions.length;
    }

    /**
     * Go to previous question
     */
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            return true;
        }
        return false;
    }

    /**
     * Get quiz progress
     */
    getProgress() {
        return {
            current: this.currentQuestionIndex + 1,
            total: this.questions.length,
            percentage: Math.round(((this.currentQuestionIndex + 1) / this.questions.length) * 100)
        };
    }

    /**
     * Calculate quiz results
     */
    calculateResults() {
        const correct = this.userAnswers.filter(a => a.isCorrect).length;
        const total = this.userAnswers.length;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

        const endTime = new Date();
        const duration = Math.round((endTime - this.startTime) / 1000); // seconds

        // Get state properties
        const properties = window.currentStateProperties || {};
        const allowedMistakes = properties.allowedMistakes || 0;
        const mistakes = total - correct;
        const passed = mistakes <= allowedMistakes && percentage >= 70;

        // Save test completion
        storage.incrementTestsTaken();

        if (this.currentQuiz.type === 'practice') {
            storage.saveTestProgress(
                this.currentQuiz.stateId,
                this.currentQuiz.testNumber,
                {
                    completed: true,
                    score: percentage,
                    correct: correct,
                    total: total,
                    passed: passed,
                    duration: duration,
                    answers: this.userAnswers
                }
            );
        }

        return {
            correct,
            incorrect: total - correct,
            total,
            percentage,
            passed,
            allowedMistakes,
            duration,
            durationFormatted: this.formatDuration(duration),
            answers: this.userAnswers
        };
    }

    /**
     * Format duration in mm:ss
     */
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Start countdown timer
     */
    startTimer(minutes) {
        let secondsRemaining = minutes * 60;

        this.timer = setInterval(() => {
            secondsRemaining--;

            // Update timer display
            const event = new CustomEvent('timerUpdate', {
                detail: {
                    remaining: secondsRemaining,
                    formatted: this.formatDuration(secondsRemaining)
                }
            });
            document.dispatchEvent(event);

            if (secondsRemaining <= 0) {
                this.stopTimer();
                // Auto-submit quiz
                const event = new CustomEvent('timerExpired');
                document.dispatchEvent(event);
            }
        }, 1000);
    }

    /**
     * Stop timer
     */
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    /**
     * Get remaining time
     */
    getRemainingTime() {
        if (!this.startTime || !this.timeLimit) return null;

        const elapsed = Math.floor((new Date() - this.startTime) / 1000);
        const remaining = (this.timeLimit * 60) - elapsed;

        return Math.max(0, remaining);
    }

    /**
     * Toggle favorite
     */
    toggleFavorite(questionNumber) {
        const stateId = this.currentQuiz.stateId;
        const isFavorite = storage.isFavorite(stateId, questionNumber);

        if (isFavorite) {
            storage.removeFavorite(stateId, questionNumber);
        } else {
            storage.addFavorite(stateId, questionNumber);
        }

        return !isFavorite;
    }

    /**
     * Check if current question is favorite
     */
    isCurrentFavorite() {
        const question = this.getCurrentQuestion();
        if (!question) return false;

        return storage.isFavorite(this.currentQuiz.stateId, question.questionNumber);
    }

    /**
     * Get user's answer for current question (if exists)
     */
    getUserAnswer(questionNumber) {
        const answer = this.userAnswers.find(a => a.questionNumber === questionNumber);
        return answer ? answer.userAnswer : null;
    }

    /**
     * Reset quiz
     */
    reset() {
        this.stopTimer();
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.userAnswers = [];
        this.startTime = null;
        this.timeLimit = null;
    }

    /**
     * Get quiz summary
     */
    getSummary() {
        return {
            type: this.currentQuiz?.type,
            stateId: this.currentQuiz?.stateId,
            totalQuestions: this.questions.length,
            answeredQuestions: this.userAnswers.length,
            currentIndex: this.currentQuestionIndex
        };
    }

    /**
     * Start review mode (review completed quiz)
     */
    startReviewMode(results) {
        this.currentQuiz = {
            type: 'review',
            stateId: results.stateId || storage.getSelectedState()?.id,
            totalQuestions: results.answers.length,
            reviewMode: true
        };

        this.questions = results.answers.map(answer => {
            const allQuestions = window.currentStateQuestions || {};
            return {
                ...allQuestions[answer.questionNumber],
                questionNumber: answer.questionNumber,
                userAnswer: answer.userAnswer,
                isCorrect: answer.isCorrect
            };
        });

        this.userAnswers = results.answers;
        this.currentQuestionIndex = 0;

        return this.questions.length > 0;
    }

    /**
     * Check if in review mode
     */
    isReviewMode() {
        return this.currentQuiz?.reviewMode === true;
    }
}

// Create global instance
const quizEngine = new QuizEngine();
