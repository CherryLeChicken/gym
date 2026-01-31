import { useMemo } from 'react'
import { calculateAngle, findKeypoint } from '../lib/angleUtils'
import { analyzeSquat } from '../lib/exerciseAnalyzers'

export function useFormAnalysis(exercise) {
  const analyzeForm = useMemo(() => {
    return (keypoints) => {
      if (!keypoints || !exercise) {
        return { feedback: '', isValid: false }
      }

      switch (exercise) {
        case 'squat':
          return analyzeSquat(keypoints)
        case 'push-up':
          // TODO: Implement push-up analysis in Phase 2
          return { feedback: 'Push-up analysis coming soon!', isValid: false }
        default:
          return { feedback: '', isValid: false }
      }
    }
  }, [exercise])

  return { analyzeForm }
}
