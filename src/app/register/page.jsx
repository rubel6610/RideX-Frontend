import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CarLogo from '../../Assets/car-icon.png'
import GoogleIcon from '../../Assets/google-icon.png'
import FacebookIcon from '../../Assets/facebook-icon.png'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

function RegisterPage() {

  return (
    <div className='mt-28 container mx-auto mb-16'>

      {/* title and logo  */}
      <div className='flex flex-col items-center space-y-2 my-6'>
        <Image
          src={CarLogo}
          alt="car-logo"
          width={60}
          height={60}
          className=''
        />
        <h2 className='text-3xl text-[var(--primary)] font-bold'>Join RideX</h2>
        <p className='text-black dark:text-white text-lg'>Create your account to get started</p>
      </div>

      {/* register page from  */}
      <form className='shadow-lg p-8 rounded-xl space-y-4 max-w-xl mx-auto border border-[#6CC832]/30'>
        <p className='text-black/60 dark:text-white/60 text-center mb-8 text-lg'>Sign up as a rider to earn money by providing rides</p>

        {/* first & last name field  */}
        <div className='space-y-2 md:space-y-0 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4'>
          <div>
            <label>First Name</label>
            <Input
              type="text"
              placeholder="Type your first name"
              className='border border-[#6CC832]/20'></Input>
          </div>
          <div>
            <label>Last Name</label>
            <Input type="text" placeholder="Type your last name"
              className='border border-[#6CC832]/20'></Input>
          </div>
        </div>

        {/* parents name field  */}
        <div className='space-y-2 md:space-y-0 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4'>
          <div>
            <label>Father's Name</label>
            <Input
              type="text"
              placeholder="Type your father's name"
              className='border border-[#6CC832]/20'></Input>
          </div>
          <div>
            <label>Mother's Name</label>
            <Input type="text" placeholder="Type your mother's name"
              className='border border-[#6CC832]/20'></Input>
          </div>
        </div>

        {/* Date of birth & NID No  */}
        <div className='space-y-2 md:space-y-0 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4'>
          <div>
            <label>Date Of Birth</label>
            <Input
              type="calender"
              placeholder="Date/Month/Year"
              className='border border-[#6CC832]/20'></Input>
          </div>
          <div>
            <label>NID Number</label>
            <Input type="number" placeholder="NID NO"
              className='border border-[#6CC832]/20'></Input>
          </div>
        </div>

        {/* District & Thana  */}
        <div className='space-y-2 md:space-y-0 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4'>
          <div>
            <label>District</label>
            <Input
              type="text"
              placeholder="Dhaka"
              className='border border-[#6CC832]/20'></Input>
          </div>
          <div>
            <label>Thana</label>
            <Input type="text" placeholder="Kotoyali"
              className='border border-[#6CC832]/20'></Input>
          </div>
        </div>

        {/* Phone number & Blood group  */}
        <div className='space-y-2 md:space-y-0 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4'>
          <div>
            <label>Phone Number</label>
            <Input type="number" placeholder="01648730***"
              className='border border-[#6CC832]/20'></Input>
          </div>
          <div>
            <label>Blood Group</label>
            <Input type="text" placeholder="O+"
              className='border border-[#6CC832]/20'></Input>
          </div>
        </div>

        {/* email field  */}
        <label>Email</label>
        <Input type="email" placeholder="your@email.com"
          className='border border-[#6CC832]/20'></Input>

        {/* password field  */}
        <label>Password</label>
        <Input type="password" placeholder="Create a strong password"
          className='border border-[#6CC832]/20'></Input>

        {/* confirm password field  */}
        <label>Confirm Password</label>
        <Input type="password" placeholder="Confirm your strong password"
          className='border border-[#6CC832]/20'></Input>

        <input type="checkbox" /> <small className='text-muted-foreground'>
          I agree to the <span className='text-primary'>Terms of Service</span> and <span className='text-primary'>Privacy Policy</span>
        </small>
        {/* Create account button  */}
        <Button className="w-full bg-[var(--primary)]/80 hover:bg-[var(--primary)] text-white dark:text-black">Create Account</Button>

        {/* google register button  */}
        <Button variant="outline" className="w-full dark:bg-white bg-gray-800 hover:bg-gray-900 text-white dark:text-black">
          <Image
            src={GoogleIcon}
            alt="google-icon"
            width={20}
            height={20}
            className=''
          />Continue with Google
        </Button>

        {/* facebook register button  */}
        <Button variant="outline" className="w-full dark:bg-white bg-gray-800 hover:bg-gray-900 text-white dark:text-black">
          <Image
            src={FacebookIcon}
            alt="google-icon"
            width={40}
            height={40}
            className=''
          />Continue with Facebook
        </Button>

        {/* toggle sign in page  */}
        <p className='text-center text-black/60 dark:text-white/60'>Already have an account? <span className='text-[var(--primary)] underline cursor-pointer'><Link href='/signIn'>Sign In</Link></span></p>
      </form>
    </div>
  )
}

export default RegisterPage