import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import About from "./pages/About.jsx";
import BackendLoadingScreen from "./components/BackendLoadingScreen.jsx";
import useBackendHealth from "./hooks/useBackendHealth.js";

const READY_HOLD_MS = 600; // brief "Scanner Ready" hold before revealing the app
const EXIT_TRANSITION_MS = 500; // matches BackendLoadingScreen's fade/scale duration

export default function App() {
  const location = useLocation();
  const { status, message, retry } = useBackendHealth();
  const [showOverlay, setShowOverlay] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (status !== "ready") return;

    const startExit = setTimeout(() => setIsLeaving(true), READY_HOLD_MS);
    const unmountOverlay = setTimeout(
      () => setShowOverlay(false),
      READY_HOLD_MS + EXIT_TRANSITION_MS
    );

    return () => {
      clearTimeout(startExit);
      clearTimeout(unmountOverlay);
    };
  }, [status]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* key={pathname} re-mounts on route change, which re-triggers the
            page-fade entrance animation - a subtle, single-shot transition
            rather than a persistent animated router wrapper. */}
        <div key={location.pathname} className="animate-page-fade">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </main>
      <Footer />

      {/* The real app above is always mounted - the overlay just sits on
          top and fades away, so nothing has to remount or lose state once
          the backend is confirmed ready. */}
      {showOverlay && (
        <BackendLoadingScreen
          status={status}
          message={message}
          onRetry={retry}
          isLeaving={isLeaving}
        />
      )}
    </div>
  );
}
