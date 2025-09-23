import React from 'react'
import Heading from '../components/Contact/Heading'
import Cards from '../components/Contact/Cards'
import Form from '../components/Contact/Form'

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col gap-6 md:gap-12 lg:gap-16 py-8 md:py-12 lg:py-20 bg-[#F2EFEE]">
        <Heading />
        <Cards />
        <Form />
      </div>
    </div>
  )
}

export default Contact