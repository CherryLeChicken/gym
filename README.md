# Chin Up 💪

**Empowering users to feel confident when doing physical exercises.**

---

## The Problem

Whose New Year's resolution was to start working out more?

For a lot of people, the issue wasn't motivation.

**Common barriers to physical activity include:**
- Lack of skill and confidence
- High cost and lack of facilities
- Not knowing how to use gym equipment or what to do in the gym

**Research shows that:**
- **53% of people** say they're put off by not knowing how to use gym equipment or what to do in the gym
- **2 in 5 adults** have avoided going to the gym because they're self-conscious about how they look

Beginners lack access to affordable, judgment-free fitness guidance, which prevents them from building confidence, skills, and long-term healthy habits.

---

## The Solution: Chin Up

**Chin Up** is a voice-first, AI-powered fitness companion that makes exercise accessible, affordable, and confidence-building for everyone.

### Why Chin Up?

✅ **No need to hire personal trainers** - Get real-time form correction and guidance  
✅ **No need to purchase a gym membership** - Work out from home with 100+ exercises  
✅ **Learn the basics** - Build confidence and skills to start your physical health journey  
✅ **Judgment-free zone** - Your personal AI coach, available 24/7  
✅ **Voice-first design** - Hands-free guidance, perfect for beginners and neurodivergent users

---

## ✨ Key Features

### 🎯 Real-Time Form Analysis
- **TensorFlow.js MoveNet** pose detection tracks 17 body keypoints in real-time
- Exercise-specific form analysis (squats, push-ups, wall sits, Romanian deadlifts, and more)
- Instant feedback on depth, alignment, and technique
- Visual skeleton overlay shows exactly what's being detected

### 🗣️ AI-Powered Voice Coaching
- **ElevenLabs TTS** generates natural, human-like voice feedback
- Choose your coaching style: **Calm**, **Neutral**, or **Energetic**
- Select voice gender: **Male** or **Female**
- Adaptive feedback variants prevent repetitive coaching
- Hands-free guidance - no need to look at your screen

### 🧠 Predictive Safety Analytics
- **Presage Physiology SDK** tracks breathing rate, consistency, and signal confidence
- Predicts fatigue and form mistakes **before they happen**
- Adapts feedback frequency and tone based on your state
- Proactive safety coaching to prevent injuries

### 🎨 Personalized Experience
- **Onboarding** - Set your workout preferences (type, equipment, name)
- **100+ exercises** filtered by your preferences
- **Favorite exercises** - Save your go-to workouts
- **Random exercise** button - Never get stuck choosing
- **Exercise preview videos** - See how to do each exercise correctly

### 🎵 Background Music (Optional)
- AI-generated workout music with customizable prompts
- Energetic, relaxing, rock, or zen presets
- Volume control and play/pause functionality

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern browser with camera access (Chrome, Edge, Safari recommended)
- ElevenLabs API key (optional - falls back to Web Speech API if not provided)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd gym
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables (optional):**

Create a `.env` file in the root directory:
```
VITE_ELEVENLABS_API_KEY=your_api_key_here
```

> **Note:** The app works without an ElevenLabs API key - it will automatically fall back to the browser's Web Speech API.

4. **Start the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to `http://localhost:5173` (or the port shown in your terminal)

---

## 📖 How to Use

1. **Complete Onboarding**
   - Enter your name
   - Select your preferred workout type (Legs, Arms, Upper Body, Core, Cardio, Full Body)
   - Choose your available equipment (No equipment, Dumbbells, Resistance bands, Chair/bench)

2. **Select an Exercise**
   - Browse 100+ exercises filtered by your preferences
   - Click any exercise to see a preview video
   - Use the ⭐ button to favorite exercises
   - Click the 🎲 button for a random exercise

