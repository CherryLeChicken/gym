import { useRef, useEffect, useState, useCallback } from "react";
import { usePoseDetection } from "../hooks/usePoseDetection";
import { useFormAnalysis } from "../hooks/useFormAnalysis";
import { useVoiceFeedback } from "../hooks/useVoiceFeedback";

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
export default function CameraFeed({ exercise, isActive, onFeedback }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const lastFeedbackTimeRef = useRef(0);
  const lastKeypointLogTimeRef = useRef(0);
  const lastDetectionLogTimeRef = useRef(0);
  const FEEDBACK_INTERVAL = 2000; // 2 seconds between feedback

  const { detectPose, keypoints, isLoading } = usePoseDetection();
  const { analyzeForm } = useFormAnalysis(exercise);
  const { speak } = useVoiceFeedback();
  const [detectionStatus, setDetectionStatus] = useState("initializing"); // 'initializing', 'detecting', 'no-pose', 'detected', 'full-body'
  const [isFullBodyVisible, setIsFullBodyVisible] = useState(false);
=======
>>>>>>> Stashed changes
export default function CameraFeed({ exercise, hoveredExercise, isActive, onFeedback, onRepCountUpdate, voicePersonality, voiceGender }) {
  const videoRef = useRef(null)
  const previewVideoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)

  // Exercise preview video URLs (MuscleWiki exercise demo videos)
  const previewVideos = {
    'squat': 'https://media.musclewiki.com/media/uploads/videos/branded/male-Bodyweight-bodyweight-box-squat-side.mp4',
    'push-up': 'https://media.musclewiki.com/media/uploads/videos/branded/male-Bodyweight-push-up-side.mp4'
  }
  const lastFeedbackTimeRef = useRef(0)
  const lastKeypointLogTimeRef = useRef(0)
  const lastDetectionLogTimeRef = useRef(0)
  const lastPresageLogTimeRef = useRef(0)
  const FEEDBACK_INTERVAL = 2000 // 2 seconds between feedback

  const { detectPose, keypoints, isLoading } = usePoseDetection()
  const { analyzeForm } = useFormAnalysis(exercise)
  const { speak } = useVoiceFeedback(voicePersonality, voiceGender)
  const { trackMovement, trackRep, getPredictions, predictions: presagePredictions, repCount, breathingRate, breathingConsistency, signalConfidence } = usePresage(exercise, isActive)
  
  // Presage metrics monitoring (debug logging removed for production)
  // Metrics are displayed in the UI panel instead
  const [detectionStatus, setDetectionStatus] = useState('initializing') // 'initializing', 'detecting', 'no-pose', 'detected', 'full-body'
  const [isFullBodyVisible, setIsFullBodyVisible] = useState(false)
  const lastPresageCheckRef = useRef(0)
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607

  // Initialize camera
  useEffect(() => {
    if (!isActive) return;

    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setError(null);
      } catch (err) {
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
        setError("Camera access denied. Please allow camera permissions.");
        console.error("Camera error:", err);
=======
>>>>>>> Stashed changes
        // User-friendly error messages
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera permission denied. Please allow camera access to use FormBuddy.')
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No camera found. Please connect a camera and try again.')
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setError('Camera is already in use by another application. Please close other apps and try again.')
        } else {
          setError(`Camera error: ${err.message || 'Unable to access camera. Please try again.'}`)
        }
        console.error('Camera error:', err.message || err.name)
<<<<<<< Updated upstream
=======
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
>>>>>>> Stashed changes
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isActive]);

  // Handle keypoints updates for feedback and drawing
  useEffect(() => {
    if (!isActive) {
      setDetectionStatus("initializing");
      return;
    }

    if (isLoading) {
      setDetectionStatus("initializing");
      return;
    }

<<<<<<< Updated upstream
    // Keypoint detection monitoring (debug logging removed for production)
=======
<<<<<<< HEAD
    // Debug: log keypoints when they change (throttled to once per 3 seconds)
    if (keypoints) {
      const visibleCount = keypoints.filter(
        (kp) => kp && kp.score > 0.3,
      ).length;
      if (visibleCount > 0) {
        const now = Date.now();
        if (
          !lastKeypointLogTimeRef.current ||
          now - lastKeypointLogTimeRef.current > 3000
        ) {
          console.log(
            `Detected ${visibleCount} keypoints:`,
            keypoints.filter((kp) => kp && kp.score > 0.3).map((kp) => kp.name),
          );
          lastKeypointLogTimeRef.current = now;
        }
      }
    }
=======
    // Keypoint detection monitoring (debug logging removed for production)
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
>>>>>>> Stashed changes

    if (!keypoints || keypoints.length === 0) {
      setDetectionStatus("no-pose");
      setIsFullBodyVisible(false);
      return;
    }

    // Check if we have enough keypoints for basic detection
    const visibleKeypoints = keypoints.filter(
      (kp) => kp && kp.score > 0.3,
    ).length;
    if (visibleKeypoints < 3) {
      setDetectionStatus("no-pose");
      setIsFullBodyVisible(false);
      return;
    }

    // Check if full body is visible (only if exercise is selected)
    const fullBodyVisible = exercise
      ? checkFullBodyVisible(keypoints, exercise)
      : false;
    setIsFullBodyVisible(fullBodyVisible);

    if (fullBodyVisible) {
      setDetectionStatus("full-body");
    } else {
      setDetectionStatus("detected");
    }

    drawPose(keypoints);

    // Only analyze form and give feedback if exercise is selected AND full body is visible
    if (exercise && fullBodyVisible) {
      const analysis = analyzeForm(keypoints);

      // Only give feedback if it's actual exercise feedback (not positioning messages)
      if (
        analysis.feedback &&
        !analysis.feedback.toLowerCase().includes("position yourself")
      ) {
        const now = Date.now();
        if (now - lastFeedbackTimeRef.current > FEEDBACK_INTERVAL) {
          onFeedback(analysis.feedback);
          if (analysis.feedback.trim()) {
            speak(analysis.feedback);
          }
          lastFeedbackTimeRef.current = now;
        }
      }
    }
  }, [
    keypoints,
    isActive,
    exercise,
    analyzeForm,
    speak,
    onFeedback,
    isLoading,
  ]);

  // Pose detection loop (works even without exercise selected for testing)
  useEffect(() => {
    if (!isActive || !videoRef.current || !stream) {
      setDetectionStatus("initializing");
      return;
    }

    if (isLoading) {
<<<<<<< HEAD
      setDetectionStatus("initializing");
      console.log("Pose detector still loading...");
      return;
=======
      setDetectionStatus('initializing')
      // Pose detector still loading - no action needed
      return
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
    }

    // Wait for video to be ready with timeout
    const checkVideoReady = () => {
      if (
        videoRef.current &&
        videoRef.current.readyState >= 2 &&
        videoRef.current.videoWidth > 0
      ) {
        return true;
      }
      return false;
    };

    // Start detection loop function
    const startDetectionLoop = () => {
<<<<<<< HEAD
      setDetectionStatus("detecting");
      console.log("Starting pose detection loop");
      let animationFrameId;
      let frameCount = 0;
      let lastLogTime = Date.now();
=======
      setDetectionStatus('detecting')
      // Starting pose detection loop
      let animationFrameId
      let frameCount = 0
      let lastLogTime = Date.now()
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607

      const detectLoop = async () => {
        if (!videoRef.current || !isActive) {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
          return;
        }

        // Check video is ready (HAVE_CURRENT_DATA or higher) and has valid dimensions
        if (
          videoRef.current.readyState >= 2 &&
          videoRef.current.videoWidth > 0
        ) {
          try {
            await detectPose(videoRef.current);
            frameCount++;

            // Log first detection
            if (frameCount === 1) {
<<<<<<< Updated upstream
              // First pose detection completed
=======
<<<<<<< HEAD
              console.log("First pose detection completed!");
=======
              // First pose detection completed
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
>>>>>>> Stashed changes
            }

            // Throttle periodic logs to every 5 seconds
            const now = Date.now();
            if (now - lastLogTime > 5000) {
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
              console.log(`Detection running... frame ${frameCount}`);
              lastLogTime = now;
            }
          } catch (error) {
            // Only log errors, not every frame
            const now = Date.now();
            if (
              !lastDetectionLogTimeRef.current ||
              now - lastDetectionLogTimeRef.current > 5000
            ) {
              console.error("Error in detection loop:", error);
              lastDetectionLogTimeRef.current = now;
=======
>>>>>>> Stashed changes
              // Detection running (throttled logging removed for performance)
              lastLogTime = now
            }
          } catch (error) {
            // Only log errors, not every frame
            const now = Date.now()
            if (!lastDetectionLogTimeRef.current || now - lastDetectionLogTimeRef.current > 5000) {
              console.error('Pose detection error:', error.message || error)
              lastDetectionLogTimeRef.current = now
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
            }
          }
        } else {
          // Video not ready yet - only log once
          if (frameCount === 0) {
<<<<<<< Updated upstream
            // Video not ready yet, waiting...
=======
<<<<<<< HEAD
            console.log("Video not ready yet, waiting...");
=======
            // Video not ready yet, waiting...
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
>>>>>>> Stashed changes
          }
        }

        animationFrameId = requestAnimationFrame(detectLoop);
      };

      detectLoop();

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    };

    if (!checkVideoReady()) {
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
      console.log("Waiting for video to be ready...");
      let timeoutCount = 0;
      const maxWaitTime = 5000; // 5 seconds max wait
      let lastCheckLogTime = Date.now();

=======
>>>>>>> Stashed changes
      // Waiting for video to be ready...
      let timeoutCount = 0
      const maxWaitTime = 5000 // 5 seconds max wait
      let lastCheckLogTime = Date.now()
      
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
      const checkInterval = setInterval(() => {
        timeoutCount += 100;
        if (checkVideoReady()) {
<<<<<<< HEAD
          clearInterval(checkInterval);
          console.log("Video is ready! Starting detection...");
          startDetectionLoop();
        } else if (timeoutCount >= maxWaitTime) {
          clearInterval(checkInterval);
          console.warn(
            "Video not ready after timeout, starting detection anyway...",
          );
          startDetectionLoop();
=======
          clearInterval(checkInterval)
          // Video is ready! Starting detection...
          startDetectionLoop()
        } else if (timeoutCount >= maxWaitTime) {
          clearInterval(checkInterval)
          console.warn('Video not ready after timeout, starting detection anyway')
          startDetectionLoop()
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
        } else {
          // Only log waiting status every 2 seconds
          const now = Date.now();
          if (now - lastCheckLogTime > 2000) {
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
            console.log(
              `Still waiting for video... (${Math.round(timeoutCount / 1000)}s)`,
            );
            lastCheckLogTime = now;
=======
>>>>>>> Stashed changes
            // Still waiting for video (throttled logging removed)
            lastCheckLogTime = now
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
          }
        }
      }, 100);

      return () => {
        clearInterval(checkInterval);
      };
    } else {
      // Video is already ready, start immediately
      return startDetectionLoop();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isActive, stream, detectPose, isLoading]);

  // Helper function to find keypoint by name
  const findKeypoint = (keypoints, name) => {
    if (!keypoints || keypoints.length === 0) return null;
    return keypoints.find((kp, idx) => {
      if (!kp) return false;
      const kpName = (
        kp.name ||
        getKeypointName(idx) ||
        `keypoint_${idx}`
      ).toLowerCase();
      return kpName.includes(name.toLowerCase()) && kp.score > 0.3;
    });
  };

  // Helper to get keypoint name (same as in usePoseDetection)
  const getKeypointName = (index) => {
    const names = [
      "nose",
      "left_eye",
      "right_eye",
      "left_ear",
      "right_ear",
      "left_shoulder",
      "right_shoulder",
      "left_elbow",
      "right_elbow",
      "left_wrist",
      "right_wrist",
      "left_hip",
      "right_hip",
      "left_knee",
      "right_knee",
      "left_ankle",
      "right_ankle",
    ];
    return names[index] || `keypoint_${index}`;
  };

  // Check if full body is visible (need key body parts for exercise analysis)
  const checkFullBodyVisible = (keypoints, currentExercise) => {
    if (!keypoints || keypoints.length === 0) return false;

    // For squat: need shoulders, hips, knees, ankles
    // For push-up: need shoulders, elbows, wrists
    const requiredParts =
      currentExercise === "squat"
        ? ["shoulder", "hip", "knee", "ankle"]
        : ["shoulder", "elbow", "wrist"];

    const foundParts = new Set();

    keypoints.forEach((kp, idx) => {
      if (!kp || kp.score <= 0.3) return;
      const kpName = (
        kp.name ||
        getKeypointName(idx) ||
        `keypoint_${idx}`
      ).toLowerCase();
      requiredParts.forEach((part) => {
        if (kpName.includes(part)) {
          foundParts.add(part);
        }
      });
    });

    // Need at least 3 out of 4 key parts for squat, or 2 out of 3 for push-up
    const minRequired = currentExercise === "squat" ? 3 : 2;
    return foundParts.size >= minRequired;
  };

  const drawPose = (keypoints) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !keypoints || keypoints.length === 0) {
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
      console.log("Cannot draw pose - missing canvas, video, or keypoints");
      return;
=======
>>>>>>> Stashed changes
      // Cannot draw pose - missing canvas, video, or keypoints
      return
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
    }

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

