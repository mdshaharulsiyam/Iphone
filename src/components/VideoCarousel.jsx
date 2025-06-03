import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCallback, useEffect, useRef, useState } from 'react'
import { highlightsSlides, } from '../constants'
import { pauseImg, playImg, replayImg } from '../utils'
gsap.registerPlugin(ScrollTrigger)
const VideoCarousel = () => {
  const videoRef = useRef([])
  const videoSpanRef = useRef([])
  const videoDivRef = useRef([])
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isPlaying: false,
    isLastVideo: false
  })
  const [loadedData, setLoadedData] = useState([])

  const { isEnd, startPlay, videoId, isPlaying, isLastVideo } = video;

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${videoId * -100}%)`,
      duration: 2,
      ease: "power2.inOut"
    })
    gsap.to('#video', {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none"
      },
      onComplete: () => {
        setVideo({ ...video, isPlaying: true, startPlay: true })
      }
    })
  }, [isEnd, videoId])

  useEffect(() => {
    // if (loadedData.length  3) {
    if (!isPlaying) {
      videoRef.current[videoId].pause()
    } else {
      startPlay && videoRef.current[videoId].play()
    }
    // }
  }, [startPlay, videoId, isPlaying, loadedData, isLastVideo])

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;
    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress != currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId],
              {
                width: window.innerWidth < 760 ? "10vw" : window.innerWidth < 1200 ? "8vw" : "4vw"

              })
            gsap.to(span[videoId], { width: `${currentProgress}%`, backgroundColor: "white" })
          }

        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], { width: "12px" })
            gsap.to(span[videoId], { backgroundColor: "#afafaf" })
          }
        }
      })
      if (videoId == 0) {
        anim.restart();
      }
      const animUpdate = () => {
        anim.progress(videoRef.current[videoId].currentTime / highlightsSlides[videoId].videoDuration)
      }
      if (isPlaying) {
        gsap.ticker.add(animUpdate)
      } else {
        gsap.ticker.remove(animUpdate)
      }
    }
    return () => {
    }
  }, [videoId, startPlay])

  const handleProcess = useCallback((actions, i) => {
    setVideo((prevVideo) => {
      switch (actions) {
        case "play":
          return { ...prevVideo, isPlaying: !prevVideo.isPlaying };
        case "last":
          return { ...prevVideo, isLastVideo: true, isPlaying: false };
        case "reset":
          return { ...prevVideo, isLastVideo: false, videoId: 0, isPlaying: false };
        case "end":
          if (i + 1 >= highlightsSlides.length) {
            return { ...prevVideo, isLastVideo: true, isPlaying: false };
          }
          return { ...prevVideo, videoId: i + 1, isEnd: true };
        default:
          return prevVideo;
      }
    });
  }, []);


  const handlerLoadedData = useCallback((i, e) => {
    setLoadedData([...loadedData, e])
  }, [loadedData]);
  return (
    <>
      <div className='flex items-center !mt-10'>
        {
          highlightsSlides.map((slide, index) => (
            <div key={slide.id} id='slider' className='!sm:pr-20 !pr-10'>
              <div className='video-carousel_container'>
                <div className='w-[90%] h-full flex justify-center items-center rounded-3xl overflow-hidden bg-black'>
                  <video
                    onEnded={() => {
                      index !== 3 ? handleProcess("end", index) : handleProcess("last", index);
                    }}
                    ref={(el) => (videoRef.current[index] = el)}
                    onPlay={() => setVideo({ ...video, isPlaying: true })}
                    id='video'
                    playsInline
                    preload='auto'
                    muted
                    onLoadedMetadata={(e) => handlerLoadedData(index, e)}
                  >
                    <source src={slide.video} type='video/mp4' />
                  </video>
                </div>
                <div className='absolute top-12 left-[5%] z-10'>
                  {
                    slide.textLists.map((text, index) => (
                      <p key={text} className='md:text-2xl text-xl font-medium'>
                        {text}
                      </p>
                    ))
                  }
                </div>
              </div>
            </div>
          ))
        }
      </div >
      <div className='flex items-center justify-center !mt-10'>
        <div className='flex justify-center items-center !py-5 !px-7 bg-gray-600 backdrop-blur rounded-full'>
          {
            videoRef.current.map((_, index) => (
              <span
                key={index}
                ref={(el) => (videoDivRef.current[index] = el)}
                className='w-3 h-3 rounded-full bg-[#afafaf] !mx-2 relative'
              >
                <span ref={(el) => (videoSpanRef.current[index] = el)} className='absolute w-full h-full rounded-full'></span>
              </span>
            ))
          }
        </div>
        <button onClick={() =>
          isLastVideo ? handleProcess('reset') :
            !isPlaying ? handleProcess('play') :
              handleProcess('play')
        }
          className='flex justify-center items-center !p-3 !ml-4 bg-gray-600 backdrop-blur rounded-full cursor-pointer'>
          <img src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg} alt="" />
        </button>
      </div >
    </>
  )
}

export default VideoCarousel
