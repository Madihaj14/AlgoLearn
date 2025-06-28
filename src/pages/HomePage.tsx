import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Database, Code, BookOpen, BrainCircuit, ArrowRight, Play, Star, Users, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  
  const features = [
    {
      icon: <Database size={24} />,
      title: 'Data Structures',
      description: 'Visualize arrays, linked lists, trees, graphs, and more with interactive animations.',
      link: '/data-structures',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: <Code size={24} />,
      title: 'Algorithms',
      description: 'Learn sorting, searching, and graph algorithms through step-by-step visualizations.',
      link: '/algorithms',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Documentation',
      description: 'Comprehensive guides and explanations for each data structure and algorithm.',
      link: '/documentation',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: <BrainCircuit size={24} />,
      title: 'Practice',
      description: 'Solve coding challenges and interview questions related to DSA concepts.',
      link: '/practice',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { icon: <Star size={20} />, value: '50+', label: 'Topics Covered' },
    { icon: <Play size={20} />, value: '25+', label: 'Interactive Visualizations' },
    { icon: <Users size={20} />, value: '1000+', label: 'Practice Problems' },
    { icon: <Zap size={20} />, value: '100%', label: 'Free to Use' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.h1 
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 
                        ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Explore the 
              <span className={`block sm:inline ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}> Universe </span> 
              of DSA
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 max-w-3xl opacity-80 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Visualize data structures and algorithms in an interactive cosmic environment. 
              Learn, practice, and master DSA concepts with AlgoLearn.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link 
                to="/data-structures" 
                className="btn btn-primary w-full sm:w-auto text-center py-3 px-8"
              >
                Start Exploring
              </Link>
              <Link 
                to="/about" 
                className="btn btn-secondary w-full sm:w-auto text-center py-3 px-8"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="card card-glass text-center p-4 sm:p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`inline-flex p-3 rounded-full mb-3
                              ${theme === 'dark' 
                                ? 'bg-dark-primary/20 text-dark-primary' 
                                : 'bg-light-primary/20 text-light-primary'}`}>
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            className={`text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16
                      ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Cosmic Features
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="card card-glass group relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative p-6">
                  <div className={`p-4 rounded-full inline-block mb-4 transition-all duration-300
                                ${theme === 'dark' 
                                  ? 'bg-dark-primary/20 text-dark-primary group-hover:bg-dark-primary group-hover:text-dark-background' 
                                  : 'bg-light-primary/20 text-light-primary group-hover:bg-light-primary group-hover:text-white'}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="mb-4 opacity-80 text-sm sm:text-base">{feature.description}</p>
                  <Link 
                    to={feature.link} 
                    className={`flex items-center text-sm font-medium transition-all duration-300
                              ${theme === 'dark' 
                                ? 'text-dark-primary group-hover:text-dark-primary' 
                                : 'text-light-primary group-hover:text-light-primary'}`}
                  >
                    Explore <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Showcase Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <motion.div 
              className="lg:w-1/2 order-2 lg:order-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-2xl sm:text-3xl font-bold mb-6
                            ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                Visualize Your Learning Journey
              </h2>
              <p className="mb-6 opacity-80 text-sm sm:text-base">
                Our interactive visualizations help you understand complex DSA concepts by breaking them down into simple, 
                step-by-step processes. Watch algorithms in action and see how data structures work behind the scenes.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Interactive step-by-step visualizations',
                  'Adjustable animation speed',
                  'Code execution highlighting',
                  'Custom input options'
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className={`mr-3 text-xl flex-shrink-0
                                    ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}>
                      •
                    </span>
                    <span className="text-sm sm:text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Link to="/algorithms" className="btn btn-primary inline-block">
                Try Visualizer
              </Link>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 order-1 lg:order-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="card card-glass overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Algorithm Visualization" 
                  className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className={`card card-glass text-center py-12 sm:py-16 px-4 sm:px-8
                      ${theme === 'dark' 
                        ? 'border-dark-primary/30' 
                        : 'border-light-primary/30'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6
                          ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
              Ready to Master DSA?
            </h2>
            <p className="text-lg sm:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto opacity-80">
              Start your journey through the cosmos of data structures and algorithms today.
            </p>
            <Link 
              to="/data-structures" 
              className="btn btn-primary inline-block text-lg px-8 py-3"
            >
              Begin Your Adventure
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;