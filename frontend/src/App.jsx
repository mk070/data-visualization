import React from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // Import your custom CSS for modern styling
import Home from './pages/Home';
import Nav from './layout/Nav';
import icon1 from './assets/research.png'
import icon2 from './assets/research-pc.png'
import icon3 from './assets/statistics.png'
import icon4 from './assets/data-structure.png'
import icon5 from './assets/business-report.png'

const App = () => {
 

  return (
    <div className="min-h-screen bg-gradient-to-br  from-slate-50 via-gray-50 to-gray-100 relative overflow-hidden font-space-grotesk">
      {/* Decorative Blob for an Abstract Effect */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 opacity-30 rounded-full filter blur-3xl z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-l from-blue-400 to-green-500 opacity-30 rounded-full filter blur-3xl z-0"></div>

      {/* Floating Icons */}
      <div className="absolute top-36 left-10 w-16 h-16 bg-white  p-4 rounded-full shadow-lg animate-float animation-delay-2000">
        <img src={icon1} alt="Bar Chart Icon" />
      </div>
      <div className="absolute bottom-28 right-24 w-16 h-16 p-4 bg-white rounded-full shadow-lg animate-float-slow">
        <img src={icon2} alt="Pie Chart Icon" />
      </div>
      <div className="absolute top-1/4 right-20 w-16 h-16 p-4 bg-white rounded-full shadow-lg animate-float animation-delay-4000">
        <img src={icon3} alt="AI Brain Icon" />
      </div>
      <div className="absolute bottom-96 left-48 w-16 h-16 p-4 bg-white rounded-full shadow-lg animate-float animation-delay-4000">
        <img src={icon4} alt="AI Brain Icon" />
      </div>
      <div className="absolute bottom-32 left-20 w-16 h-16 p-4 bg-white rounded-full shadow-lg animate-float animation-delay-4000">
        <img src={icon5} alt="AI Brain Icon" />
      </div>

      {/* Navbar */}
      <Nav />

      {/* Home Section */}
      <Home />

      <ToastContainer />
    </div>

  );
};

export default App;
