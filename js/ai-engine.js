/**
 * DMV Test - AI Learning Engine
 * Implements ML algorithms for predictions, weak area analysis, and study recommendations
 */

class AIEngine {
    constructor() {
        this.topicKeywords = {
            'Speed Limits': ['speed', 'mph', 'limit', 'maximum', 'minimum', 'faster', 'slower'],
            'Traffic Signs': ['sign', 'octagon', 'triangle', 'diamond', 'circular', 'rectangular', 'pentagon'],
            'Right of Way': ['yield', 'right of way', 'priority', 'intersection', 'pedestrian', 'crosswalk'],
            'Parking': ['park', 'parking', 'curb', 'distance', 'feet', 'inches', 'stop sign', 'fire hydrant'],
            'Lane Usage': ['lane', 'passing', 'overtake', 'left lane', 'right lane', 'center lane', 'merge'],
            'Turning': ['turn', 'left turn', 'right turn', 'u-turn', 'signal', 'blinker', 'indicator'],
            'Alcohol & Drugs': ['alcohol', 'drug', 'bac', 'blood', 'dui', 'dwi', 'intoxicated', 'impaired'],
            'Weather Conditions': ['rain', 'snow', 'fog', 'ice', 'wet', 'slippery', 'visibility', 'weather'],
            'Vehicle Equipment': ['brake', 'tire', 'headlight', 'mirror', 'windshield', 'horn', 'seatbelt'],
            'Following Distance': ['follow', 'distance', 'seconds', 'space', 'cushion', 'tailgating'],
            'Emergency Vehicles': ['emergency', 'ambulance', 'fire truck', 'police', 'siren', 'flashing'],
            'School Zones': ['school', 'children', 'playground', 'bus', 'crossing guard'],
            'Highway Driving': ['highway', 'freeway', 'expressway', 'entrance ramp', 'exit ramp', 'merge'],
            'Pedestrians': ['pedestrian', 'crosswalk', 'sidewalk', 'walking', 'crossing'],
            'Motorcycles': ['motorcycle', 'motorbike', 'bike', 'cyclist', 'bicycle'],
            'License & Documentation': ['license', 'registration', 'insurance', 'permit', 'identification']
        };
    }

    /**
     * Predict exam success rate
     * Algorithm considers: accuracy, coverage, consistency, streak, and weak topics
     */
    predictExamSuccess(stateId) {
        const stats = storage.getUserStats();
        const answers = storage.getAnswers(stateId) || {};
        const wrongAnswers = storage.getWrongAnswers();
        const streak = storage.getStreak();

        // Get total questions for state
        const totalQuestions = Object.keys(window.currentStateQuestions || {}).length;
        const answeredQuestions = Object.keys(answers).length;

        // 1. Overall accuracy (50% weight)
        const accuracyScore = parseFloat(stats.accuracyRate) || 0;

        // 2. Question coverage (20% weight)
        const coverageRate = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
        const coverageScore = Math.min(coverageRate, 100);

        // 3. Consistency score (15% weight)
        // Check if recent performance is stable
        const recentAnswers = Object.values(answers)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 20);

        const recentCorrect = recentAnswers.filter(a => a.correct).length;
        const recentAccuracy = recentAnswers.length > 0 ? (recentCorrect / recentAnswers.length) * 100 : 0;
        const consistencyScore = Math.abs(accuracyScore - recentAccuracy) < 10 ? 100 : 70;

        // 4. Study streak bonus (10% weight)
        const streakScore = Math.min(streak.currentStreak * 10, 100);

        // 5. Weak topics penalty (15% weight)
        const weakTopics = this.analyzeWeakAreas(stateId);
        const criticalTopics = weakTopics.filter(t => t.severity === 'critical').length;
        const weakTopicScore = Math.max(100 - (criticalTopics * 20), 0);

        // Calculate weighted score
        const successRate = (
            (accuracyScore * 0.50) +
            (coverageScore * 0.20) +
            (consistencyScore * 0.15) +
            (streakScore * 0.10) +
            (weakTopicScore * 0.15)
        );

        // Determine confidence level
        let confidence = 'Low';
        if (answeredQuestions >= 50 && stats.testsTaken >= 3) {
            confidence = 'High';
        } else if (answeredQuestions >= 20 && stats.testsTaken >= 1) {
            confidence = 'Medium';
        }

        // Determine readiness level
        let readiness = 'Not Ready';
        if (successRate >= 85 && answeredQuestions >= 30) {
            readiness = 'Ready';
        } else if (successRate >= 75 && answeredQuestions >= 20) {
            readiness = 'Almost Ready';
        } else if (successRate >= 60) {
            readiness = 'Needs Work';
        }

        // Calculate recommended study hours
        const hoursNeeded = Math.max(0, Math.ceil((85 - successRate) / 10));

