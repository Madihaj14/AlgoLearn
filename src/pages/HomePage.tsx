import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Database, Code, BookOpen, BrainCircuit, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  
  const features = [
    {
      icon: <Database size={24} />,
      title: 'Data Structures',
      description: 'Visualize arrays, linked lists, trees, graphs, and more with interactive animations.',
      link: '/data-structures'
    },
    {
      icon: <Code size={24} />,
      title: 'Algorithms',
      description: 'Learn sorting, searching, and graph algorithms through step-by-step visualizations.',
      link: '/algorithms'
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Documentation',
      description: 'Comprehensive guides and explanations for each data structure and algorithm.',
      link: '/docs'
    },
    {
      icon: <BrainCircuit size={24} />,
      title: 'Practice',
      description: 'Solve coding challenges and interview questions related to DSA concepts.',
      link: '/practice'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.h1 
              className={`text-4xl md:text-6xl font-bold mb-6 
                        ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Explore the 
              <span className={theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}> Universe </span> 
              of DSA
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-10 max-w-3xl opacity-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Visualize data structures and algorithms in an interactive cosmic environment. 
              Learn, practice, and master DSA concepts with AlgoLearn.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/data-structures" className="btn btn-primary">
                Start Exploring
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            className={`text-3xl font-bold text-center mb-16
                      ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Cosmic Features
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="card card-glass group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`p-4 rounded-full inline-block mb-4
                              ${theme === 'dark' 
                                ? 'bg-dark-primary/20 text-dark-primary' 
                                : 'bg-light-primary/20 text-light-primary'}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="mb-4 opacity-80">{feature.description}</p>
                <Link 
                  to={feature.link} 
                  className={`flex items-center text-sm font-medium
                            ${theme === 'dark' 
                              ? 'text-dark-primary' 
                              : 'text-light-primary'}`}
                >
                  Explore <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Showcase Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl font-bold mb-6
                            ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                Visualize Your Learning Journey
              </h2>
              <p className="mb-6 opacity-80">
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
                  <li key={index} className="flex items-start">
                    <span className={`mr-2 text-xl
                                    ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}>
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/algorithms" className="btn btn-primary">
                Try Visualizer
              </Link>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card card-glass overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Algorithm Visualization" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className={`card card-glass text-center py-16 px-4
                      ${theme === 'dark' 
                        ? 'border-dark-primary/30' 
                        : 'border-light-primary/30'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-6
                          ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
              Ready to Master DSA?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-80">
              Start your journey through the cosmos of data structures and algorithms today.
            </p>
            <Link to="/data-structures" className="btn btn-primary">
              Begin Your Adventure
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;