import { useEffect } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import PostJobModal from './components/PostJobModal';
import Toasts from './components/Toasts';
import { HomePage, EngineersPage, JobsPage, GigsPage } from './pages/Pages';
import MessagesPage from './pages/MessagesPage';
import Dashboard from './pages/Dashboard';

// Auth gate - show login wall if not logged in on first load
function AuthGate() {
  const { openModal, modal } = useApp();
  useEffect(() => {
    // Show login modal immediately on first visit (if not already logged in)
    const seen = sessionStorage.getItem('eh_seen');
    if (!seen) {
      sessionStorage.setItem('eh_seen', '1');
      openModal('auth');
    }
  }, []);
  return null;
}

export default function App() {
  const { user, page, modal } = useApp();

  return (
    <div className="app-bg" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Auth gate on first load */}
      {!user && <AuthGate />}

      {/* Modals */}
      {modal === 'auth' && <AuthModal />}
      {modal === 'postjob' && <PostJobModal />}

      <Navbar />

      <main style={{ flex: 1 }}>
        {page === 'home' && <HomePage />}
        {page === 'engineers' && <EngineersPage />}
        {page === 'jobs' && <JobsPage />}
        {page === 'gigs' && <GigsPage />}
        {page === 'messages' && <MessagesPage />}
        {page === 'dashboard' && <Dashboard />}
      </main>

      {page === 'home' && <Footer />}

      <Toasts />
    </div>
  );
}
