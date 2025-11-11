/**
 * DMV Test - Statistics & Charts
 * Handles statistics calculations and chart rendering
 */

class StatisticsManager {
    /**
     * Render 7-day performance chart
     */
    render7DayChart(canvasId) {
        const performance = storage.get7DayPerformance();
        const ctx = document.getElementById(canvasId);

        if (!ctx) return;

        // Destroy existing chart if any
        if (window.performanceChart) {
            window.performanceChart.destroy();
        }

        const isDark = document.documentElement.classList.contains('dark');

        window.performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: performance.map(p => p.label),
                datasets: [{
                    label: 'Correct Answers',
                    data: performance.map(p => p.correct),
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                }, {
                    label: 'Incorrect Answers',
                    data: performance.map(p => p.total - p.correct),
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: isDark ? '#e2e8f0' : '#334155',
                            font: {
                                size: 12,
                                weight: 'bold'
                            },
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: isDark ? '#1e293b' : 'white',
                        titleColor: isDark ? '#e2e8f0' : '#1e293b',
                        bodyColor: isDark ? '#cbd5e1' : '#475569',
                        borderColor: isDark ? '#475569' : '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return ` ${context.dataset.label}: ${context.parsed.y}`;
                            },
                            footer: function(items) {
                                const index = items[0].dataIndex;
                                return `Accuracy: ${performance[index].accuracy}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: isDark ? '#cbd5e1' : '#64748b',
                            font: {
                                size: 11,
                                weight: '500'
                            }
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: {
                            color: isDark ? '#334155' : '#f1f5f9',
                            borderDash: [5, 5]
                        },
                        ticks: {
                            color: isDark ? '#cbd5e1' : '#64748b',
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            precision: 0
                        }
                    }
                }
            }
        });
    }

    /**
     * Render accuracy trend chart
     */
    renderAccuracyTrend(canvasId) {
        const performance = storage.get7DayPerformance();
        const ctx = document.getElementById(canvasId);

        if (!ctx) return;

        // Destroy existing chart if any
        if (window.accuracyChart) {
            window.accuracyChart.destroy();
        }

        const isDark = document.documentElement.classList.contains('dark');

        window.accuracyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: performance.map(p => p.label),
                datasets: [{
                    label: 'Accuracy %',
                    data: performance.map(p => p.accuracy),
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: isDark ? '#1e293b' : 'white',
                        titleColor: isDark ? '#e2e8f0' : '#1e293b',
                        bodyColor: isDark ? '#cbd5e1' : '#475569',
                        borderColor: isDark ? '#475569' : '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Accuracy: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: isDark ? '#cbd5e1' : '#64748b',
                            font: {
                                size: 11,
                                weight: '500'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: isDark ? '#334155' : '#f1f5f9',
                            borderDash: [5, 5]
                        },
                        ticks: {
                            color: isDark ? '#cbd5e1' : '#64748b',
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Render topic performance donut chart
     */
    renderTopicChart(canvasId, weakAreas) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Destroy existing chart if any
        if (window.topicChart) {
            window.topicChart.destroy();
        }

        const isDark = document.documentElement.classList.contains('dark');

        const topics = weakAreas.slice(0, 5); // Top 5 weak areas
        const colors = [
            'rgba(239, 68, 68, 0.8)',   // Red
            'rgba(251, 146, 60, 0.8)',  // Orange
            'rgba(250, 204, 21, 0.8)',  // Yellow
            'rgba(34, 197, 94, 0.8)',   // Green
            'rgba(59, 130, 246, 0.8)'   // Blue
        ];

        window.topicChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: topics.map(t => t.topic),
                datasets: [{
                    data: topics.map(t => 100 - t.accuracy), // Invert to show weakness
                    backgroundColor: colors.slice(0, topics.length),
                    borderColor: isDark ? '#1e293b' : '#ffffff',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: isDark ? '#e2e8f0' : '#334155',
                            font: {
                                size: 11,
                                weight: 'bold'
                            },
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: isDark ? '#1e293b' : 'white',
                        titleColor: isDark ? '#e2e8f0' : '#1e293b',
                        bodyColor: isDark ? '#cbd5e1' : '#475569',
                        borderColor: isDark ? '#475569' : '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const topic = topics[context.dataIndex];
                                return [
                                    `Accuracy: ${topic.accuracy}%`,
                                    `Questions: ${topic.correctAnswers}/${topic.totalQuestions}`
                                ];
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Get achievement badges
     */
    getAchievements() {
        const stats = storage.getUserStats();
        const streak = storage.getStreak();
        const achievements = [];

        // Question milestones
        if (stats.totalQuestionsSolved >= 500) {
            achievements.push({ icon: '🏆', title: 'Expert', description: '500+ questions solved' });
        } else if (stats.totalQuestionsSolved >= 250) {
            achievements.push({ icon: '⭐', title: 'Advanced', description: '250+ questions solved' });
        } else if (stats.totalQuestionsSolved >= 100) {
            achievements.push({ icon: '🌟', title: 'Intermediate', description: '100+ questions solved' });
        } else if (stats.totalQuestionsSolved >= 50) {
            achievements.push({ icon: '✨', title: 'Beginner', description: '50+ questions solved' });
        }

        // Accuracy badges
        if (stats.accuracyRate >= 90) {
            achievements.push({ icon: '🎯', title: 'Sharpshooter', description: '90%+ accuracy' });
        } else if (stats.accuracyRate >= 80) {
            achievements.push({ icon: '🎪', title: 'Accurate', description: '80%+ accuracy' });
        }

        // Streak badges
        if (streak.currentStreak >= 30) {
            achievements.push({ icon: '🔥', title: 'On Fire!', description: '30-day streak' });
        } else if (streak.currentStreak >= 14) {
            achievements.push({ icon: '💪', title: 'Dedicated', description: '2-week streak' });
        } else if (streak.currentStreak >= 7) {
            achievements.push({ icon: '📚', title: 'Consistent', description: '7-day streak' });
        }

        // Test completion
        if (stats.testsTaken >= 20) {
            achievements.push({ icon: '📝', title: 'Test Master', description: '20+ tests completed' });
        } else if (stats.testsTaken >= 10) {
            achievements.push({ icon: '✏️', title: 'Test Pro', description: '10+ tests completed' });
        }

        return achievements;
    }

    /**
     * Get statistics summary
     */
    getSummary() {
        const stats = storage.getUserStats();
        const streak = storage.getStreak();
        const selectedState = storage.getSelectedState();

        let weeklyProgress = 0;
        if (stats.totalQuestionsSolved > 0) {
            const performance = storage.get7DayPerformance();
            const thisWeek = performance.reduce((sum, day) => sum + day.total, 0);
            const lastWeek = stats.totalQuestionsSolved - thisWeek;
            weeklyProgress = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 100;
        }

        return {
            totalQuestions: stats.totalQuestionsSolved,
            accuracy: parseFloat(stats.accuracyRate).toFixed(1),
            testsTaken: stats.testsTaken,
            currentStreak: streak.currentStreak,
            bestStreak: streak.bestStreak,
            weeklyProgress: weeklyProgress,
            correct: stats.correctAnswers,
            incorrect: stats.incorrectAnswers,
            selectedState: selectedState?.displayName || 'Not Selected'
        };
    }

    /**
     * Export statistics as JSON
     */
    exportStats() {
        return {
            stats: storage.getUserStats(),
            streak: storage.getStreak(),
            performance: storage.get7DayPerformance(),
            exportDate: new Date().toISOString()
        };
    }
}

// Create global instance
const statsManager = new StatisticsManager();
