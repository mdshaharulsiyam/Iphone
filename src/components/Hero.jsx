

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useState } from 'react'
import { heroVideo, smallHeroVideo } from '../utils'
const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 768 ? smallHeroVideo : heroVideo)
  const handleVideoChange = () => {
    if (window.innerWidth < 768) {
      setVideoSrc(smallHeroVideo)
    } else {
      setVideoSrc(heroVideo)
    }
  }
  useGSAP(() => {
    gsap.to('#hero', {
      opacity: 1,
      duration: 3,
      delay: 1
    })
    gsap.to('#cta', {
      opacity: 1,
      duration: 1,
      delay: 2,
      y: -50
    })
  }, [])
  useEffect(() => {
    window.addEventListener('resize', handleVideoChange)
    return () => {
      window.removeEventListener('resize', handleVideoChange)
    }
  }, [])
  return (
    <section className='w-full nav-height bg-black relative'>
      <div className='h-5/6 w-full flex-center-center flex-col'>
        <p id='hero' className='hero-title'>iPhone 15 Pro</p>
        <div className='md:w-10/12 w-9/12'>
          <video autoPlay muted playsInline key={videoSrc}>
            <source src={videoSrc} type='video/mp4' />
          </video>
        </div>
      </div>
      <div id='cta' className='flex items-center flex-col opacity-0 translate-y-20'>
        <a href="#highlights" className='btn !px-6 !py-2'>Buy</a>
        <p className='font-normal text-xl'>From $199/month or $999</p>
      </div>
    </section>
  )
}

export default Hero
