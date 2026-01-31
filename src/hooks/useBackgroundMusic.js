import { useState, useRef, useCallback, useEffect } from 'react'

export function useBackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [volume, setVolume] = useState(0.2)
  const [isMuted, setIsMuted] = useState(false)
  const [audioData, setAudioData] = useState(new Uint8Array(0))
  
  const audioRef = useRef(null)
  const prevVolumeRef = useRef(0.2)
  const apiKeyRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyzerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const sourceRef = useRef(null)

  const getApiKey = useCallback(() => {
    if (apiKeyRef.current) return apiKeyRef.current
    const envKey = import.meta.env.VITE_ELEVENLABS_API_KEY
    if (envKey) {
      apiKeyRef.current = envKey
      return envKey
    }
    return null
  }, [])

  const updateVolume = useCallback((newVolume) => {
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (isMuted) {
      const restoredVolume = prevVolumeRef.current || 0.2
      setVolume(restoredVolume)
      if (audioRef.current) audioRef.current.volume = restoredVolume
      setIsMuted(false)
    } else {
      prevVolumeRef.current = volume
      setVolume(0)
      if (audioRef.current) audioRef.current.volume = 0
      setIsMuted(true)
    }
  }, [isMuted, volume])

  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    setIsPlaying(false)
    setCurrentPrompt('')
    setAudioData(new Uint8Array(0))
  }, [])

  const startVisualizer = useCallback(() => {
    if (!audioRef.current) return

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        analyzerRef.current = audioContextRef.current.createAnalyser()
        // Increase fftSize for more frequency data points
        analyzerRef.current.fftSize = 128
        // Add smoothing to make the visualizer less jittery
        analyzerRef.current.smoothingTimeConstant = 0.8
      }

      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume()
      }

      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)
        sourceRef.current.connect(analyzerRef.current)
        analyzerRef.current.connect(audioContextRef.current.destination)
      }

      const bufferLength = analyzerRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const animate = () => {
        if (!audioRef.current || audioRef.current.paused) {
          setAudioData(new Uint8Array(bufferLength).fill(0))
          animationFrameRef.current = requestAnimationFrame(animate)
          return
        }
        
        analyzerRef.current.getByteFrequencyData(dataArray)
        // Create a new array to trigger state update
        setAudioData(new Uint8Array(dataArray))
        animationFrameRef.current = requestAnimationFrame(animate)
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      animate()
    } catch (err) {
      console.error('Visualizer error:', err)
    }
  }, [])

  const playMusic = useCallback(async (prompt) => {
    if (!prompt || !prompt.trim()) return

    const apiKey = getApiKey()
    if (!apiKey) {
      setError('ElevenLabs API key not found. Please set VITE_ELEVENLABS_API_KEY')
      return
    }

    setIsLoading(true)
    setError(null)
    setCurrentPrompt(prompt)

    try {
      stopMusic()

      console.log(`🎵 Generating background audio with ElevenLabs Sound Effects: "${prompt}"`)
      
      const response = await fetch(
        'https://api.elevenlabs.io/v1/sound-generation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text: `Background music: ${prompt}. Continuous, rhythmic, instrumental only.`,
            duration_seconds: 22,
            prompt_influence: 0.3
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: { message: response.statusText } }))
        throw new Error(`ElevenLabs API error (${response.status}): ${errorData.detail?.message || response.statusText}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      audio.loop = true
      audio.volume = volume
      // Use anonymous crossOrigin to allow Web Audio API access to the blob URL
      audio.crossOrigin = "anonymous"
      
      audioRef.current = audio
      
      await audio.play()
      setIsPlaying(true)
      startVisualizer()
      console.log('✅ Background audio playing (looped)')
    } catch (err) {
      console.error('❌ Error generating background audio:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [getApiKey, stopMusic, volume, startVisualizer])

  const togglePlay = useCallback(async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume()
        }
        await audioRef.current.play()
        setIsPlaying(true)
        // Ensure visualizer is running when we resume
        if (!animationFrameRef.current) {
          startVisualizer()
        }
      }
    }
  }, [isPlaying, startVisualizer])

  useEffect(() => {
    return () => {
      stopMusic()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [stopMusic])

  return {
    playMusic,
    stopMusic,
    togglePlay,
    updateVolume,
    volume,
    toggleMute,
    isMuted,
    isPlaying,
    isLoading,
    error,
    currentPrompt,
    audioData
  }
}
