import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const SignupPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { signUp, error: authError, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      navigate('/');
    } catch (err) {
      console.error('Error creating account:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`text-center text-3xl font-bold
                        ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm opacity-80">
            Or{' '}
            <Link
              to="/auth/login"
              className={theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}
            >
              sign in to your account
            </Link>
          </p>
        </motion.div>

        <motion.form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {authError && (
            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg">
              <AlertCircle size={20} />
              <span>{authError}</span>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-50">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border focus:outline-none focus:z-10 sm:text-sm
                            ${theme === 'dark'
                              ? 'bg-dark-surface border-dark-primary/30 text-dark-text focus:border-dark-primary'
                              : 'bg-light-surface border-light-primary/30 text-light-text focus:border-light-primary'}`}
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-50">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border focus:outline-none focus:z-10 sm:text-sm
                            ${theme === 'dark'
                              ? 'bg-dark-surface border-dark-primary/30 text-dark-text focus:border-dark-primary'
                              : 'bg-light-surface border-light-primary/30 text-light-text focus:border-light-primary'}`}
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-50">
                  <Lock size={20} />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border focus:outline-none focus:z-10 sm:text-sm
                            ${theme === 'dark'
                              ? 'bg-dark-surface border-dark-primary/30 text-dark-text focus:border-dark-primary'
                              : 'bg-light-surface border-light-primary/30 text-light-text focus:border-light-primary'}`}
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || password !== confirmPassword}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg focus:outline-none
                        ${theme === 'dark'
                          ? 'bg-dark-primary text-dark-background hover:bg-dark-primary/90'
                          : 'bg-light-primary text-white hover:bg-light-primary/90'}
                        ${(loading || password !== confirmPassword) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus size={20} className={loading ? 'animate-spin' : ''} />
              </span>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default SignupPage;