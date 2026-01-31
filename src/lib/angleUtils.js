/**
 * Calculate angle between three points (point2 is the vertex)
 * @param {Object} p1 - First point {x, y}
 * @param {Object} p2 - Vertex point {x, y}
 * @param {Object} p3 - Third point {x, y}
 * @returns {number} Angle in degrees
 */
export function calculateAngle(p1, p2, p3) {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x)
  let angle = Math.abs(radians * 180.0 / Math.PI)
  if (angle > 180.0) {
    angle = 360 - angle
  }
  return angle
}

/**
 * Calculate distance between two points
 * @param {Object} p1 - First point {x, y}
 * @param {Object} p2 - Second point {x, y}
 * @returns {number} Distance
 */
export function calculateDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

/**
 * Find keypoint by name (case-insensitive partial match)
 * @param {Array} keypoints - Array of keypoint objects
 * @param {string} name - Name to search for
 * @returns {Object|null} Keypoint object or null
 */
export function findKeypoint(keypoints, name) {
  if (!keypoints || keypoints.length === 0) return null
  
  const lowerName = name.toLowerCase()
  return keypoints.find(kp => {
    const kpName = (kp.name || '').toLowerCase()
    return kpName.includes(lowerName) && kp.score > 0.3
  })
}
