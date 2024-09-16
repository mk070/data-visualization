import React from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // Import your custom CSS for modern styling
import Home from './pages/home';
import Nav from './layout/Nav';

const App = () => {
 

  return (
    <div className="min-h-screen  font-space-grotesk">
      {/* Navbar */}
      <Nav />
      < Home />
      <ToastContainer />
    </div>
  );
};

export default App;
