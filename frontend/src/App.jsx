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

  // Hide Navbar and Footer if the route starts with /admin
  const hideLayout = location.pathname.startsWith('/admin');

  return (
    <>
      {!hideLayout && <Navbar />}
      <div className="min-h-[80vh]">
        <Routes />
      </div>
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;

