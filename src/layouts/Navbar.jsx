import React from 'react'
import { NavLink, Outlet, ScrollRestoration } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className="root-layout">
      <ScrollRestoration />
      <header>
        <nav className='flex py-3 px-12 bg-slate-400 justify-between items-center'>
          <div>
            <NavLink to="/" className="text-3xl">Blog Post</NavLink>
          </div>
          <div>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/blog/create" className="mx-2">Create Blog</NavLink>
            <NavLink to="/mypost" className="mx-2">My Post</NavLink>
          </div>
          {/* <NavLink to="about">About</NavLink>
          <NavLink to="help">Help</NavLink>
          <NavLink to="careers">Careers</NavLink> */}
        </nav>
      </header>
      <main className='px-12'>
        <Outlet />
      </main>
    </div>
  )
}

export default Navbar