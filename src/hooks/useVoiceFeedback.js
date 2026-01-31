import { useRef, useCallback } from 'react'

// Audio queue to prevent overlapping speech
class AudioQueue {
  constructor() {
    this.queue = []
    this.isPlaying = false
  }

  async add(audioUrl) {
    return new Promise((resolve, reject) => {
      this.queue.push({ audioUrl, resolve, reject })
      this.processQueue()
    })
  }

  async processQueue() {
    if (this.isPlaying || this.queue.length === 0) return

    this.isPlaying = true
    const { audioUrl, resolve, reject } = this.queue.shift()

    try {
      const audio = new Audio(audioUrl)
      
      audio.onended = () => {
        this.isPlaying = false
        resolve()
        this.processQueue()
      }

      audio.onerror = (error) => {
        this.isPlaying = false
        reject(error)
        this.processQueue()
      }

      await audio.play()
    } catch (error) {
      this.isPlaying = false
      reject(error)
      this.processQueue()
    }
  }
}

const audioQueue = new AudioQueue()

export function useVoiceFeedback() {
  const apiKeyRef = useRef(null)

  // Get API key from environment or prompt user
  const getApiKey = useCallback(() => {
    if (apiKeyRef.current) return apiKeyRef.current
    
    // Check for environment variable (in production, this would be set)
    const envKey = import.meta.env.VITE_ELEVENLABS_API_KEY
    
    if (envKey) {
      apiKeyRef.current = envKey
      return envKey
    }

    // For development, prompt user (or use a default demo key)
    // In production, this should be set via environment variables
    console.warn('ElevenLabs API key not found. Please set VITE_ELEVENLABS_API_KEY')
    return null
  }, [])

  const speak = useCallback(async (text) => {
    if (!text || !text.trim()) return

    const apiKey = getApiKey()
    if (!apiKey) {
      // Fallback to Web Speech API if ElevenLabs is not configured
      console.log('Using Web Speech API fallback')
      return speakWithWebAPI(text)
    }

    try {
      // ElevenLabs TTS API
      const response = await fetch(
        'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', // Default voice ID
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        }
      )

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      await audioQueue.add(audioUrl)
      
      // Clean up blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(audioUrl), 60000)
    } catch (error) {
      console.error('Error with ElevenLabs TTS:', error)
      // Fallback to Web Speech API
      return speakWithWebAPI(text)
    }
  }, [getApiKey])

  return { speak }
}

// Fallback to Web Speech API
function speakWithWebAPI(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    return new Promise((resolve) => {
      utterance.onend = resolve
      utterance.onerror = () => resolve()
      window.speechSynthesis.speak(utterance)
    })
  }
  
  return Promise.resolve()
}
