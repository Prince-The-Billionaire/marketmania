import HeroGraph from '@/components/HeroGraph'
import Navbar from '@/components/Navbar'
import PlaceOrder from '@/components/PlaceOrder'
import PredictionContracts from '@/components/PredictionContracts'
import React from 'react'

const page = () => {
  return (
    <div className='relative w-screen  min-h-screen'>
      <Navbar/>
      <div className='mt-16 ml-12 flex flex-row'>
        <HeroGraph/>
        <PlaceOrder/>
      </div>
      <PredictionContracts/>
    </div>
  )
}

export default page
