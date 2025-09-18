import { Input } from '@/components/ui/input'
import React from 'react'

function RegisterPage() {



  return (
    <div className='mt-24 container mx-auto mb-16'>

      {/* title and logo  */}
      <div className='text-center space-y-3 my-10'>
        <div>
          <img src="" alt="" />
        </div>
        <h2 className='text-4xl text-primary font-bold'>Join RedeX</h2>
        <p className='text-muted-foreground'>Create your account to get started</p>
      </div>

      {/* register page from  */}
      <form className='shadow-lg p-8 rounded-xl space-y-3 max-w-xl mx-auto border border-muted-foreground/20'>
        <p className='text-muted-foreground text-center'>Sign up as a driver to earn money by providing rides</p>

        {/* first & last name field  */}
        <div className='space-y-2 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4'>
          <div>
            <label>First Name</label>
            <Input placeholder="Type your first name"></Input>
          </div>
          <div>
            <label>Last Name</label>
            <Input placeholder="Type your last name"></Input>
          </div>
        </div>

        {/* email field  */}
        <label>Email</label>
        <Input placeholder="your@email.com"></Input>

        {/* phone number field  */}
        <label>Phone Number</label>
        <Input placeholder="01648730***"></Input>

        {/* password field  */}
        <label>Password</label>
        <Input placeholder="Create a strong password"></Input>

        {/* confirm password field  */}
        <label>Confirm Password</label>
        <Input placeholder="Confirm your strong password"></Input>


      </form>
    </div>
  )
}

export default RegisterPage