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
import PracticePage from './pages/PracticePage';
import BacktrackingPage from './pages/BacktrackingPage';
import SortingPage from './pages/SortingPage';
import SearchingPage from './pages/SearchingPage';
import GraphPage from './pages/GraphPage';
import DynamicProgrammingPage from './pages/DynamicProgrammingPage';
import AlgorithmVisualizerPage from './pages/visualization/AlgorithmVisualizerPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <CosmicBackground />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/data-structures" element={<DataStructuresPage />} />
          <Route path="/algorithms" element={<AlgorithmsPage />} />
          <Route path="/algorithms/backtracking" element={<BacktrackingPage />} />
          <Route path="/algorithms/sorting" element={<SortingPage />} />
          <Route path="/algorithms/searching" element={<SearchingPage />} />
          <Route path="/algorithms/graph" element={<GraphPage />} />
          <Route path="/algorithms/dynamic-programming" element={<DynamicProgrammingPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/visualization/:algorithmId" element={<AlgorithmVisualizerPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;