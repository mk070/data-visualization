import React from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // Import your custom CSS for modern styling
import Home from './pages/Home';
import Nav from './layout/Nav';

const App = () => {
 

  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-100 via-gray-100 to-gray-200 relative overflow-hidden  font-space-grotesk">
      {/* Decorative Blob for an Abstract Effect */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 opacity-30 rounded-full filter blur-3xl z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-l from-blue-400 to-green-500 opacity-30 rounded-full filter blur-3xl z-0"></div>

      {/* Navbar */}
      <Nav />
      < Home />
      <ToastContainer />
    </div>
  );
};

export default App;
