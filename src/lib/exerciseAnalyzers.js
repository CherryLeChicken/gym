import { calculateAngle, findKeypoint } from './angleUtils'

/**
 * Analyze squat form based on keypoints
 * Checks: knee angle, hip position, back alignment
 */
export function analyzeSquat(keypoints) {
  const leftHip = findKeypoint(keypoints, 'left_hip')
  const rightHip = findKeypoint(keypoints, 'right_hip')
  const leftKnee = findKeypoint(keypoints, 'left_knee')
  const rightKnee = findKeypoint(keypoints, 'right_knee')
  const leftAnkle = findKeypoint(keypoints, 'left_ankle')
  const rightAnkle = findKeypoint(keypoints, 'right_ankle')
  const leftShoulder = findKeypoint(keypoints, 'left_shoulder')
  const rightShoulder = findKeypoint(keypoints, 'right_shoulder')

  // Use left side by default, fallback to right
  const hip = leftHip || rightHip
  const knee = leftKnee || rightKnee
  const ankle = leftAnkle || rightAnkle
  const shoulder = leftShoulder || rightShoulder

  // If key body parts are missing, return empty feedback (visual indicator will show instead)
  if (!hip || !knee || !ankle) {
    return {
      feedback: '',
      isValid: false
    }
  }

  // Calculate knee angle (hip-knee-ankle)
  const kneeAngle = calculateAngle(hip, knee, ankle)

  // Calculate hip angle (shoulder-hip-knee) for back alignment
  let hipAngle = null
  if (shoulder) {
    hipAngle = calculateAngle(shoulder, hip, knee)
  }

  // Determine feedback based on angles
  let feedback = ''
  let isValid = true

  // Knee angle analysis (for squat depth)
  if (kneeAngle > 160) {
    feedback = 'Bend your knees more to go deeper into the squat'
    isValid = false
  } else if (kneeAngle < 70) {
    feedback = 'Great depth! Keep your knees aligned with your toes'
    isValid = true
  } else if (kneeAngle < 100) {
    feedback = 'Good form! You\'re getting deep into the squat'
    isValid = true
  } else {
    feedback = 'You\'re doing great! Keep it up!'
    isValid = true
  }

  // Back alignment check (if shoulder is visible)
  if (hipAngle !== null) {
    if (hipAngle < 150) {
      feedback = 'Keep your back straight and chest up'
      isValid = false
    }
  }

  // Knee alignment check (knee should be over ankle)
  const kneeAnkleAlignment = Math.abs(knee.x - ankle.x)
  const hipKneeDistance = Math.sqrt(
    Math.pow(hip.x - knee.x, 2) + Math.pow(hip.y - knee.y, 2)
  )
  const alignmentRatio = kneeAnkleAlignment / (hipKneeDistance || 1)

  if (alignmentRatio > 0.3) {
    feedback = 'Keep your knees aligned with your toes, don\'t let them cave in'
    isValid = false
  }

  return { feedback, isValid, kneeAngle, hipAngle }
}
