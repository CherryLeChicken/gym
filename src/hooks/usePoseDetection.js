import { useState, useCallback, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as poseDetection from '@tensorflow-models/pose-detection'

export function usePoseDetection() {
  const [detector, setDetector] = useState(null)
  const [keypoints, setKeypoints] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize detector
  useEffect(() => {
    const initDetector = async () => {
      try {
        console.log('Initializing TensorFlow.js...')
        
        // Try to set backend to WebGL, fall back to CPU if it fails
        // Suppress console warnings during backend selection
        const originalWarn = console.warn
        console.warn = () => {} // Temporarily suppress warnings
        
        let backendSet = false
        const backends = ['webgl', 'cpu']
        
        for (const backend of backends) {
          try {
            await tf.setBackend(backend)
            await tf.ready()
            console.log(`TensorFlow.js ready with ${backend} backend`)
            backendSet = true
            break
          } catch (backendError) {
            // Silently try next backend
            continue
          }
        }
        
        // Restore console.warn
        console.warn = originalWarn
        
        if (!backendSet) {
          // If all backends failed, just wait for default
          await tf.ready()
          console.log('TensorFlow.js ready with default backend')
        }
        
        console.log('Initializing MoveNet pose detector...')
        const model = poseDetection.SupportedModels.MoveNet
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        }
        console.log('Creating detector with config:', detectorConfig)
        const poseDetector = await poseDetection.createDetector(model, detectorConfig)
        console.log('Pose detector initialized successfully!')
        setDetector(poseDetector)
        setIsLoading(false)
      } catch (error) {
        console.error('Error initializing pose detector:', error)
        console.error('Error details:', error.message, error.stack)
        setIsLoading(false)
      }
    }

    initDetector()
  }, [])

  const detectPose = useCallback(async (videoElement) => {
    if (!detector) {
      console.warn('Detector not ready')
      return
    }
    if (!videoElement) {
      console.warn('Video element not ready')
      return
    }

    try {
      const poses = await detector.estimatePoses(videoElement)
      if (poses && poses.length > 0) {
        const pose = poses[0]
        // MoveNet returns keypoints as an array, assign names based on index
        const keypointsWithNames = pose.keypoints.map((kp, idx) => {
          // Ensure we have x, y, and score properties
          const keypoint = {
            x: kp.x || 0,
            y: kp.y || 0,
            score: kp.score || 0,
            name: getKeypointName(idx) // Always assign name based on index
          }
          return keypoint
        })
        setKeypoints(keypointsWithNames)
      } else {
        // No pose detected - this is normal if person isn't in frame
        setKeypoints(null)
      }
    } catch (error) {
      console.error('Error detecting pose:', error)
      console.error('Error details:', error.message)
      setKeypoints(null)
    }
  }, [detector])

  return { detectPose, keypoints, isLoading }
}

// Helper function to get keypoint names (MoveNet keypoint indices)
function getKeypointName(index) {
  const names = [
    'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
    'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
    'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
    'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
  ]
  return names[index] || `keypoint_${index}`
}
