import { BrowserRouter, useLocation } from 'react-router-dom';
import Routes from './routes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/authContext';
import React from 'react';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');
  const isContact = location.pathname.startsWith('/contact');
  const isCareer = location.pathname.startsWith('/career');

  const showNavbar = !isAdmin;
  const showFooter = !isAdmin && !isContact && !isCareer;

  return (
    <>
      {showNavbar && <Navbar />}
      <div className="min-h-[80vh]">
        <Routes />
      </div>
      {showFooter && <Footer />}
    </>
  );
}

export default App;
