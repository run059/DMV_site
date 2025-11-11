/**
 * DMV Test - Page Templates
 * Contains all HTML templates for different pages
 */

const Pages = {
    /**
     * Home Page
     */
    home: () => {
        const stats = storage.getUserStats();
        const streak = storage.getStreak();
        const selectedState = storage.getSelectedState();
        const stateName = selectedState?.displayName || 'Select State';

        return `
            <div class="space-y-6 pb-20 md:pb-6">
                <!-- Hero Card (iOS Style) -->
                <div class="relative overflow-hidden rounded-3xl p-8 shadow-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
                    <!-- Background Pattern -->
                    <div class="absolute inset-0 opacity-10">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl"></div>
                    </div>
                    
                    <div class="relative z-10">
                        <div class="flex items-start justify-between mb-6">
                            <div class="flex-1">
                                <h2 class="text-3xl md:text-4xl font-bold text-white mb-3">Progress with confidence</h2>
                                <p class="text-white/90 text-base md:text-lg max-w-md">Get exam-ready with personalized state lessons and confidence-boosting tips.</p>
                            </div>
                            ${streak.currentStreak > 0 ? `
                            <div class="ml-4 text-center bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[80px]">
                                <div class="text-5xl streak-flame mb-1">🔥</div>
                                <p class="text-2xl font-bold text-white">${streak.currentStreak}</p>
                                <p class="text-xs text-white/80 uppercase tracking-wider">Day Streak</p>
                            </div>
                            ` : ''}
                        </div>
                        
                        <!-- Active State Button -->
                        <div class="mt-6">
                            <p class="text-white/70 text-sm font-semibold mb-2 uppercase tracking-wide">Active State</p>
                            <button onclick="app.navigateTo('select-state')" class="group w-full md:w-auto flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl px-6 py-4 transition-all duration-300 border border-white/30">
                                <div class="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                    ${selectedState ? selectedState.displayName.substring(0, 2).toUpperCase() : '?'}
                                </div>
                                <div class="flex-1 text-left">
                                    <p class="font-bold text-white text-lg">${stateName}</p>
                                    <p class="text-white/80 text-sm">${selectedState ? 'Tap to change' : 'Select your state'}</p>
                                </div>
                                <i class="fas fa-chevron-right text-white/60 group-hover:text-white/90 transition-colors"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="stat-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/50">
                        <div class="flex items-center justify-between mb-2">
                            <i class="fas fa-question-circle text-blue-600 dark:text-blue-400 text-2xl"></i>
                            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">${stats.totalQuestionsSolved}</div>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Questions Solved</p>
                    </div>
                    <div class="stat-card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200/50 dark:border-green-700/50">
                        <div class="flex items-center justify-between mb-2">
                            <i class="fas fa-bullseye text-green-600 dark:text-green-400 text-2xl"></i>
                            <div class="text-3xl font-bold text-green-600 dark:text-green-400">${stats.accuracyRate}%</div>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Accuracy Rate</p>
                    </div>
                    <div class="stat-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/50 dark:border-purple-700/50">
                        <div class="flex items-center justify-between mb-2">
                            <i class="fas fa-clipboard-check text-purple-600 dark:text-purple-400 text-2xl"></i>
                            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">${stats.testsTaken}</div>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Tests Taken</p>
                    </div>
                    <div class="stat-card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200/50 dark:border-orange-700/50">
                        <div class="flex items-center justify-between mb-2">
                            <i class="fas fa-trophy text-orange-600 dark:text-orange-400 text-2xl"></i>
                            <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">${streak.bestStreak}</div>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Best Streak</p>
                    </div>
                </div>

                <!-- State Selection -->
                <div class="glass rounded-3xl p-6 shadow-card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Selected State</h3>
                        <button onclick="app.navigateTo('select-state')" class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                            Change
                        </button>
                    </div>
                    <div class="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
                        <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                            ${selectedState ? selectedState.displayName.substring(0, 2).toUpperCase() : '?'}
                        </div>
                        <div>
                            <p class="font-bold text-gray-900 dark:text-white">${stateName}</p>
                            ${selectedState ? `<p class="text-sm text-gray-600 dark:text-gray-400">Ready to practice</p>` : `<p class="text-sm text-gray-600 dark:text-gray-400">Click to select</p>`}
                        </div>
                    </div>
                </div>

                <!-- Study Modes Grid -->
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <!-- Practice Tests -->
                    <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg cursor-pointer" onclick="app.navigateTo('practice-tests')">
                        <div class="text-4xl mb-3">📝</div>
                        <h3 class="text-lg font-bold mb-1">Practice Tests</h3>
                        <p class="text-sm opacity-90">Sequential practice</p>
                    </div>

                    <!-- Test Simulator -->
                    <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg cursor-pointer" onclick="app.navigateTo('simulator-intro')">
                        <div class="text-4xl mb-3">⏱️</div>
                        <h3 class="text-lg font-bold mb-1">Simulator</h3>
                        <p class="text-sm opacity-90">Timed exam mode</p>
                    </div>

                    <!-- Flashcards -->
                    <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg cursor-pointer" onclick="app.navigateTo('flashcards')">
                        <div class="text-4xl mb-3">🎴</div>
                        <h3 class="text-lg font-bold mb-1">Flashcards</h3>
                        <p class="text-sm opacity-90">Quick review</p>
                    </div>

                    <!-- Wrong Questions -->
                    <div class="card bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-lg cursor-pointer" onclick="app.navigateTo('wrong-questions')">
                        <div class="text-4xl mb-3">❌</div>
                        <h3 class="text-lg font-bold mb-1">Wrong Q's</h3>
                        <p class="text-sm opacity-90">Review mistakes</p>
                    </div>

                    <!-- Favorites -->
                    <div class="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl p-6 shadow-lg cursor-pointer" onclick="app.navigateTo('favorites')">
                        <div class="text-4xl mb-3">⭐</div>
                        <h3 class="text-lg font-bold mb-1">Favorites</h3>
                        <p class="text-sm opacity-90">Saved questions</p>
                    </div>

                    <!-- Spaced Repetition -->
                    <div class="card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg cursor-pointer" onclick="app.navigateTo('spaced-repetition')">
                        <div class="text-4xl mb-3">🧠</div>
                        <h3 class="text-lg font-bold mb-1">Smart Review</h3>
                        <p class="text-sm opacity-90">AI-powered</p>
                    </div>
                </div>

                <!-- Support Section (iOS Style) -->
                <div class="glass rounded-3xl p-6 shadow-card border-2 border-transparent hover:border-yellow-500/30 transition-all duration-300">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 flex items-center justify-center shadow-lg">
                                <span class="text-3xl">☕</span>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Support the Developer</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Enjoying the app? Buy me a coffee to support continued development and new features!</p>
                            <button onclick="alert('☕ Coffee support feature coming soon! Thank you for your interest!')" class="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <i class="fas fa-heart"></i>
                                <span>Buy Me a Coffee</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Start Studying CTA -->
                <button onclick="app.navigateTo('practice-tests')" class="w-full btn btn-primary text-lg py-4 rounded-2xl shadow-xl">
                    <i class="fas fa-play mr-2"></i> Start Studying Now
                </button>
            </div>
        `;
    },

    /**
     * State Selection Page
     */
    selectState: () => {
        const states = window.statesIndex || [];
        const selectedState = storage.getSelectedState();

        console.log('States available:', states.length);

        if (states.length === 0) {
            return `
                <div class="text-center py-20">
                    <div class="text-6xl mb-4">⏳</div>
                    <p class="text-gray-600 dark:text-gray-400 text-lg">Loading states...</p>
                </div>
            `;
        }

        return `
            <div class="space-y-6 pb-20 md:pb-6">
                <div class="text-center mb-6">
                    <h2 class="text-3xl font-bold gradient-text mb-2">Select Your State</h2>
                    <p class="text-gray-600 dark:text-gray-400">Choose the state where you'll take your DMV test</p>
                </div>

                <!-- Search Bar -->
                <div class="glass rounded-2xl p-4 shadow-card">
                    <input
                        type="text"
                        id="stateSearch"
                        placeholder="Search states..."
                        class="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white text-lg"
                        onkeyup="app.filterStates(this.value)"
                    >
                </div>

                <!-- States Grid -->
                <div id="statesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${states.map(state => `
                        <div class="card stat-card cursor-pointer ${selectedState?.id === state.id ? 'ring-4 ring-blue-500' : ''}"
                             onclick="app.selectState('${state.id}')">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                                        ${state.displayName.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p class="font-bold text-gray-900 dark:text-white">${state.displayName}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">DMV Test</p>
                                    </div>
                                </div>
                                ${selectedState?.id === state.id ? '<i class="fas fa-check-circle text-blue-600 text-xl"></i>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Practice Tests List
     */
    practiceTests: () => {
        const properties = window.currentStateProperties || {};
        const questionsPerTest = properties.practiceQuestionsPerTest || 20;
        const totalQuestions = Object.keys(window.currentStateQuestions || {}).length;
        const totalTests = Math.ceil(totalQuestions / questionsPerTest);

        const tests = [];
        for (let i = 1; i <= totalTests; i++) {
            const progress = storage.getTestProgress(storage.getSelectedState()?.id, i);
            tests.push({
                number: i,
                completed: progress.completed,
                score: progress.score || 0
            });
        }

        return `
            <div class="space-y-6 pb-20 md:pb-6">
                <div class="glass rounded-3xl p-6 shadow-card">
                    <h2 class="text-2xl font-bold gradient-text mb-2">Practice Tests</h2>
                    <p class="text-gray-600 dark:text-gray-400">Complete sequential practice tests to master all questions</p>
                    <div class="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Questions per test</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">${questionsPerTest}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Total tests</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">${totalTests}</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${tests.map(test => `
                        <div class="card stat-card cursor-pointer hover:shadow-xl" onclick="app.startPracticeTest(${test.number})">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Test ${test.number}</h3>
                                ${test.completed ?
                                    `<span class="badge badge-success">✓ ${test.score}%</span>` :
                                    `<span class="badge badge-primary">New</span>`
                                }
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${questionsPerTest} questions</p>
                            <div class="flex items-center justify-between">
                                <button class="btn btn-primary px-4 py-2 text-sm">
                                    ${test.completed ? 'Retake' : 'Start'} Test
                                </button>
                                ${test.completed ?
                                    `<button onclick="event.stopPropagation(); app.reviewTest(${test.number})" class="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                                        Review
                                    </button>` :
                                    ''
                                }
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Quiz View
     */
    quiz: () => {
        const question = quizEngine.getCurrentQuestion();
        const progress = quizEngine.getProgress();
        const isFavorite = quizEngine.isCurrentFavorite();

        if (!question) {
            return '<div class="text-center py-20"><p class="text-gray-600 dark:text-gray-400">No questions available</p></div>';
        }

        return `
            <div class="max-w-4xl mx-auto space-y-4 pb-20 md:pb-6">
                <!-- Timer (for simulator mode) -->
                ${quizEngine.currentQuiz.type === 'simulator' ? `
                <div class="glass rounded-2xl p-4 shadow-card text-center">
                    <div class="flex items-center justify-center space-x-2">
                        <i class="fas fa-clock text-blue-600 dark:text-blue-400"></i>
                        <span id="quizTimer" class="text-2xl font-bold text-gray-900 dark:text-white">--:--</span>
                    </div>
                </div>
                ` : ''}

                <!-- Progress Bar -->
                <div class="glass rounded-2xl p-4 shadow-card">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Question ${progress.current} of ${progress.total}</span>
                        <span class="text-sm font-medium text-blue-600 dark:text-blue-400">${progress.percentage}%</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="progress-bar bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style="width: ${progress.percentage}%"></div>
                    </div>
                </div>

                <!-- Question Card -->
                <div id="questionCard" class="glass rounded-3xl p-8 shadow-xl slide-in">
                    <!-- Question Text -->
                    <div class="mb-6">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
                            ${question.question}
                        </h3>
                    </div>

                    <!-- Question Image -->
                    ${question.image ? `
                    <div class="mb-6">
                        <img
                            src="images/${question.image.toLowerCase()}.jpg"
                            alt="Question image"
                            class="w-full max-w-md mx-auto rounded-2xl shadow-lg image-zoom"
                            onclick="this.classList.toggle('zoomed')"
                            onerror="this.src='images/${question.image.toLowerCase()}.png'; this.onerror=function(){this.style.display='none'};"
                        >
                    </div>
                    ` : ''}

                    <!-- Answer Options -->
                    <div class="space-y-3" id="answerOptions">
                        ${['A', 'B', 'C', 'D'].map((letter, index) => {
                            const optionNumber = index + 1;
                            const optionText = question[`option${optionNumber}`];
                            return `
                                <button
                                    class="answer-option w-full text-left p-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all"
                                    onclick="app.submitAnswer(${optionNumber})"
                                    data-option="${optionNumber}"
                                >
                                    <div class="flex items-center space-x-3">
                                        <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300">
                                            ${letter}
                                        </div>
                                        <span class="text-gray-900 dark:text-white flex-1">${optionText}</span>
                                    </div>
                                </button>
                            `;
                        }).join('')}
                    </div>

                    <!-- Navigation Buttons -->
                    <div class="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onclick="app.previousQuestion()"
                            class="btn btn-secondary btn-quiz-nav flex items-center justify-center"
                            ${progress.current === 1 ? 'disabled' : ''}
                        >
                            <i class="fas fa-arrow-left mr-3"></i> Previous
                        </button>

                        <button
                            onclick="app.toggleFavorite()"
                            class="btn-favorite ${isFavorite ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}"
                        >
                            <i class="fas fa-heart"></i>
                        </button>

                        <button
                            id="nextButton"
                            onclick="app.nextQuestion()"
                            class="btn btn-primary btn-quiz-nav flex items-center justify-center"
                            disabled
                        >
                            ${progress.current === progress.total ? 'Finish' : 'Next'} <i class="fas fa-arrow-right ml-3"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Score/Results View
     */
    score: (results) => {
        const passed = results.passed;
        const percentage = results.percentage;

        return `
            <div class="max-w-3xl mx-auto space-y-6 pb-20 md:pb-6">
                <!-- Result Card -->
                <div class="glass rounded-3xl p-8 shadow-xl text-center">
                    <div class="text-6xl mb-4">${passed ? '🎉' : '📚'}</div>
                    <h2 class="text-3xl font-bold mb-2 ${passed ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}">
                        ${passed ? 'Congratulations!' : 'Keep Practicing!'}
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                        ${passed ? 'You passed this test!' : 'You need more practice'}
                    </p>

                    <!-- Score Circle -->
                    <div class="inline-flex items-center justify-center w-48 h-48 rounded-full ${passed ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-orange-400 to-orange-600'} mb-6">
                        <div class="text-6xl font-bold text-white">${percentage}%</div>
                    </div>

                    <!-- Stats Grid -->
                    <div class="grid grid-cols-3 gap-4 mt-6">
                        <div class="stat-card">
                            <div class="text-3xl font-bold text-green-600 dark:text-green-400">${results.correct}</div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Correct</p>
                        </div>
                        <div class="stat-card">
                            <div class="text-3xl font-bold text-red-600 dark:text-red-400">${results.incorrect}</div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Incorrect</p>
                        </div>
                        <div class="stat-card">
                            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">${results.total}</div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</p>
                        </div>
                    </div>

                    ${results.allowedMistakes ? `
                    <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <p class="text-sm text-gray-700 dark:text-gray-300">
                            Allowed mistakes: <span class="font-bold">${results.allowedMistakes}</span>
                            • You made: <span class="font-bold ${results.incorrect <= results.allowedMistakes ? 'text-green-600' : 'text-red-600'}">${results.incorrect}</span>
                        </p>
                    </div>
                    ` : ''}

                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        <i class="fas fa-clock mr-1"></i> Completed in ${results.durationFormatted}
                    </p>
                </div>

                <!-- Action Buttons -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onclick="app.navigateTo('home')" class="btn btn-secondary py-4">
                        <i class="fas fa-home mr-2"></i> Home
                    </button>
                    <button onclick="app.reviewQuiz()" class="btn btn-primary py-4">
                        <i class="fas fa-eye mr-2"></i> Review Answers
                    </button>
                    <button onclick="app.retakeQuiz()" class="btn btn-success py-4">
                        <i class="fas fa-redo mr-2"></i> Retake Test
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * AI Insights Page
     */
    aiInsights: () => {
        const stateId = storage.getSelectedState()?.id;
        if (!stateId) {
            return '<div class="text-center py-20"><p class="text-gray-600 dark:text-gray-400">Please select a state first</p></div>';
        }

        const prediction = aiEngine.predictExamSuccess(stateId);
        const weakAreas = aiEngine.analyzeWeakAreas(stateId);
        const studyPlan = aiEngine.generateDailyStudyPlan(stateId);

        return `
            <div class="space-y-6 pb-20 md:pb-6">
                <div class="text-center mb-6">
                    <h2 class="text-3xl font-bold gradient-text mb-2">AI Insights</h2>
                    <p class="text-gray-600 dark:text-gray-400">Personalized analysis powered by machine learning</p>
                </div>

                <!-- Exam Success Prediction -->
                <div class="glass rounded-3xl p-8 shadow-xl">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <i class="fas fa-brain mr-2 text-purple-600"></i> Exam Success Prediction
                    </h3>
                    <div class="text-center mb-6">
                        <div class="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 mb-4">
                            <div class="text-5xl font-bold text-white">${prediction.successRate}%</div>
                        </div>
                        <p class="text-lg font-semibold text-gray-900 dark:text-white">Predicted Pass Rate</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Confidence: <span class="font-bold">${prediction.confidence}</span> •
                            Status: <span class="font-bold">${prediction.readiness}</span>
                        </p>
                    </div>

                    <!-- Insights -->
                    <div class="space-y-2 mb-6">
                        ${prediction.insights.map(insight => `
                            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-gray-700 dark:text-gray-300">
                                ${insight}
                            </div>
                        `).join('')}
                    </div>

                    <!-- Breakdown -->
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                        ${Object.entries(prediction.breakdown).map(([key, value]) => `
                            <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${value}%</div>
                                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 capitalize">${key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Weak Areas -->
                ${weakAreas.length > 0 ? `
                <div class="glass rounded-3xl p-6 shadow-card">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <i class="fas fa-exclamation-triangle mr-2 text-red-600"></i> Weak Areas
                    </h3>
                    <div class="space-y-3">
                        ${weakAreas.map(area => `
                            <div class="p-4 bg-white dark:bg-gray-800 rounded-xl">
                                <div class="flex items-center justify-between mb-2">
                                    <h4 class="font-bold text-gray-900 dark:text-white">${area.topic}</h4>
                                    <span class="badge ${area.severity === 'critical' ? 'badge-danger' : area.severity === 'high' ? 'badge-warning' : 'badge-primary'}">
                                        ${area.severity.toUpperCase()}
                                    </span>
                                </div>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${area.improvementPlan}</p>
                                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>${area.correctAnswers}/${area.totalQuestions} correct (${area.accuracy}%)</span>
                                    <span><i class="fas fa-clock mr-1"></i> ~${area.estimatedStudyTime} min</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Daily Study Plan -->
                ${studyPlan.length > 0 ? `
                <div class="glass rounded-3xl p-6 shadow-card">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <i class="fas fa-calendar-check mr-2 text-green-600"></i> Today's Study Plan
                    </h3>
                    <div class="space-y-3">
                        ${studyPlan.map((task, index) => `
                            <div class="p-4 bg-white dark:bg-gray-800 rounded-xl">
                                <div class="flex items-start justify-between mb-2">
                                    <div class="flex items-start space-x-3 flex-1">
                                        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
                                            ${index + 1}
                                        </div>
                                        <div class="flex-1">
                                            <h4 class="font-bold text-gray-900 dark:text-white">${task.title}</h4>
                                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${task.description}</p>
                                        </div>
                                    </div>
                                    <span class="badge ${task.priority === 'high' ? 'badge-danger' : task.priority === 'medium' ? 'badge-warning' : 'badge-primary'}">
                                        ${task.priority}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between mt-3">
                                    <span class="text-xs text-gray-500 dark:text-gray-400">
                                        <i class="fas fa-clock mr-1"></i> ~${task.estimatedTime} min
                                    </span>
                                    <button onclick="app.executeStudyTask('${task.action}')" class="text-blue-600 dark:text-blue-400 text-sm hover:underline font-medium">
                                        Start →
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    },

    /**
     * Statistics Page
     */
    statistics: () => {
        const summary = statsManager.getSummary();
        const achievements = statsManager.getAchievements();

        setTimeout(() => {
            statsManager.render7DayChart('performanceChart');
        }, 100);

        return `
            <div class="space-y-6 pb-20 md:pb-6">
                <div class="text-center mb-6">
                    <h2 class="text-3xl font-bold gradient-text mb-2">Statistics</h2>
                    <p class="text-gray-600 dark:text-gray-400">Track your progress and performance</p>
                </div>

                <!-- Summary Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="stat-card text-center">
                        <div class="text-4xl mb-2">📊</div>
                        <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">${summary.totalQuestions}</div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Questions</p>
                    </div>
                    <div class="stat-card text-center">
                        <div class="text-4xl mb-2">🎯</div>
                        <div class="text-3xl font-bold text-green-600 dark:text-green-400">${summary.accuracy}%</div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Accuracy</p>
                    </div>
                    <div class="stat-card text-center">
                        <div class="text-4xl mb-2">📝</div>
                        <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">${summary.testsTaken}</div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Tests Taken</p>
                    </div>
                    <div class="stat-card text-center">
                        <div class="text-4xl mb-2">🔥</div>
                        <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">${summary.currentStreak}</div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Day Streak</p>
                    </div>
                </div>

                <!-- 7-Day Performance Chart -->
                <div class="glass rounded-3xl p-6 shadow-card">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">7-Day Performance</h3>
                    <div class="chart-container">
                        <canvas id="performanceChart"></canvas>
                    </div>
                </div>

                <!-- Detailed Stats -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="stat-card">
                        <h4 class="font-bold text-gray-900 dark:text-white mb-3">✅ Correct Answers</h4>
                        <div class="flex items-center justify-between">
                            <span class="text-3xl font-bold text-green-600 dark:text-green-400">${summary.correct}</span>
                            <div class="text-right">
                                <p class="text-sm text-gray-600 dark:text-gray-400">out of ${summary.totalQuestions}</p>
                            </div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <h4 class="font-bold text-gray-900 dark:text-white mb-3">❌ Incorrect Answers</h4>
                        <div class="flex items-center justify-between">
                            <span class="text-3xl font-bold text-red-600 dark:text-red-400">${summary.incorrect}</span>
                            <div class="text-right">
                                <p class="text-sm text-gray-600 dark:text-gray-400">out of ${summary.totalQuestions}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Achievements -->
                ${achievements.length > 0 ? `
                <div class="glass rounded-3xl p-6 shadow-card">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">🏆 Achievements</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        ${achievements.map(achievement => `
                            <div class="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl text-center">
                                <div class="text-4xl mb-2">${achievement.icon}</div>
                                <p class="font-bold text-gray-900 dark:text-white text-sm">${achievement.title}</p>
                                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">${achievement.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    },

    /**
     * Settings Page
     */
    settings: () => {
        const settings = storage.getSettings();
        const stats = storage.getUserStats();

        return `
            <div class="max-w-2xl mx-auto space-y-6 pb-20 md:pb-6">
                <div class="text-center mb-6">
                    <h2 class="text-3xl font-bold gradient-text mb-2">Settings</h2>
                    <p class="text-gray-600 dark:text-gray-400">Customize your experience</p>
                </div>

                <!-- Theme Setting -->
                <div class="glass rounded-3xl p-6 shadow-card">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Appearance</h3>
                    <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl">
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Enable dark theme</p>
                        </div>
                        <button onclick="app.toggleDarkMode()" class="relative w-14 h-8 bg-gray-300 dark:bg-blue-600 rounded-full transition-colors">
                            <div class="absolute top-1 left-1 dark:left-7 w-6 h-6 bg-white rounded-full transition-all shadow-md"></div>
                        </button>
                    </div>
                </div>

                <!-- Data Management -->
                <div class="glass rounded-3xl p-6 shadow-card">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Data Management</h3>
                    <div class="space-y-3">
                        <button onclick="app.exportData()" class="w-full p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all text-left">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-gray-900 dark:text-white">Export Data</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Download your progress as JSON</p>
                                </div>
                                <i class="fas fa-download text-blue-600"></i>
                            </div>
                        </button>
                        <button onclick="app.importData()" class="w-full p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all text-left">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-gray-900 dark:text-white">Import Data</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Restore from backup</p>
                                </div>
                                <i class="fas fa-upload text-green-600"></i>
                            </div>
                        </button>
                        <button onclick="app.clearAllData()" class="w-full p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all text-left">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-red-600 dark:text-red-400">Clear All Data</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Reset everything</p>
                                </div>
                                <i class="fas fa-trash text-red-600"></i>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- About -->
                <div class="glass rounded-3xl p-6 shadow-card text-center">
                    <div class="text-4xl mb-3">🚗</div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">DMV Practice Test</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Version 1.0.0</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        © 2025 DMV Test. All rights reserved.<br>
                        Master your driver's license exam with AI-powered learning.
                    </p>
                </div>
            </div>
        `;
    },

    /**
     * Flashcards Page
     */
    flashcards: () => {
        const selectedState = storage.getSelectedState();
        if (!selectedState) {
            return `
                <div class="text-center py-20">
                    <div class="text-6xl mb-4">📍</div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select a State First</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Choose your state to start practicing</p>
                    <button onclick="app.navigateTo('select-state')" class="btn btn-primary">
                        <i class="fas fa-map-marker-alt mr-2"></i> Select State
                    </button>
                </div>
            `;
        }

        return `
            <div class="max-w-3xl mx-auto space-y-6 pb-20 md:pb-6">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">🎴</div>
                    <h2 class="text-3xl font-bold gradient-text mb-2">Flashcards</h2>
                    <p class="text-gray-600 dark:text-gray-400">Quick review with swipeable cards</p>
                </div>

                <!-- Options -->
                <div class="glass rounded-3xl p-6 shadow-card space-y-4">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Number of Cards</h3>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button onclick="app.startFlashcards(10)" class="p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg transition-all">
                            <div class="text-2xl font-bold mb-1">10</div>
                            <div class="text-sm opacity-90">Quick</div>
                        </button>
                        <button onclick="app.startFlashcards(20)" class="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all">
                            <div class="text-2xl font-bold mb-1">20</div>
                            <div class="text-sm opacity-90">Standard</div>
                        </button>
                        <button onclick="app.startFlashcards(30)" class="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg transition-all">
                            <div class="text-2xl font-bold mb-1">30</div>
                            <div class="text-sm opacity-90">Extended</div>
                        </button>
                        <button onclick="app.startFlashcards(50)" class="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-lg transition-all">
                            <div class="text-2xl font-bold mb-1">50</div>
                            <div class="text-sm opacity-90">Marathon</div>
                        </button>
                    </div>
                </div>

                <!-- Info -->
                <div class="glass rounded-2xl p-6 shadow-card">
                    <h3 class="font-bold text-gray-900 dark:text-white mb-3">How it works:</h3>
                    <ul class="space-y-2 text-gray-600 dark:text-gray-400">
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-2 mt-1"></i>
                            <span>Swipe right for next question</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-2 mt-1"></i>
                            <span>Tap to reveal answer</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-2 mt-1"></i>
                            <span>Mark favorites with heart icon</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    },

    /**
     * Simulator Intro Page
     */
    simulatorIntro: () => {
        const selectedState = storage.getSelectedState();
        const properties = window.currentStateProperties || {};
        const questionCount = properties.simulatorQuestions || 30;
        const timeLimit = properties.timeLimit || 30;
        const allowedMistakes = properties.allowedMistakes || 6;

        if (!selectedState) {
            return `
                <div class="text-center py-20">
                    <div class="text-6xl mb-4">📍</div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select a State First</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Choose your state to start the simulator</p>
                    <button onclick="app.navigateTo('select-state')" class="btn btn-primary">
                        <i class="fas fa-map-marker-alt mr-2"></i> Select State
                    </button>
                </div>
            `;
        }

        return `
            <div class="max-w-3xl mx-auto space-y-6 pb-20 md:pb-6">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">⏱️</div>
                    <h2 class="text-3xl font-bold gradient-text mb-2">Test Simulator</h2>
                    <p class="text-gray-600 dark:text-gray-400">Real exam conditions with timer</p>
                </div>

                <!-- Test Info -->
                <div class="glass rounded-3xl p-8 shadow-card">
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        ${selectedState.displayName} DMV Test
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                            <div class="text-3xl mb-2">📝</div>
                            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${questionCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">Questions</div>
                        </div>
                        <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                            <div class="text-3xl mb-2">⏱️</div>
                            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">${timeLimit} min</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">Time Limit</div>
                        </div>
                        <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                            <div class="text-3xl mb-2">✅</div>
                            <div class="text-2xl font-bold text-green-600 dark:text-green-400">${questionCount - allowedMistakes}/${questionCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">To Pass</div>
                        </div>
                    </div>

                    <div class="space-y-3 mb-6">
                        <div class="flex items-start">
                            <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-3 mt-1"></i>
                            <span class="text-gray-700 dark:text-gray-300">Simulates actual DMV test conditions</span>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-3 mt-1"></i>
                            <span class="text-gray-700 dark:text-gray-300">Random questions from question bank</span>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-3 mt-1"></i>
                            <span class="text-gray-700 dark:text-gray-300">Timer counts down automatically</span>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-3 mt-1"></i>
                            <span class="text-gray-700 dark:text-gray-300">Instant pass/fail results</span>
                        </div>
                    </div>

                    <button onclick="app.startSimulator()" class="w-full btn btn-primary text-lg py-4 rounded-2xl shadow-xl">
                        <i class="fas fa-play mr-2"></i> Start Simulator
                    </button>
                </div>

                <!-- Tips -->
                <div class="glass rounded-2xl p-6 shadow-card bg-yellow-50 dark:bg-yellow-900/20">
                    <div class="flex items-start">
                        <i class="fas fa-lightbulb text-yellow-600 dark:text-yellow-400 text-2xl mr-3 mt-1"></i>
                        <div>
                            <h4 class="font-bold text-gray-900 dark:text-white mb-2">Pro Tips:</h4>
                            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Read each question carefully before answering</li>
                                <li>• Manage your time - don't spend too long on one question</li>
                                <li>• Review your answers if time permits</li>
                                <li>• Stay calm and confident!</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Wrong Questions Page
     */
    wrongQuestions: () => {
        const selectedState = storage.getSelectedState();
        if (!selectedState) {
            return `
                <div class="text-center py-20">
                    <div class="text-6xl mb-4">📍</div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select a State First</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Choose your state to review wrong answers</p>
                    <button onclick="app.navigateTo('select-state')" class="btn btn-primary">
                        <i class="fas fa-map-marker-alt mr-2"></i> Select State
                    </button>
                </div>
            `;
        }

        const wrongAnswers = storage.getWrongAnswers();
        const stateWrongAnswers = wrongAnswers.filter(key => key.startsWith(`${selectedState.id}_`));
        const count = stateWrongAnswers.length;

        return `
            <div class="max-w-3xl mx-auto space-y-6 pb-20 md:pb-6">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">❌</div>
                    <h2 class="text-3xl font-bold gradient-text mb-2">Wrong Questions</h2>
                    <p class="text-gray-600 dark:text-gray-400">Review and master your mistakes</p>
                </div>

                ${count === 0 ? `
                    <!-- No Wrong Answers -->
                    <div class="glass rounded-3xl p-12 shadow-card text-center">
                        <div class="text-6xl mb-4">🎉</div>
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Perfect!</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-6">
                            You haven't answered any questions incorrectly yet.<br>
                            Keep up the great work!
                        </p>
                        <button onclick="app.navigateTo('practice-tests')" class="btn btn-primary">
                            <i class="fas fa-play mr-2"></i> Start Practicing
                        </button>
                    </div>
                ` : `
                    <!-- Stats Card -->
                    <div class="glass rounded-3xl p-6 shadow-card">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">${count}</h3>
                                <p class="text-gray-600 dark:text-gray-400">Wrong answers to review</p>
                            </div>
                            <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                                <i class="fas fa-times text-3xl text-red-600 dark:text-red-400"></i>
                            </div>
                        </div>

                        <button onclick="app.startWrongQuestionsReview()" class="w-full btn btn-primary rounded-xl">
                            <i class="fas fa-redo mr-2"></i> Review Wrong Questions
                        </button>
                    </div>

                    <!-- Info -->
                    <div class="glass rounded-2xl p-6 shadow-card">
                        <h3 class="font-bold text-gray-900 dark:text-white mb-3">Why review mistakes?</h3>
                        <ul class="space-y-2 text-gray-600 dark:text-gray-400">
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-2 mt-1"></i>
                                <span>Learn from your errors</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-2 mt-1"></i>
                                <span>Reinforce correct answers</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-2 mt-1"></i>
                                <span>Improve weak areas</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-2 mt-1"></i>
                                <span>Boost exam confidence</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Clear Wrong Answers -->
                    <div class="text-center">
                        <button onclick="app.clearWrongAnswers()" class="text-red-600 dark:text-red-400 hover:underline text-sm">
                            <i class="fas fa-trash mr-1"></i> Clear all wrong answers
                        </button>
                    </div>
                `}
            </div>
        `;
    },

    /**
     * Favorites Page
     */
    favorites: () => {
        const selectedState = storage.getSelectedState();
        if (!selectedState) {
            return `
                <div class="text-center py-20">
                    <div class="text-6xl mb-4">📍</div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select a State First</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Choose your state to view favorites</p>
                    <button onclick="app.navigateTo('select-state')" class="btn btn-primary">
                        <i class="fas fa-map-marker-alt mr-2"></i> Select State
                    </button>
                </div>
            `;
        }

        const favorites = storage.getFavorites();
        const stateFavorites = favorites.filter(key => key.startsWith(`${selectedState.id}_`));
        const count = stateFavorites.length;

        return `
            <div class="max-w-3xl mx-auto space-y-6 pb-20 md:pb-6">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">⭐</div>
                    <h2 class="text-3xl font-bold gradient-text mb-2">Favorite Questions</h2>
                    <p class="text-gray-600 dark:text-gray-400">Questions you've saved for review</p>
                </div>

                ${count === 0 ? `
                    <!-- No Favorites -->
                    <div class="glass rounded-3xl p-12 shadow-card text-center">
                        <div class="text-6xl mb-4">💫</div>
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Favorites Yet</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-6">
                            Tap the heart icon while practicing to save<br>
                            questions for later review.
                        </p>
                        <button onclick="app.navigateTo('practice-tests')" class="btn btn-primary">
                            <i class="fas fa-play mr-2"></i> Start Practicing
                        </button>
                    </div>
                ` : `
                    <!-- Stats Card -->
                    <div class="glass rounded-3xl p-6 shadow-card">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">${count}</h3>
                                <p class="text-gray-600 dark:text-gray-400">Saved questions</p>
                            </div>
                            <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center">
                                <i class="fas fa-heart text-3xl text-yellow-600 dark:text-yellow-400"></i>
                            </div>
                        </div>

                        <button onclick="app.startFavoritesReview()" class="w-full btn btn-primary rounded-xl">
                            <i class="fas fa-heart mr-2"></i> Review Favorites
                        </button>
                    </div>

                    <!-- Info -->
                    <div class="glass rounded-2xl p-6 shadow-card">
                        <h3 class="font-bold text-gray-900 dark:text-white mb-3">Using Favorites:</h3>
                        <ul class="space-y-2 text-gray-600 dark:text-gray-400">
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-2 mt-1"></i>
                                <span>Save important or challenging questions</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-2 mt-1"></i>
                                <span>Quick access to topics you want to master</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-2 mt-1"></i>
                                <span>Perfect for last-minute review</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Clear Favorites -->
                    <div class="text-center">
                        <button onclick="app.clearFavorites()" class="text-gray-600 dark:text-gray-400 hover:underline text-sm">
                            <i class="fas fa-trash mr-1"></i> Clear all favorites
                        </button>
                    </div>
                `}
            </div>
        `;
    },

    /**
     * Spaced Repetition Page
     */
    spacedRepetition: () => {
        const selectedState = storage.getSelectedState();
        if (!selectedState) {
            return `
                <div class="text-center py-20">
                    <div class="text-6xl mb-4">📍</div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select a State First</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Choose your state to use AI-powered review</p>
                    <button onclick="app.navigateTo('select-state')" class="btn btn-primary">
                        <i class="fas fa-map-marker-alt mr-2"></i> Select State
                    </button>
                </div>
            `;
        }

        const priorityQuestions = aiEngine.getPriorityQuestions(selectedState.id, 20);
        const count = priorityQuestions.length;

        return `
            <div class="max-w-3xl mx-auto space-y-6 pb-20 md:pb-6">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">🧠</div>
                    <h2 class="text-3xl font-bold gradient-text mb-2">Smart Review</h2>
                    <p class="text-gray-600 dark:text-gray-400">AI-powered spaced repetition</p>
                </div>

                ${count === 0 ? `
                    <!-- No Questions Yet -->
                    <div class="glass rounded-3xl p-12 shadow-card text-center">
                        <div class="text-6xl mb-4">🎓</div>
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Start Learning First</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-6">
                            Answer some questions to enable AI-powered review.<br>
                            The system will track your progress automatically.
                        </p>
                        <button onclick="app.navigateTo('practice-tests')" class="btn btn-primary">
                            <i class="fas fa-play mr-2"></i> Start Practicing
                        </button>
                    </div>
                ` : `
                    <!-- AI Info Card -->
                    <div class="glass rounded-3xl p-6 shadow-card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                                <i class="fas fa-brain"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white">AI Recommendation</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Personalized for you</p>
                            </div>
                        </div>
                        <p class="text-gray-700 dark:text-gray-300 mb-4">
                            Based on your performance, we've selected <strong>${count} priority questions</strong>
                            that will help you learn most effectively right now.
                        </p>
                        <button onclick="app.startSpacedRepetition()" class="w-full btn btn-primary rounded-xl">
                            <i class="fas fa-play mr-2"></i> Start Smart Review
                        </button>
                    </div>

                    <!-- How It Works -->
                    <div class="glass rounded-2xl p-6 shadow-card">
                        <h3 class="font-bold text-gray-900 dark:text-white mb-3">How it works:</h3>
                        <ul class="space-y-2 text-gray-600 dark:text-gray-400">
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-indigo-600 dark:text-indigo-400 mr-2 mt-1"></i>
                                <span>Uses SM-2 algorithm for optimal review timing</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-indigo-600 dark:text-indigo-400 mr-2 mt-1"></i>
                                <span>Prioritizes questions you're about to forget</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-indigo-600 dark:text-indigo-400 mr-2 mt-1"></i>
                                <span>Adapts to your learning progress</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-indigo-600 dark:text-indigo-400 mr-2 mt-1"></i>
                                <span>Maximizes long-term retention</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Science Behind It -->
                    <div class="glass rounded-2xl p-6 shadow-card bg-blue-50 dark:bg-blue-900/20">
                        <div class="flex items-start">
                            <i class="fas fa-graduation-cap text-blue-600 dark:text-blue-400 text-2xl mr-3 mt-1"></i>
                            <div>
                                <h4 class="font-bold text-gray-900 dark:text-white mb-2">The Science:</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    Spaced repetition is a learning technique proven by cognitive science to
                                    improve long-term memory retention. By reviewing material at optimal intervals,
                                    you can learn more efficiently and remember longer.
                                </p>
                            </div>
                        </div>
                    </div>
                `}
            </div>
        `;
    }
};
