import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

function RegisterPage() {



  return (
    <div className='mt-24 container mx-auto mb-16'>

      {/* title and logo  */}
      <div className='text-center space-y-3 my-10'>
        <h2 className='text-4xl text-primary font-bold'>Join RedeX</h2>
        <p className='text-muted-foreground'>Create your account to get started</p>
      </div>

      {/* register page from  */}
      <form className='shadow-lg p-8 rounded-xl space-y-3 max-w-xl mx-auto border border-muted-foreground/10'>
        <p className='text-muted-foreground text-center'>Sign up as a driver to earn money by providing rides</p>

        {/* first & last name field  */}
        <div className='space-y-2 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4'>
          <div>
            <label>First Name</label>
            <Input type="text" placeholder="Type your first name"></Input>
          </div>
          <div>
            <label>Last Name</label>
            <Input type="text" placeholder="Type your last name"></Input>
          </div>
        </div>

        {/* email field  */}
        <label>Email</label>
        <Input type="email" placeholder="your@email.com"></Input>

        {/* phone number field  */}
        <label>Phone Number</label>
        <Input type="number" placeholder="01648730***"></Input>

        {/* password field  */}
        <label>Password</label>
        <Input type="password" placeholder="Create a strong password"></Input>

        {/* confirm password field  */}
        <label>Confirm Password</label>
        <Input type="password" placeholder="Confirm your strong password"></Input>

        <input type="checkbox" /> <small className='text-muted-foreground'>
          I agree to the <span className='text-primary'>Terms of Service</span> and <span className='text-primary'>Privacy Policy</span>
        </small>
        <br />
        <Button variant="primaryBtn" className="w-full">Create Account</Button>
      </form>
    </div>
  )
}

export default RegisterPage