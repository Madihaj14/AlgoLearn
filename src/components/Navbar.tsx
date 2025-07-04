import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Menu, X, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Data Structures', path: '/data-structures' },
    { name: 'Algorithms', path: '/algorithms' },
    { name: 'Documentation', path: '/documentation' },
    { name: 'Practice', path: '/practice' },
    { name: 'About', path: '/about' }
  ];

  const isActive = (path: string) => location.pathname === path;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300
                    ${theme === 'dark' 
                      ? 'bg-dark-background/90 text-dark-text border-b border-dark-primary/30' 
                      : 'bg-light-background/80 text-light-text border-b border-light-primary/30'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Rocket 
                size={28} 
                className={theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'} 
              />
            </motion.div>
            <span className="text-xl font-bold">AlgoLearn</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-all duration-300 hover:text-light-primary dark:hover:text-dark-primary
                          px-3 py-2 rounded-lg hover:bg-light-primary/10 dark:hover:bg-dark-primary/10
                          ${isActive(link.path) 
                            ? 'text-light-primary dark:text-dark-primary font-medium bg-light-primary/10 dark:bg-dark-primary/10' 
                            : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle and Menu Button */}
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={toggleTheme}
              className="p-3 rounded-full transition-colors duration-300
                       hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
              aria-label="Toggle theme"
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? (
                  <Sun size={20} className="text-dark-primary" />
                ) : (
                  <Moon size={20} className="text-light-primary" />
                )}
              </motion.div>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-3 rounded-full transition-colors duration-300
                       hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? (
                  <X size={20} className={theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'} />
                ) : (
                  <Menu size={20} className={theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'} />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 py-4 space-y-2 border-t border-gray-200 dark:border-gray-700"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg transition-all duration-300 text-lg
                              ${isActive(link.path)
                                ? theme === 'dark'
                                  ? 'bg-dark-primary text-dark-background'
                                  : 'bg-light-primary text-white'
                                : theme === 'dark'
                                  ? 'hover:bg-dark-primary/20'
                                  : 'hover:bg-light-primary/20'}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;