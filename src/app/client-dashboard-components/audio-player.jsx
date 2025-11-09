'use client'
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Download
} from 'lucide-react';

const CustomAudioPlayer = ({ url }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Format time in MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Seek to position
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audio.currentTime = percentage * duration;
  };

  // Skip forward/backward
  const skip = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.5;
      setVolume(volume || 0.5);
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  // Download audio
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'audio-recording.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-green-50/30 rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
      <audio ref={audioRef} src={url} />

      {/* Main Controls */}
      <div className="flex items-center gap-4 mb-4">
        
        {/* Skip Back Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => skip(-10)}
          className="p-2 rounded-lg text-gray-600 hover:bg-white hover:text-green-600 transition-all"
          title="Skip back 10s"
        >
          <SkipBack size={20} />
        </motion.button>

        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlay}
          disabled={isLoading}
          className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <Pause size={24} fill="white" />
          ) : (
            <Play size={24} fill="white" className="ml-1" />
          )}
        </motion.button>

        {/* Skip Forward Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => skip(10)}
          className="p-2 rounded-lg text-gray-600 hover:bg-white hover:text-green-600 transition-all"
          title="Skip forward 10s"
        >
          <SkipForward size={20} />
        </motion.button>

        {/* Progress Bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span className="font-medium">{formatTime(currentTime)}</span>
            <span className="font-medium">{formatTime(duration)}</span>
          </div>
          
          {/* Progress Bar */}
          <div 
            onClick={handleSeek}
            className="relative h-2 bg-gray-200 rounded-full cursor-pointer group"
          >
            {/* Progress Fill */}
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            
            {/* Progress Thumb */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-green-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, marginLeft: '-8px' }}
            />
          </div>
        </div>

        {/* Volume Controls */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg text-gray-600 hover:bg-white hover:text-green-600 transition-all"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 appearance-none cursor-pointer volume-slider"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${(isMuted ? 0 : volume) * 100}%, #e5e7eb ${(isMuted ? 0 : volume) * 100}%, #e5e7eb 100%)`
            }}
          />
        </div>

        {/* Download Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="p-2 rounded-lg text-gray-600 hover:bg-white hover:text-green-600 transition-all"
          title="Download audio"
        >
          <Download size={20} />
        </motion.button>
      </div>

      {/* Waveform Visual (Optional decorative element) */}
      <div className="flex items-center justify-center gap-1 h-12 opacity-30">
        {Array.from({ length: 40 }).map((_, i) => {
          const height = Math.sin(i * 0.5) * 20 + 20;
          const isActive = (i / 40) * 100 < progress;
          return (
            <motion.div
              key={i}
              initial={{ height: 4 }}
              animate={{ 
                height: isPlaying ? height : 4,
                backgroundColor: isActive ? '#10b981' : '#d1d5db'
              }}
              transition={{ 
                duration: 0.3,
                repeat: isPlaying ? Infinity : 0,
                repeatType: 'reverse',
                delay: i * 0.05
              }}
              className="w-1 rounded-full transition-colors"
            />
          );
        })}
      </div>

      <style jsx>{`
        .volume-slider {
          background: transparent;
        }

        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(to right, #10b981, #059669);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          margin-top: -5px;
        }

        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(to right, #10b981, #059669);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .volume-slider::-webkit-slider-runnable-track {
          background: #e5e7eb;
          height: 4px;
          border-radius: 2px;
        }

        .volume-slider::-moz-range-track {
          background: #e5e7eb;
          height: 4px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default CustomAudioPlayer;