import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`py-8 transition-colors duration-300
                      ${theme === 'dark' 
                        ? 'bg-dark-background/90 text-dark-text border-t border-dark-primary/30' 
                        : 'bg-light-background/90 text-light-text border-t border-light-primary/30'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 
                          ${theme === 'dark' ? 'text-dark-heading' : 'text-light-primary'}`}>
              AlgoLearn
            </h3>
            <p className="mb-4 opacity-80">
              An interactive platform for learning data structures and algorithms through visual representation.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/Madihaj14" target="_blank" rel="noopener noreferrer" className={`hover:${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'} transition-colors duration-300`}>
                <Github size={20} />
              </a>
              
              <a href="https://www.linkedin.com/in/madiha-khan14/" target="_blank" rel="noopener noreferrer" className={`hover:${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'} transition-colors duration-300`}>
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 
                          ${theme === 'dark' ? 'text-dark-heading' : 'text-light-primary'}`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li><a href="/data-structures" className="hover:underline">Data Structures</a></li>
              <li><a href="/algorithms" className="hover:underline">Algorithms</a></li>
              <li><a href="/practice" className="hover:underline">Practice Problems</a></li>
              <li><a href="/documentation" className="hover:underline">Documentation</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 
                          ${theme === 'dark' ? 'text-dark-heading' : 'text-light-primary'}`}>
              Resources
            </h3>
            <ul className="space-y-2">
              <li><a href="https://leetcode.com/studyplan/top-interview-150/" target="_blank" rel="noopener noreferrer" className="hover:underline">LeetCode</a></li>
              <li><a href="https://leetcode.com/studyplan/top-interview-150/" target="_blank" rel="noopener noreferrer" className="hover:underline">GeeksforGeeks</a></li>
              <li><a href="https://www.hackerrank.com/domains/data-structures" target="_blank" rel="noopener noreferrer" className="hover:underline">HackerRank</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700/30 text-center">
          <p className="flex items-center justify-center">
            Made with <Heart size={16} className="mx-1 text-red-500" /> by Madiha Khan
          </p>
          <p className="mt-2 text-sm opacity-70">
            © {new Date().getFullYear()} AlgoLearn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;