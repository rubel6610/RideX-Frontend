import { Input } from '@/components/ui/input'
import React from 'react'

function RegisterPage() {



  return (
    <div className='mt-20 container mx-auto'>

      {/* title and logo  */}
      <div>
        <h2>Join RedeX</h2>
        <p>Create your account to get started</p>
      </div>

      {/* register page from  */}
      <form className='shadow-lg p-8 rounded-xl space-y-4 max-w-2xl mx-auto'>
        {/* first & last name field  */}
        <div className='space-y-2 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4'>
          <div>
            <label>First Name</label>
            <Input></Input>
          </div>
          <div>
            <label>Last name</label>
            <Input></Input>
          </div>
        </div>
        {/* email field  */}
        <label>Email</label>
        <Input></Input>
        {/* phone number field  */}
        <label>Phone Number</label>
        <Input></Input>
        {/* password field  */}
        <label>Password</label>
        <Input></Input>
        {/* confirm password field  */}
        <label>Confirm Password</label>
        <Input></Input>


      </form>
    </div>
  )
}

export default RegisterPage