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
    // if (loadedData.length > 3) {
    if (!isPlaying) {
      videoRef.current[videoId].pause()
    } else {
      startPlay && videoRef.current[videoId].play()
    }
    // }
  }, [startPlay, videoId, isPlaying, loadedData])

  useEffect(() => {
    const currentProgress = 0;
    let span = videoSpanRef.current;
    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {

        },
        onComplete: () => {

        }
      })
    }
    return () => {

    }
  }, [videoId, startPlay])

  const handleProcess = useCallback((actions, i) => {
    switch (actions) {
      case "play": setVideo({ ...video, isPlaying: !video.isPlaying })
        break;
      // case "pause": setVideo({ ...video, isPlaying: true })
      //   break;
      case "last": setVideo({ ...video, isLastVideo: true })
        break;
      case "reset": setVideo({ ...video, isLastVideo: false, videoId: 0, })
        break;
      case "end": setVideo({ ...video, videoId: i + 1, isEnd: true })
        break;
      default:
        return video
    }
  }, [])

  const handlerLoadedData = useCallback((i, e) => {
    setLoadedData([...loadedData, e])
  }, [loadedData])
  return (
    <>
      <div className='flex items-center !mt-10'>
        {
          highlightsSlides.map((slide, index) => (
            <div key={slide.id} id='slider' className='!sm:pr-20 !pr-10'>
              <div className='video-carousel_container'>
                <div className='w-[90%] h-full flex justify-center items-center rounded-3xl overflow-hidden bg-black'>
                  <video
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
      </div>
      <div className='relative flex items-center justify-center !mt-10'>
        <div className='flex justify-center items-center !py-5 !px-7 bg-gray-600 backdrop-blur rounded-full'>
          {
            videoRef.current.map((_, index) => (
              <span
                key={index}
                ref={(el) => (videoDivRef.current[index] = el)}
                className='w-3 h-3 rounded-full bg-gray-200 !mx-2'
              >
                <span ref={(el) => (videoSpanRef.current[index] = el)} className='absolute w-full h-full rounded-full'></span>
              </span>
            ))
          }
        </div>
        <button onClick={() =>
          isLastVideo ? handleProcess('reset') :
            !isPlaying ? handleProcess('play') :
              handleProcess('pause')
        }
          className='flex justify-center items-center !p-3 !ml-4 bg-gray-600 backdrop-blur rounded-full cursor-pointer'>
          <img src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg} alt="" />
        </button>
      </div >
    </>
  )
}

export default VideoCarousel
