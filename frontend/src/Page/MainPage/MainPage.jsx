import React from 'react'

import Contact from './Contact'
import Hero from './Hero'
import Forum from './Forum'
import './MainPage.scss'
const MainPage = () => {
  return (
    <div className='top-section'>
      <Hero/>
      <Contact/>
      <Forum/>
    </div>
  )
}

export default MainPage