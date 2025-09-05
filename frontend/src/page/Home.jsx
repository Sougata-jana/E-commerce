import React from 'react'
import Hero from '../components/Hero'
import NewCollection from '../components/NewCollection'
import BestSaller from '../components/BestSaller'
import OurPolicy from '../components/OurPolicy'

function Home() {
  return (
    <div>
      <Hero />
      <NewCollection/>
      <BestSaller/>
      <OurPolicy/>
    </div>
  )
}

export default Home