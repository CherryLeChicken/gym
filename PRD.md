# Voice-Guided Gym Web App – Process & Requirements Document

**Project Name:** FormBuddy  
**Pillar:** Accessibility  
**Objective:** Provide a real-time, voice-first fitness companion that analyzes user exercise form through the camera, provides corrective feedback, and encourages users using AI-generated voice (ElevenLabs).

---

## 1. Project Overview

Many beginners, neurodivergent users, and people with gym anxiety struggle with text-heavy or visual fitness instructions. Traditional apps rely on screens and text feedback, creating **barriers to inclusion**.

**Solution:** A web-based app that uses **camera-based pose detection** and **AI-driven voice feedback** to guide exercises, correct form, and encourage users in real-time.

---

## 2. Functional Requirements

### 2.1 User Authentication (Optional MVP)
- Users can optionally enter a name to personalize encouragement.
- No passwords needed for MVP.

### 2.2 Camera Integration
- Request permission to access webcam.
- Display live camera feed on the page.
- Capture key body joints (pose detection) in real-time.

### 2.3 Exercise Selection
- Users can select from a predefined list:
  - Squat
  - Push-up
- Optional: Add more exercises if time allows.

### 2.4 Pose Detection & Analysis
- Use **TensorFlow.js MoveNet** or **PoseNet** for real-time keypoint detection.
- Detect relevant joints per exercise:
  - Squat: hip, knee, ankle
  - Push-up: shoulder, elbow, wrist
- Calculate angles (using simple math / vector functions).
- Compare angles to threshold values for correct form.

### 2.5 Feedback Generation
- Translate pose analysis into **text feedback**:
  - Example: “Bend your knees more” or “Good posture!”
- Include **encouragement phrases**:
  - Example: “You’re doing great! Keep it up!”
- Optionally adjust **tone or voice style** for user preference.

### 2.6 Voice Feedback (ElevenLabs Integration)
- Convert feedback text into speech in real-time.
- Play audio through the browser.
- Optional: Let users select from 2–3 voices (calm, energetic, neutral).

### 2.7 User Interface (UI)
- Webcam feed prominently displayed.
- Exercise selection menu.
- Start / Stop button.
- Optional: Display text feedback visually for clarity.

### 2.8 Real-Time Updates
- Feedback should occur **within 1–2 seconds** of pose change.
- Ensure continuous audio cues do not overlap (queue system).

---

## 3. Non-Functional Requirements

| Category                  | Requirement                                                                 |
|---------------------------|----------------------------------------------------------------------------|
| Performance               | Real-time pose detection at ≥15 FPS                                         |
| Compatibility             | Modern browsers (Chrome, Edge, Safari)                                     |
| Accessibility             | Voice-first interface, optional visual text feedback                       |
| Scalability               | Designed for single-user demo; scalable if multi-user supported in future |
| Security & Privacy        | Camera feed processed locally; no images or videos stored                  |
| Reliability               | Audio playback should not freeze or overlap with new feedback              |
| Maintainability           | Modular code for exercises, feedback, and TTS components                   |

---

## 4. Technical Requirements

### 4.1 Front-End
- HTML / CSS / JavaScript
- Framework: optional (React for UI modularity)
- Camera integration via `navigator.mediaDevices.getUserMedia()`

### 4.2 Pose Detection
- **TensorFlow.js MoveNet / PoseNet**
- Detects body keypoints in real-time
- Calculates angles via JavaScript

### 4.3 Backend (Optional for MVP)
- Not required for hackathon MVP (client-side only)
- Could store user preferences in the future

### 4.4 Voice Integration
- ElevenLabs TTS API (REST or JS SDK)
- Convert feedback text → speech
- Play audio dynamically in-browser

### 4.5 Libraries / Dependencies
- TensorFlow.js
- ElevenLabs API SDK
- Optional: Tone.js or Howler.js for audio control
- Optional: Bootstrap or TailwindCSS for UI styling

---

## 5. Process Flow (User Journey)

1. Open Website → Grant Camera Access  
2. Select Exercise → Start Workout  
3. Pose Detection → Real-time Analysis  
4. Generate Feedback → Voice Playback  
5. Continuous Loop → Encourage + Correct  
6. End Exercise → Optionally Save Session Stats  

*Optional Diagram:* Webcam → Pose Detection → Analysis → Text Feedback → ElevenLabs TTS → User Audio

---

## 6. Implementation Plan

### Phase 1: MVP Setup
- Set up HTML/CSS layout
- Integrate webcam feed
- Implement basic pose detection (1 exercise)
- Implement form analysis logic
- Integrate ElevenLabs TTS API
- Play real-time voice feedback

### Phase 2: Enhancements
- Add additional exercises
- Rep counting
- Voice personality selection
- Text feedback display
- Minor gamification (badges, encouragements)

### Phase 3: Testing & Demo
- Test real-time responsiveness
- Validate angle thresholds
- Ensure audio timing is natural
- Ensure user experience is intuitive

---

## 7. Deliverables for Hackathon
- Functional web app demonstrating **voice-first form correction**
- Demo script highlighting:
  - Accessibility impact
  - Voice encouragement
  - Real-time correction
- Technical documentation for judges

---

## 8. Assumptions & Constraints
- Single-user focus (no multi-user support)
- Camera feed processed in-browser (privacy-friendly)
- Voice feedback limited to short phrases for latency
- Only safe, beginner-friendly exercises included
- MVP prioritizes accessibility & clarity over AI perfection

---

## 9. Future Scope (Beyond Hackathon)
- Additional exercises & difficulty levels
- Personalized training plans
- Integration with wearable devices
- Multi-user / social features
- Adaptive AI feedback based on past performance
