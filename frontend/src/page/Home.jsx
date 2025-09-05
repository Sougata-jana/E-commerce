import React from 'react'
import Hero from '../components/Hero'
import NewCollection from '../components/NewCollection'
import BestSaller from '../components/BestSaller'

function Home() {
  return (
    <div>
      <Hero />
      <NewCollection/>
      <BestSaller/>
    </div>
  )
}

export default Home