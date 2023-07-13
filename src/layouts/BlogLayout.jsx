import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const BlogLayout = () => {
  return (
    <div className='h-screen'>
        <div className='flex justify-center content-center'>
        <Outlet />
        </div>
    </div>
  )
}

export default BlogLayout