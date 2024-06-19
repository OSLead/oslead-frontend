"use client";
import React from 'react'
import ScrollToTop from 'react-scroll-up';
import { BsFillRocketFill } from 'react-icons/bs'
const ScrollToTopButton = () => {
  return (
    <div className='relative z-[300]'>
      <ScrollToTop showUnder={300}>
        <p className="font-bold text-white cursor-pointer text-3xl hover:border-2 hover:border-white hover:rounded-full p-3">
            <BsFillRocketFill/>
            </p>
        {/* <BsFillRocketFill className='text-2xl text-white' /> */}
      </ScrollToTop>
    </div>
  )
}

export default ScrollToTopButton