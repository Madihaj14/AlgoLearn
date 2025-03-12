import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { User, Mail, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const UserProfile: React.FC = () => {
  const { theme } = useTheme();
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="card card-glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Profile Settings</h1>
                <button
                  onClick={handleSignOut}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg
                            ${theme === 'dark'
                              ? 'bg-dark-primary/20 text-dark-primary hover:bg-dark-primary/30'
                              : 'bg-light-primary/20 text-light-primary hover:bg-light-primary/30'}`}
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-opacity-50
                                ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}">
                    <Mail size={20} className="opacity-50" />
                    <span>{user?.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Member Since</label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-opacity-50
                                ${theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}">
                    <User size={20} className="opacity-50" />
                    <span>
                      {new Date(user?.created_at || '').toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;