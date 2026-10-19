import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { CookieBanner } from './components/CookieBanner';

// Pages
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Portfolio } from './pages/Portfolio';
import { CaseStudyDetail } from './pages/CaseStudyDetail';
import { About } from './pages/About';
import { Team } from './pages/Team';
import { Process } from './pages/Process';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ClientPortal } from './pages/ClientPortal';
import { AdminPortal } from './pages/AdminPortal';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Cookies } from './pages/Cookies';
import { Refunds } from './pages/Refunds';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-vjs-main text-vjs-primary antialiased selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
              {/* Accessible Skip Link */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00E5FF] focus:text-[#050505] focus:font-bold focus:rounded-lg focus:shadow-xl"
              >
                Skip to main content
              </a>

              <Navbar />

              <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:slug" element={<ServiceDetail />} />
                  <Route path="/work" element={<Portfolio />} />
                  <Route path="/work/:slug" element={<CaseStudyDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/process" element={<Process />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Dashboards */}
                  <Route path="/portal" element={<ClientPortal />} />
                  <Route path="/admin" element={<AdminPortal />} />

                  {/* Legal and Compliance */}
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/refunds" element={<Refunds />} />

                  {/* 404 handler */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <CookieBanner />
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