        return {
            successRate: Math.round(successRate),
            confidence,
            readiness,
            recommendedStudyHours: hoursNeeded,
            breakdown: {
                accuracy: Math.round(accuracyScore),
                coverage: Math.round(coverageScore),
                consistency: Math.round(consistencyScore),
                streak: Math.round(streakScore),
                weakTopics: Math.round(weakTopicScore)
            },
            insights: this.generateInsights(successRate, readiness, criticalTopics, streak.currentStreak)
        };
    }

    /**
     * Generate personalized insights
     */
    generateInsights(successRate, readiness, criticalTopics, streak) {
        const insights = [];

        if (successRate >= 85) {
            insights.push("🎉 Excellent! You're performing above the passing threshold.");
        } else if (successRate >= 75) {
            insights.push("📈 Good progress! A bit more practice will get you exam-ready.");
        } else if (successRate >= 60) {
            insights.push("💪 Keep studying! Focus on your weak areas to improve faster.");
        } else {
            insights.push("📚 More practice needed. Don't worry, you'll get there!");
        }

        if (criticalTopics > 0) {
            insights.push(`⚠️ You have ${criticalTopics} critical weak area${criticalTopics > 1 ? 's' : ''}. Focus on these first.`);
        }

        if (streak >= 7) {
            insights.push(`🔥 Amazing ${streak}-day streak! Consistency is key to success.`);
        } else if (streak >= 3) {
            insights.push(`✨ Great ${streak}-day streak! Keep it up.`);
        }

        return insights;
    }

    /**
     * Analyze weak areas by topic
     */
    analyzeWeakAreas(stateId) {
        const answers = storage.getAnswers(stateId) || {};
        const questions = window.currentStateQuestions || {};

        const topicStats = {};

        // Initialize topics
        Object.keys(this.topicKeywords).forEach(topic => {
            topicStats[topic] = { correct: 0, total: 0, questionNumbers: [] };
        });

        // Analyze each answered question
        Object.entries(answers).forEach(([questionNumber, answer]) => {
            const question = questions[questionNumber];
            if (!question) return;

            const questionText = (question.question || '').toLowerCase();

            // Match question to topics
            Object.entries(this.topicKeywords).forEach(([topic, keywords]) => {
                const matches = keywords.some(keyword => questionText.includes(keyword.toLowerCase()));
                if (matches) {
                    topicStats[topic].total++;
                    topicStats[topic].questionNumbers.push(parseInt(questionNumber));
                    if (answer.correct) {
                        topicStats[topic].correct++;
                    }
                }
            });
        });

        // Calculate weak areas
        const weakAreas = [];

        Object.entries(topicStats).forEach(([topic, stats]) => {
            if (stats.total >= 3) { // Only consider if answered at least 3 questions
                const accuracy = (stats.correct / stats.total) * 100;

                let severity = 'none';
                let estimatedStudyTime = 0;

                if (accuracy < 50) {
                    severity = 'critical';
                    estimatedStudyTime = 60; // 60 minutes
                } else if (accuracy < 70) {
                    severity = 'high';
                    estimatedStudyTime = 30; // 30 minutes
                } else if (accuracy < 85) {
                    severity = 'moderate';
                    estimatedStudyTime = 15; // 15 minutes
                }

                if (severity !== 'none') {
                    weakAreas.push({
                        topic,
                        severity,
                        accuracy: Math.round(accuracy),
                        totalQuestions: stats.total,
                        correctAnswers: stats.correct,
                        estimatedStudyTime,
                        questionNumbers: stats.questionNumbers,
                        improvementPlan: this.getImprovementPlan(topic, severity)
                    });
                }
            }
        });

        // Sort by severity (critical first)
        weakAreas.sort((a, b) => {
            const severityOrder = { critical: 0, high: 1, moderate: 2 };
            return severityOrder[a.severity] - severityOrder[b.severity];
        });

        return weakAreas;
    }

    /**
     * Get improvement plan for a topic
     */
    getImprovementPlan(topic, severity) {
        const plans = {
            'Speed Limits': 'Review speed limit rules for different areas (residential, school zones, highways). Practice identifying when limits change.',
            'Traffic Signs': 'Study the shapes and colors of signs. Practice matching signs to their meanings.',
            'Right of Way': 'Focus on intersection rules and pedestrian priority. Review who goes first in different scenarios.',
            'Parking': 'Memorize parking distance rules (fire hydrants, crosswalks, stop signs). Practice identifying legal parking spots.',
            'Lane Usage': 'Review proper lane usage for passing, turning, and highway driving. Study merge techniques.',
            'Turning': 'Practice proper turn signal timing and lane positioning. Review rules for different turn types.',
            'Alcohol & Drugs': 'Study BAC limits and impairment signs. Review consequences of driving under influence.',
            'Weather Conditions': 'Learn proper driving techniques for rain, snow, and fog. Review visibility rules.',
            'Vehicle Equipment': 'Study required vehicle equipment and maintenance. Review safety check procedures.',
            'Following Distance': 'Memorize the 3-second rule and safe following distances. Practice distance estimation.',
            'Emergency Vehicles': 'Review proper procedures when emergency vehicles approach. Study right-of-way rules.',
            'School Zones': 'Memorize school zone speed limits and times. Review safety procedures near schools.',
            'Highway Driving': 'Study proper merging and exit techniques. Review highway speed rules and lane discipline.',
            'Pedestrians': 'Review pedestrian right-of-way rules. Study crosswalk and sidewalk regulations.',
            'Motorcycles': 'Learn how to safely share the road with motorcycles. Review blind spot awareness.',
            'License & Documentation': 'Study license requirements and renewal procedures. Review required documents for driving.'
        };

        return plans[topic] || 'Review questions in this category and study related materials.';
    }

    /**
     * Generate daily study plan
     */
    generateDailyStudyPlan(stateId) {
        const dueReviews = storage.getDueReviews(stateId);
        const weakAreas = this.analyzeWeakAreas(stateId);
        const stats = storage.getUserStats();

        const tasks = [];

        // 1. Spaced Repetition Reviews (High Priority)
        if (dueReviews.length > 0) {
            tasks.push({
                title: 'Review Due Questions',
                description: `Review ${dueReviews.length} question${dueReviews.length > 1 ? 's' : ''} scheduled for today`,
                priority: 'high',
                estimatedTime: Math.ceil(dueReviews.length * 2), // 2 minutes per question
                type: 'review',
                action: 'spaced_repetition',
                questionCount: dueReviews.length
            });
        }

        // 2. Weak Area Focus (High Priority if critical topics exist)
        const criticalTopics = weakAreas.filter(w => w.severity === 'critical');
        if (criticalTopics.length > 0) {
            criticalTopics.forEach(topic => {
                tasks.push({
                    title: `Master ${topic.topic}`,
                    description: topic.improvementPlan,
                    priority: 'high',
                    estimatedTime: topic.estimatedStudyTime,
                    type: 'weak_area',
                    action: 'practice_topic',
                    topic: topic.topic
                });
            });
        }

        // 3. Continue Practice Tests (Medium Priority)
        if (stats.testsTaken < 5) {
            tasks.push({
                title: 'Complete Practice Test',
                description: 'Take a full practice test to assess your progress',
                priority: 'medium',
                estimatedTime: 30,
                type: 'practice',
                action: 'practice_test'
            });
        }

        // 4. New Content (Medium Priority)
        const answeredCount = Object.keys(storage.getAnswers(stateId) || {}).length;
        const totalQuestions = Object.keys(window.currentStateQuestions || {}).length;

        if (answeredCount < totalQuestions) {
            tasks.push({
                title: 'Explore New Questions',
                description: `${totalQuestions - answeredCount} questions remaining to complete all content`,
                priority: 'medium',
                estimatedTime: 20,
                type: 'new_content',
                action: 'practice_test'
            });
        }

        // 5. Flashcard Review (Low Priority)
        tasks.push({
            title: 'Flashcard Practice',
            description: 'Quick review with flashcards for reinforcement',
            priority: 'low',
            estimatedTime: 15,
            type: 'flashcard',
            action: 'flashcards'
        });

        // 6. Streak Maintenance (Medium Priority)
        const streak = storage.getStreak();
        if (streak.currentStreak >= 3) {
            tasks.push({
                title: 'Maintain Your Streak',
                description: `Keep your ${streak.currentStreak}-day streak alive!`,
                priority: 'medium',
                estimatedTime: 10,
                type: 'streak',
                action: 'quick_practice'
            });
        }

        return tasks;
    }

    /**
     * Get priority questions for spaced repetition
     */
    getPriorityQuestions(stateId, limit = 10) {
        const dueReviews = storage.getDueReviews(stateId);
        const wrongAnswers = storage.getWrongAnswers();
        const now = new Date();

        const priorities = [];

        // Add due reviews
        dueReviews.forEach(review => {
            const daysOverdue = Math.floor((now - new Date(review.nextReview)) / (1000 * 60 * 60 * 24));
            const priority = (daysOverdue * 10) + (5 - review.easeFactor);
            priorities.push({
                questionNumber: review.questionNumber,
                priority,
                reason: 'due_review'
            });
        });

        // Add wrong answers
        wrongAnswers.forEach(key => {
            if (key.startsWith(`${stateId}_`)) {
                const questionNumber = parseInt(key.split('_')[1]);
                const srData = storage.getSpacedRepetitionData(stateId, questionNumber);

                priorities.push({
                    questionNumber,
                    priority: 15 - srData.easeFactor, // Higher priority for harder questions
                    reason: 'wrong_answer'
                });
            }
        });

        // Sort by priority and return top N
        return priorities
            .sort((a, b) => b.priority - a.priority)
            .slice(0, limit)
            .map(p => p.questionNumber);
    }
}

// Create global instance
const aiEngine = new AIEngine();