<<<<<<< HEAD
    // Debug: log what we're trying to draw
    const validKeypoints = keypoints.filter((kp) => kp && kp.score > 0.3);
    if (validKeypoints.length > 0) {
      console.log(`Drawing ${validKeypoints.length} keypoints`);
    }

=======
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Drawing pose skeleton and keypoints
    
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
    // Define skeleton connections (full body)
    const connections = [
      // Face/Head - more detailed connections
      ["nose", "left_eye"],
      ["nose", "right_eye"],
      ["left_eye", "right_eye"], // Connect eyes across face
      ["left_eye", "left_ear"],
      ["right_eye", "right_ear"],
      ["left_ear", "left_shoulder"], // Connect ear to shoulder
      ["right_ear", "right_shoulder"],

      // Torso
      ["left_shoulder", "right_shoulder"],
      ["left_shoulder", "left_hip"],
      ["right_shoulder", "right_hip"],
      ["left_hip", "right_hip"],

      // Left arm
      ["left_shoulder", "left_elbow"],
      ["left_elbow", "left_wrist"],

      // Right arm
      ["right_shoulder", "right_elbow"],
      ["right_elbow", "right_wrist"],

      // Left leg
      ["left_hip", "left_knee"],
      ["left_knee", "left_ankle"],

      // Right leg
      ["right_hip", "right_knee"],
      ["right_knee", "right_ankle"],
    ];

    // Draw skeleton connections
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#22d3ee";

    connections.forEach(([from, to]) => {
      const fromKp = findKeypoint(keypoints, from);
      const toKp = findKeypoint(keypoints, to);

      if (fromKp && toKp && fromKp.score > 0.3 && toKp.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(fromKp.x, fromKp.y);
        ctx.lineTo(toKp.x, toKp.y);
        ctx.stroke();
      }
    });

    // Draw keypoints with labels - face keypoints get special treatment
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    // Face keypoints (nose, eyes, ears) - draw with different color
    const faceKeypoints = [
      "nose",
      "left_eye",
      "right_eye",
      "left_ear",
      "right_ear",
    ];

    keypoints.forEach((kp, idx) => {
      // Ensure keypoint is valid
      if (
        !kp ||
        kp.score === undefined ||
        kp.x === undefined ||
        kp.y === undefined
      ) {
        return;
      }

      if (kp.score > 0.3) {
        // Get name - use provided name or fallback to index-based name
        const jointName = (
          kp.name ||
          getKeypointName(idx) ||
          `keypoint_${idx}`
        ).toLowerCase();
        const isFaceKeypoint = faceKeypoints.some((face) =>
          jointName.includes(face),
        );

        // Use different colors for face vs body
        if (isFaceKeypoint) {
          // Face keypoints - use purple/magenta color
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#a855f7";
          ctx.fillStyle = "#a855f7";
        } else {
          // Body keypoints - use cyan color
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#22d3ee";
          ctx.fillStyle = "#22d3ee";
        }

        // Outer glow circle (larger for face keypoints)
        const radius = isFaceKeypoint ? 8 : 6;
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, radius, 0, 2 * Math.PI);
        ctx.fill();

        // Inner dot
        ctx.shadowBlur = 0;
        ctx.fillStyle = isFaceKeypoint ? "#c084fc" : "#06b6d4";
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 3, 0, 2 * Math.PI);
        ctx.fill();

        // Label for important joints (including all face keypoints)
        const importantJoints = [
          "nose",
          "left_eye",
          "right_eye",
          "left_ear",
          "right_ear",
          "left_shoulder",
          "right_shoulder",
          "left_hip",
          "right_hip",
          "left_knee",
          "right_knee",
          "left_ankle",
          "right_ankle",
        ];

        if (importantJoints.some((joint) => jointName.includes(joint))) {
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
          const label = jointName.split("_").pop() || "";
          ctx.strokeText(label, kp.x, kp.y - (isFaceKeypoint ? 12 : 10));
          ctx.fillText(label, kp.x, kp.y - (isFaceKeypoint ? 12 : 10));
        }
      }
    });
  };

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
  if (!isActive) {
    return (
      <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-[#FDF8FF] font-body">
            Select an exercise and start to begin
          </p>
        </div>
      </div>
    );
  }
=======
>>>>>>> Stashed changes
  // Show preview video when exercise is selected (and not active)
  const showPreview = !isActive && exercise && previewVideos[exercise]

  // Handle preview video playback
  useEffect(() => {
    const previewVideo = previewVideoRef.current
    if (!previewVideo) return

    if (showPreview && previewVideos[exercise]) {
      previewVideo.src = previewVideos[exercise]
      previewVideo.load()
      previewVideo.play().catch(err => {
        console.error('Error playing preview video:', err)
      })
    } else {
      previewVideo.pause()
      previewVideo.src = ''
    }
  }, [showPreview, exercise])
<<<<<<< Updated upstream
=======
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
>>>>>>> Stashed changes

  if (error) {
    return (
      <div className="relative aspect-video bg-slate-900 rounded-2xl border border-red-500/50 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">📷</div>
          <p className="text-red-400 font-body mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              window.location.reload()
            }}
            className="px-6 py-2 bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition-colors font-display font-semibold"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const getStatusConfig = () => {
    switch (detectionStatus) {
      case "initializing":
        return {
          text: "Initializing...",
          color: "text-[#FDF8FF]",
          bgColor: "bg-slate-800/80",
          borderColor: "border-slate-700",
          icon: "⏳",
          pulse: false,
        };
      case "detecting":
        return {
          text: "Detecting pose...",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/50",
          icon: "👁️",
          pulse: true,
        };
      case "no-pose":
        return {
          text: "Position yourself in frame",
          color: "text-orange-400",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/50",
          icon: "📍",
          pulse: false,
        };
      case "detected":
        return {
          text: "Pose detected",
          color: "text-cyan-400",
          bgColor: "bg-cyan-500/10",
          borderColor: "border-cyan-500/50",
          icon: "👁️",
          pulse: false,
        };
      case "full-body":
        return {
          text: "Full body detected ✓",
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/50",
          icon: "✓",
          pulse: false,
        };
      default:
        return {
          text: "Ready",
          color: "text-[#FDF8FF]",
          bgColor: "bg-slate-800/80",
          borderColor: "border-slate-700",
          icon: "",
          pulse: false,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const visibleKeypoints = keypoints
    ? keypoints.filter((kp) => kp.score > 0.3).length
    : 0;

  // Get detected joints for debug panel, separate face and body
  const faceKeypoints = [
    "nose",
    "left_eye",
    "right_eye",
    "left_ear",
    "right_ear",
  ];
  const detectedJoints = keypoints
    ? keypoints
        .filter((kp) => kp.score > 0.3)
        .map((kp) => ({
          name: kp.name || "unknown",
          score: (kp.score * 100).toFixed(0),
          isFace: faceKeypoints.some((face) =>
            (kp.name || "").toLowerCase().includes(face),
          ),
        }))
        .sort((a, b) => {
          // Sort face keypoints first, then body
          if (a.isFace && !b.isFace) return -1;
          if (!a.isFace && b.isFace) return 1;
          return a.name.localeCompare(b.name);
        })
    : [];

  const faceDetected = detectedJoints.some((joint) => joint.isFace);
  const faceCount = detectedJoints.filter((joint) => joint.isFace).length;

  return (
    <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      {/* Default message when not active and no exercise selected */}
      {!isActive && !exercise && (
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-500 font-body">Select an exercise and start to begin</p>
          </div>
        </div>
      )}

      {/* Exercise preview video - shown when exercise is selected (and not active) */}
      {showPreview && (
        <video
          ref={previewVideoRef}
          autoPlay
          loop
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      )}

      {/* Live camera feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${showPreview ? 'opacity-0' : ''}`}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Exercise name badge */}
      {exercise && !showPreview && (
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700">
          <span className="text-cyan-400 font-display font-semibold capitalize">
            {exercise}
          </span>
        </div>
      )}

      {/* Preview label */}
      {showPreview && (
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/50 z-20">
          <span className="text-cyan-400 font-display font-semibold capitalize">
            {exercise} Preview
          </span>
        </div>
      )}

      {/* Preview label */}
      {showPreview && (
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/50 z-20">
          <span className="text-cyan-400 font-display font-semibold capitalize">
            {exercise} Preview
          </span>
        </div>
      )}

      {/* Detection status indicator */}
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
      {isActive && (
        <div
          className={`absolute top-4 right-4 ${statusConfig.bgColor} backdrop-blur-sm px-4 py-2 rounded-lg border ${statusConfig.borderColor} ${statusConfig.pulse ? "animate-pulse" : ""}`}
        >
=======
>>>>>>> Stashed changes
      {isActive && !showPreview && (
        <div className={`absolute top-4 right-4 ${statusConfig.bgColor} backdrop-blur-sm px-4 py-2 rounded-lg border ${statusConfig.borderColor} ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
          <div className="flex items-center gap-2">
            <span className={statusConfig.color}>{statusConfig.icon}</span>
            <span
              className={`${statusConfig.color} font-body text-sm font-medium`}
            >
              {statusConfig.text}
            </span>
          </div>
          {(detectionStatus === "detected" ||
            detectionStatus === "full-body") &&
            visibleKeypoints > 0 && (
              <div className="text-xs text-[#FDF8FF] mt-1">
                {visibleKeypoints} keypoints visible
                {faceDetected && (
                  <span className="text-purple-400 ml-2">
                    • {faceCount} face points
                  </span>
                )}
                {isFullBodyVisible && exercise && (
                  <span className="text-green-400 ml-2">• Full body ready</span>
                )}
              </div>
            )}
        </div>
      )}

      {/* Green border when full body is detected */}
      {isFullBodyVisible && exercise && !showPreview && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-4 border-green-500 rounded-2xl animate-pulse-slow"></div>
        </div>
      )}

      {/* Cyan border when pose detected but not full body */}
<<<<<<< Updated upstream
      {detectionStatus === 'detected' && !isFullBodyVisible && !showPreview && (
=======
<<<<<<< HEAD
      {detectionStatus === "detected" && !isFullBodyVisible && (
=======
      {detectionStatus === 'detected' && !isFullBodyVisible && !showPreview && (
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
>>>>>>> Stashed changes
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-2xl"></div>
        </div>
      )}

<<<<<<< HEAD
      {/* Debug panel showing detected joints */}
      {detectionStatus === "detected" && detectedJoints.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-cyan-500/50 max-w-xs max-h-48 overflow-y-auto">
=======

      {/* Presage Metrics Display - shows when face/shoulders detected (breathing) or full body (all metrics) */}
      {isActive && !showPreview && (detectionStatus === 'full-body' || detectionStatus === 'detected') && (
        <div className={`absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-sm px-4 py-3 rounded-lg border max-w-xs ${
          detectionStatus === 'full-body' ? 'border-green-500/50' : 'border-cyan-500/50'
        }`}>
          <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
            detectionStatus === 'full-body' ? 'text-green-400' : 'text-cyan-400'
          }`}>
            Presage Analytics {detectionStatus === 'full-body' ? '(Full Body)' : '(Breathing Only)'}
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Breathing Rate:</span>
              <span className={`font-semibold ${
                breathingRate === 'fast' ? 'text-yellow-400' :
                breathingRate === 'slow' ? 'text-blue-400' :
                'text-green-400'
              }`}>
                {breathingRate || 'normal'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Consistency:</span>
              <span className={`font-semibold ${
                breathingConsistency === 'erratic' ? 'text-orange-400' : 'text-green-400'
              }`}>
                {breathingConsistency || 'steady'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Signal Confidence:</span>
              <span className={`font-semibold ${
                signalConfidence === 'low' ? 'text-red-400' :
                signalConfidence === 'medium' ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {signalConfidence || 'medium'}
              </span>
            </div>
            {repCount > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <span className="text-slate-300">Reps:</span>
                <span className="text-cyan-400 font-semibold">{repCount}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debug panel showing detected joints */}
      {detectionStatus === 'detected' && detectedJoints.length > 0 && !showPreview && (
        <div className="absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-cyan-500/50 max-w-xs max-h-48 overflow-y-auto">
>>>>>>> 83a33f7741413d9f559348fccad62488bf18f607
          <div className="text-xs text-cyan-400 font-semibold mb-2 uppercase tracking-wide">
            Detected Joints ({detectedJoints.length})
          </div>

          {/* Face section */}
          {faceDetected && (
            <div className="mb-3 pb-2 border-b border-slate-700">
              <div className="text-xs text-purple-400 font-semibold mb-1">
                Face
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {detectedJoints
                  .filter((j) => j.isFace)
                  .map((joint, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-[#FDF8FF]"
                    >
                      <span className="capitalize text-purple-300">
                        {joint.name.replace(/_/g, " ")}
                      </span>
                      <span className="text-purple-400 ml-2">
                        {joint.score}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Body section */}
          <div>
            <div className="text-xs text-cyan-400 font-semibold mb-1">Body</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {detectedJoints
                .filter((j) => !j.isFace)
                .map((joint, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-[#FDF8FF]"
                  >
                    <span className="capitalize">
                      {joint.name.replace(/_/g, " ")}
                    </span>
                    <span className="text-cyan-400 ml-2">{joint.score}%</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
