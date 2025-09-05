import React from 'react'
import Heading from '../components/Contact/Heading'
import Cards from '../components/Contact/Cards'
import ContactFooter from '../components/Contact/ContactFooter'
import Form from '../components/Contact/Form'

const Contact = () => {
  return (
    <div className="flex flex-col gap-6 md:gap-12 lg:gap-16 py-8 md:py-12 lg:py-20 bg-[#F2EFEE]">
      <Heading />
      <Cards />
      <Form />
      <ContactFooter />
    </div>
  )
}

export default Contact
