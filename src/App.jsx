import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';

import Home from './pages/home/Home';
import Server from './pages/server/Server';
import About from './pages/about/About';
import Join from './pages/join/Join';
import NotFound from './pages/notfound/NotFound';

import Header from './widgets/header/Header';
import Footer from './widgets/footer/Footer';

export default function App() {

  const [path, setPath] = useState('/');
  const [mobile, setMobile] = useState(false)
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Header pathname={path} input={mobile} />
      <Routes future={{ v7_startTransition: true }}>
        <Route path="/" element={<Home input={mobile} />} />
        <Route path="/server" element={<Server />} />
        <Route path="/about" element={<About />} />
        <Route path="/Join" element={<Join />} />
        <Route path="/notFound" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/notFound" replace />} />
      </Routes>
      <Footer />
    </>
  );
}