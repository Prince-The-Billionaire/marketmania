import HeroGraph from '@/components/HeroGraph'
import Navbar from '@/components/Navbar'
import PlaceOrder from '@/components/PlaceOrder'
import PredictionContracts from '@/components/PredictionContracts'
import React from 'react'

const page = () => {
  return (
    <div className='relative min-h-screen bg-slate-50'>
      <Navbar />
      <main className='mx-auto mt-16 flex max-w-[1400px] flex-col gap-10 px-4 pb-16 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-8 lg:flex-row lg:items-start'>
          <HeroGraph />
          <PlaceOrder />
        </div>
        <PredictionContracts />
      </main>
    </div>
  )
}

export default page
