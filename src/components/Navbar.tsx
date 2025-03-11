import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Menu, X, Rocket, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Data Structures', path: '/data-structures' },
    { name: 'Algorithms', path: '/algorithms' },
    { name: 'Documentation', path: '/documentation' },
    { name: 'Practice', path: '/practice' },
    { name: 'Progress', path: '/progress' },
    { name: 'About', path: '/about' }
  ];

  const isActive = (path: string) => location.pathname === path;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors duration-300 hover:text-light-primary dark:hover:text-dark-primary
                          ${isActive(link.path) 
                            ? 'text-light-primary dark:text-dark-primary font-medium' 
                            : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle, Profile, and Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-colors duration-300
                       hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-dark-primary" />
              ) : (
                <Moon size={20} className="text-light-primary" />
              )}
            </button>

            {user ? (
              /* Profile Menu */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 rounded-full transition-colors duration-300
                           hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
                  aria-label="Profile menu"
                >
                  <User 
                    size={20} 
                    className={theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'} 
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg
                                ${theme === 'dark'
                                  ? 'bg-dark-surface border border-dark-primary/30'
                                  : 'bg-light-surface border border-light-primary/30'}`}
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm opacity-70 border-b border-current">
                          {user.email}
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
                        >
                          Profile Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                        >
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg
                          ${theme === 'dark'
                            ? 'bg-dark-primary text-dark-background'
                            : 'bg-light-primary text-white'}`}
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full transition-colors duration-300
                       hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
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
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 py-4 space-y-2"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2 rounded-lg transition-colors duration-300
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
              ))}
              
              {!user && (
                <Link
                  to="/auth/signup"
                  className={`block px-4 py-2 rounded-lg transition-colors duration-300
                            ${theme === 'dark'
                              ? 'bg-dark-primary/20 text-dark-primary hover:bg-dark-primary/30'
                              : 'bg-light-primary/20 text-light-primary hover:bg-light-primary/30'}`}
                >
                  Create Account
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;