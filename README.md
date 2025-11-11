# 🚗 DMV Practice Test - Web Version

A modern, mobile-responsive web application for DMV (Department of Motor Vehicles) exam preparation, featuring AI-powered learning, spaced repetition, and comprehensive progress tracking across all 50 US states + DC.

## ✨ Features

### 📚 Study Modes
- **Practice Tests** - Sequential practice with 20+ questions per test
- **Test Simulator** - Timed exam simulation with realistic conditions
- **Flashcards** - Swipeable flashcard interface for quick review
- **Wrong Questions** - Review and master your mistakes
- **Favorites** - Save important questions for later
- **Smart Review** - AI-powered spaced repetition system

### 🧠 AI-Powered Learning
- **Exam Success Prediction** - Machine learning algorithm predicts your pass rate
- **Weak Area Analysis** - Identifies topics that need more practice
- **Personalized Study Plans** - Daily tasks tailored to your progress
- **Spaced Repetition** - SM-2 algorithm for optimal review scheduling

### 📊 Progress Tracking
- Comprehensive statistics dashboard
- 7-day performance charts
- Streak tracking system
- Achievement badges
- Accuracy metrics
- Test history

### 🎨 Modern UI/UX
- Beautiful gradient-based "TrustTheme" design
- Fully responsive (mobile, tablet, desktop)
- Dark mode support
- Smooth animations and transitions
- Accessible and user-friendly

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, but recommended)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd site
   ```

2. **Start a local web server**

   **Option A: Python (recommended)**
   ```bash
   python3 -m http.server 8000
   ```

   **Option B: Node.js**
   ```bash
   npx http-server
   ```

   **Option C: PHP**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Direct Usage
You can also open `index.html` directly in your browser, but some features may not work due to CORS restrictions.

## 📁 Project Structure

```
site/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Custom CSS styles (TrustTheme)
├── js/
│   ├── app.js              # Main application controller
│   ├── storage.js          # LocalStorage management
│   ├── ai-engine.js        # AI prediction algorithms
│   ├── quiz-engine.js      # Quiz logic and management
│   ├── statistics.js       # Statistics and charts
│   └── pages.js            # Page templates
├── data/
│   ├── states-index.json   # List of all 51 states
│   ├── test-properties.json # Test configurations per state
│   ├── alabama.json        # State-specific questions
│   ├── alaska.json
│   └── ... (51 state files)
├── images/
│   └── ... (7,144 question images)
└── README.md
```

## 🎯 How It Works

### Data Storage
All user data is stored locally in the browser using `localStorage`:
- User progress and statistics
- Answer history
- Favorites and wrong questions
- Study streak data
- Spaced repetition scheduling

**No server required!** Everything runs in your browser.

### Question Database
- **23,656+ questions** across 51 jurisdictions
- State-specific test configurations
- 7,144 high-quality images
- Organized by state in JSON format

### AI Engine
The AI prediction system uses multiple factors:
- Overall accuracy (50% weight)
- Question coverage (20% weight)
- Consistency score (15% weight)
- Study streak (10% weight)
- Weak topics penalty (15% weight)

## 🛠️ Technologies Used

- **Frontend:** Vanilla JavaScript (ES6+)
- **Styling:** Tailwind CSS (via CDN)
- **Charts:** Chart.js
- **Icons:** Font Awesome
- **Architecture:** MVVM pattern
- **Storage:** Browser LocalStorage

## 📱 Mobile Support

Fully responsive design with:
- Touch-friendly interfaces
- Mobile-optimized layouts
- Bottom navigation on mobile
- Swipeable flashcards
- Adaptive font sizes

## 🌙 Dark Mode

Automatic dark mode support:
- System preference detection
- Manual toggle
- Persistent preference
- All components styled for dark theme

## 🔒 Privacy

- **100% client-side** - no data sent to servers
- No tracking or analytics (unless you add Google AdSense)
- All data stored locally
- Export/import functionality for backups

## 📈 Statistics Features

- Total questions solved
- Accuracy percentage
- Tests taken count
- Current and best streak
- 7-day performance chart
- Correct/incorrect breakdown
- Achievement badges

## 🎓 Study Recommendations

The AI generates personalized daily study plans including:
1. Spaced repetition reviews (high priority)
2. Weak area focus (critical topics)
3. Practice tests (continuous learning)
4. New content exploration
5. Flashcard reviews
6. Streak maintenance

## 💰 Monetization (Optional)

The template includes Google AdSense integration:
- Banner ads (top of page)
- Interstitial ads (between tests)
- Ad policy system (prevents spam)

To enable: Replace `ca-pub-XXXXXXXXXX` in `index.html` with your AdSense ID.

## 🐛 Troubleshooting

### Images not loading
- Ensure you're running a local web server
- Check that images are in the `images/` folder
- Verify file extensions (jpg/png)

### Data not persisting
- Check if localStorage is enabled in your browser
- Ensure you're not in incognito/private mode
- Check browser storage limits

### Charts not rendering
- Verify Chart.js CDN is accessible
- Check browser console for errors
- Ensure canvas elements have proper IDs

## 🔄 Data Management

### Export Data
Settings → Export Data → Downloads JSON backup

### Import Data
Settings → Import Data → Select backup file

### Clear Data
Settings → Clear All Data (⚠️ irreversible)

## 📊 Performance

- Lightweight (~500KB total JS)
- Fast load times (<2s)
- Smooth 60fps animations
- Efficient localStorage usage
- Optimized image loading

## 🌐 Browser Support

- ✅ Chrome/Edge (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Opera (76+)
- ✅ Mobile browsers

## 🎨 Customization

### Colors
Edit `tailwind.config` in `index.html`:
```javascript
colors: {
    primary: { ... },    // Main brand color
    secondary: { ... },  // Secondary elements
    accent: '#8b5cf6',   // Highlights
    ...
}
```

### Test Configuration
Edit `data/test-properties.json` to change:
- Questions per practice test
- Simulator question count
- Allowed mistakes
- Time limits

## 📝 Future Enhancements

Potential features to add:
- [ ] Voice-over for questions
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)
- [ ] Offline mode with service workers
- [ ] Social sharing
- [ ] Leaderboards
- [ ] Additional study modes

## 🤝 Contributing

This is a standalone web application converted from an iOS app. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Fork and customize

## 📜 License

This project uses question data and images from the original iOS DMV app.
Please ensure proper licensing before commercial use.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify all files are present
4. Ensure local server is running

## 🎉 Acknowledgments

- Original iOS app architecture
- Tailwind CSS for styling framework
- Chart.js for beautiful charts
- Font Awesome for icons
- All 51 US DMV departments for test content

## 📊 Stats

- **23,656** total questions
- **51** states + DC
- **7,144** images
- **~3,500** lines of code
- **5** study modes
- **100%** client-side

---

**Ready to ace your DMV test?** 🚗💨

Start studying now and join thousands who have passed their exam with confidence!
