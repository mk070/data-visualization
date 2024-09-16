import React from 'react'

const Nav = () => {
  return (
    <div>
        <nav className="  p-4 px-16 bg-white ">
            <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-primary">AI Data Analytics</div>
            <ul className="flex space-x-4">
                <li className="hover:text-blue-600"><a href="#upload">Home</a></li>
                <li className="hover:text-blue-600"><a href="#query">About</a></li>
                <li className="hover:text-blue-600"><a href="#query">Contact</a></li>
                <li className="hover:text-blue-600"><a href="#results">Help</a></li>
            </ul>
            </div>
        </nav>
    </div>
  )
}

export default Nav