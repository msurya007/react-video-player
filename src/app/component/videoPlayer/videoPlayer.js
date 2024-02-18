"use client";
import { Switch } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowsPointingOutIcon, PauseIcon, PlayIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

const VideoPlayer = ({ playListData, clickRow }) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [playBackSpeed, setPlayBackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef(null);

  useEffect(() => {
    if (clickRow !== null && clickRow !== undefined) {
      setCurrentIndex(clickRow);
    }
  }, [clickRow]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    };

    const handlePlay = () => {
      setIsPlay(true);
    };

    const handlePause = () => {
      setIsPlay(false);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.current.addEventListener("ended", handleVideoEnd);
      videoRef.current.addEventListener('play', handlePlay);
      videoRef.current.addEventListener('pause', handlePause);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        videoRef.current.removeEventListener("ended", handleVideoEnd);
        videoRef.current.removeEventListener('play', handlePlay);
        videoRef.current.removeEventListener('pause', handlePause);
      }
    };


  }, [currentIndex, clickRow])

  const formatTime = (timeInSeconds) => {

    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return timeInSeconds ? `${hours ? hours + ':' : ''}${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''
      }${seconds}` : '00:00';
  };


  const handleVideoEnd = () => {
    if (currentIndex < playListData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back to the first video
      setCurrentIndex(0);
    }
  }

  const handlePlayPause = () => {
    setIsPlay(!isPlay);
    if (isPlay) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }

  const handlePlayBack = (event) => {
    const speed = parseFloat(event.target.value);
    setPlayBackSpeed(speed);
    videoRef.current.playbackrate = speed;
  }

  const handleSeek = (event) => {
    const currentTime = event.target.value;
    videoRef.current.currentTime = currentTime;
  }

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };


  const handleFullScreen = () => {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
  };

  return (
    <div>
      <div className='h-14 flex items-center bg-slate-500 text-white justify-center shadow-md shadow-gray-400'>
        <p className='font-bold text-2xl'>{playListData[currentIndex].title}</p>
      </div>
      <video
        ref={videoRef}
        src={playListData[currentIndex].sources}
        playbackrate={playBackSpeed}
        autoPlay={autoPlayEnabled}
        className='h-[550px] w-full'
      />

      <div className="controls flex justify-between p-4 bg-slate-300">
        <div>
          <button onClick={handlePlayPause}>
            {isPlay ? <PauseIcon className='h-6 w-6' /> :
              <PlayIcon className='h-6 w-6' />
            }
          </button>
        </div>
        <div>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
          />
        </div>
        <div>
          <span>{`${formatTime(currentTime)} / ${formatTime(duration)}`}</span>
        </div>

        <div>
          <span className='mr-2'>Playback</span>
          <select value={playBackSpeed} onChange={handlePlayBack}>
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>

        <div className='flex items-center'>
          <span className='mr-2'>Auto Play</span>
          <Switch
            checked={autoPlayEnabled}
            onChange={setAutoPlayEnabled}
            className={`${autoPlayEnabled ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex border-2 border-black h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${autoPlayEnabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        <div className='flex items-center'>

          {volume == 0 ? <SpeakerXMarkIcon className='h-6 w-6' />
            :
            <SpeakerWaveIcon className='h-6 w-6' />
          }
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
        </div>

        <div>
          <button onClick={handleFullScreen}>
            <ArrowsPointingOutIcon className="h-6 w-6" />
          </button>
        </div>

      </div>
    </div>

  )
}

export default VideoPlayer;