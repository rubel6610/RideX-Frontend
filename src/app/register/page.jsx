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
      <form className='shadow-lg p-8 rounded-xl space-y-4'>



        {/* first & last name field  */}
        <div className='space-y-4 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4'>
          <Input></Input>
          <Input></Input>
        </div>
        {/* email field  */}
        <Input></Input>
        {/* phone number field  */}
        <Input></Input>
        {/* password field  */}
        <Input></Input>
        {/* confirm password field  */}
        <Input></Input>
        

      </form>
    </div>
  )
}

export default RegisterPage