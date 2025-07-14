import React from 'react'
import './Home.css'
import HeroRight from '../../components/HeroRight/HeroRight'
import HeroLeft from '../../components/HeroLeft/HeroLeft'
import Features from '../../components/Features/Features'
import HowAttendifyWork from '../../components/HowAttendifyWork/HowAttendifyWork'

const Home = () => {
  return (
    <div className='home'>
      <div className="hero-section">
        <HeroLeft />
        <HeroRight />
      </div>
      <hr className='text-gray-300' />
      <div id='features' className="feature-section">
        <Features />
      </div>
      <hr className='text-gray-300' />
      <div className="working-section">
        <HowAttendifyWork />
      </div>
    </div>
  )
}

export default Home
