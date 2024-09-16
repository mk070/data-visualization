import React from 'react'
import logo from '../assets/logo.png'

const Nav = () => {
  return (
    <>
        <nav className=" flex h-16 sticky p-4 px-16 rounded-[60px] bg-white mt-4 mx-8 ">
            <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold flex text-primary">
              <img src={logo} width="100px" alt="" srcset="" />
            </div>
            <ul className="flex space-x-4 font-bold">
                <li className="hover:text-blue-600"><a href="#upload">Home</a></li>
                <li className="hover:text-blue-600"><a href="#query">About</a></li>
                <li className="hover:text-blue-600"><a href="#query">Contact</a></li>
                <li className="hover:text-blue-600"><a href="#results">Help</a></li>
            </ul>
            </div>
        </nav>
    </>
  )
}

export default Nav