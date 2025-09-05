import React from 'react'
import Hero from '../components/Hero'
import NewCollection from '../components/NewCollection'
import BestSaller from '../components/BestSaller'
import OurPolicy from '../components/OurPolicy'
import NewLaterBox from '../components/NewLaterBox'

function Home() {
  return (
    <div>
      <Hero />
      <NewCollection/>
      <BestSaller/>
      <OurPolicy/>
      <NewLaterBox/>
    </div>
  )
}

export default Home