3. **Start Your Workout**
   - Click "Start" to begin pose detection
   - Position yourself so your full body is visible (you'll see a green border when ready)
   - Follow the voice guidance for real-time form correction

4. **Customize Your Experience**
   - Click the 🎤 icon to adjust voice personality and gender
   - Click the 🎵 icon to generate background music
   - Adjust settings anytime, even during a workout

---

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** - Component-based UI
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **TensorFlow.js** - Machine learning framework
- **MoveNet** - Pose detection model

### Key Integrations
- **ElevenLabs TTS API** - Natural voice generation
- **Presage Physiology SDK** - Predictive analytics
- **Web Speech API** - Fallback voice synthesis

### Core Components

```
src/
├── components/
│   ├── CameraFeed.jsx          # Pose detection & video display
│   ├── ExerciseSelector.jsx    # Exercise library with filtering
│   ├── ControlPanel.jsx        # Start/Stop controls
│   ├── FeedbackDisplay.jsx     # Visual feedback display
│   ├── VoiceSettingsIcon.jsx   # Voice customization
│   ├── MusicIcon.jsx           # Background music controls
│   └── Onboarding.jsx         # User onboarding flow
├── hooks/
│   ├── usePoseDetection.js    # TensorFlow.js MoveNet integration
│   ├── useFormAnalysis.js     # Exercise-specific form analysis
│   ├── useVoiceFeedback.js    # ElevenLabs TTS with fallback
│   ├── usePresage.js          # Predictive analytics
│   └── useBackgroundMusic.js  # AI music generation
└── lib/
    ├── exerciseAnalyzers.js   # Form analysis logic
    ├── angleUtils.js          # Geometric calculations
    └── feedbackVariants.js    # Adaptive feedback system
```

---

## 🎯 Supported Exercises

### Currently Analyzed (with form feedback):
- **Squat** - Knee angle, back alignment, depth
- **Push-up** - Elbow angle, body alignment, depth
- **Wall Sit** - Knee angle, back position, hip height
- **Romanian Deadlift** - Hip hinge, back alignment, knee position

### Available Exercises (100+):
- **Legs**: Squats, lunges, calf raises, wall sits, glute bridges, and more
- **Arms**: Push-ups (regular, knee, wall), bicep curls, tricep extensions, and more
- **Upper Body**: Various push-up variations, rows, presses, and more
- **Core**: Planks, crunches, Russian twists, mountain climbers, and more
- **Cardio**: Jumping jacks, burpees, high knees, and more
- **Full Body**: Deadlifts, thrusters, bear crawls, and more

All exercises are filtered by workout type and equipment availability.

---

## 🔒 Privacy & Security

- **100% Client-Side Processing** - All pose detection happens in your browser
- **No Video Storage** - Camera feed is processed in real-time, never stored
- **No Data Transmission** - Your movements stay on your device
- **LocalStorage Only** - Only user preferences are saved locally

---

## 🌟 What Makes Chin Up Special

### 1. **Predictive Safety**
We don't just correct mistakes - we prevent them. Presage analytics predict fatigue and form deterioration before they happen.

### 2. **True Voice-First Design**
Voice isn't an afterthought - it's the primary interface. Perfect for hands-free workouts and accessibility.

### 3. **Adaptive Intelligence**
The system learns your patterns and adapts:
- Feedback frequency adjusts based on signal confidence
- Voice tone adapts to breathing patterns
- Content variants prevent repetitive coaching

### 4. **Accessibility-First**
Designed for:
- Neurodivergent users (voice-first, minimal text)
- Beginners (clear, encouraging guidance)
- People with gym anxiety (judgment-free, private)
- Anyone without equipment (100+ bodyweight exercises)

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_ELEVENLABS_API_KEY` | ElevenLabs API key for TTS | No (falls back to Web Speech API) |

---

## 🌐 Browser Compatibility

- ✅ **Chrome/Edge** (recommended)
- ✅ **Safari**
- ⚠️ **Firefox** (may have limited camera support)

Requires:
- Camera access
- Modern browser with WebGL/WebGPU support
- JavaScript enabled

---

## 🐛 Troubleshooting

### Camera Not Working
- Ensure you've granted camera permissions
- Check that no other application is using the camera
- Try refreshing the page
- Use Chrome/Edge for best compatibility

### Pose Detection Not Working
- Ensure good lighting
- Stand at an appropriate distance from the camera (6-10 feet)
- Make sure your full body is visible
- Wait for the green border to appear (indicates full body detection)

### Voice Feedback Not Playing
- Check browser console for errors
- If using ElevenLabs, verify your API key is correct
- The app will automatically fall back to Web Speech API if ElevenLabs fails
- Ensure your browser volume is not muted

### Exercise Not Showing Up
- Check your workout type and equipment filters in settings
- Some exercises may not match your current preferences
- Try adjusting your preferences in the settings panel

---

## 📊 Project Status

### ✅ Phase 1: MVP (Completed)
- Camera integration and pose detection
- Form analysis for multiple exercises
- Voice feedback with ElevenLabs integration
- Basic UI and exercise selection

### ✅ Phase 2: Enhancements (Completed)
- Presage SDK integration for predictive analytics
- Rep counting
- Voice personality and gender selection
- Exercise preview videos
- Onboarding and personalization
- 100+ exercise library
- Favorite exercises
- Background music generation

### ✅ Phase 3: Polish (Completed)
- Feedback variant system (prevents repetition)
- Adaptive feedback based on Presage data
- Performance optimization
- Error handling and fallbacks
- UI/UX improvements

---

## 🚀 Future Enhancements

- Additional exercise form analyzers
- Integration with wearable devices for enhanced Presage predictions
- Personalized training plans
- Progress tracking and analytics
- Social features and challenges
- Mobile app version

---

## 🤝 Contributing

This is a hackathon project, but contributions and feedback are welcome!

---

## 📄 License

[Add your license here]

---

## 🙏 Acknowledgments

- **TensorFlow.js** - For powerful browser-based ML
- **ElevenLabs** - For natural voice synthesis
- **Presage** - For predictive physiology analytics
- **MuscleWiki** - For exercise demonstration videos

---

**Built with ❤️ for accessibility and inclusion in fitness**

*Chin Up - Because everyone deserves to feel confident in their fitness journey.*
