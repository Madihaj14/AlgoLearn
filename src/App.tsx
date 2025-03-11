import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CosmicBackground from './components/CosmicBackground';
import HomePage from './pages/HomePage';
import DataStructuresPage from './pages/DataStructuresPage';
import AlgorithmsPage from './pages/AlgorithmsPage';
import DocumentationPage from './pages/DocumentationPage';
import AboutPage from './pages/AboutPage';
import ProgressPage from './pages/ProgressPage';
import PracticePage from './pages/PracticePage';
import AlgorithmVisualizerPage from './pages/visualization/AlgorithmVisualizerPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import UserProfile from './pages/auth/UserProfile';
import AuthGuard from './components/auth/AuthGuard';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <CosmicBackground />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route element={<AuthGuard />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/data-structures" element={<DataStructuresPage />} />
            <Route path="/algorithms" element={<AlgorithmsPage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/visualization/:algorithmId" element={<AlgorithmVisualizerPage />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;