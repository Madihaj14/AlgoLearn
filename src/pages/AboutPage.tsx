import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { BookOpen, Code, Brain, Rocket, Award, Github, Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const { theme } = useTheme();
  
  const features = [
    {
      icon: <BookOpen size={24} />,
      title: 'Interactive Learning',
      description: 'Visualize complex data structures and algorithms with step-by-step animations that make abstract concepts concrete and understandable.'
    },
    {
      icon: <Code size={24} />,
      title: 'Code Implementation',
      description: 'See real code implementations in multiple programming languages, with line-by-line explanations of how each algorithm works.'
    },
    {
      icon: <Brain size={24} />,
      title: 'Comprehensive Documentation',
      description: 'Access detailed explanations, time and space complexity analysis, and practical applications for each data structure and algorithm.'
    },
    {
      icon: <Award size={24} />,
      title: 'Progress Tracking',
      description: 'Track your learning journey with our progress system. Mark topics as completed and see your growth over time.'
    }
  ];
  
  const howToUse = [
    {
      step: 1,
      title: 'Choose a Topic',
      description: 'Browse our extensive library of data structures and algorithms. Select a topic you want to learn or practice.',
      icon: <Brain size={24} />
    },
    {
      step: 2,
      title: 'Visualize and Learn',
      description: 'Use our interactive visualizations to see how the algorithm or data structure works. Adjust parameters and see real-time changes.',
      icon: <Rocket size={24} />
    },
    {
      step: 3,
      title: 'Study the Code',
      description: 'Examine the implementation details with our annotated code examples. Understand the logic behind each operation.',
      icon: <Code size={24} />
    },
    {
      step: 4,
      title: 'Practice and Master',
      description: 'Solve related problems and challenges to reinforce your understanding. Track your progress as you master each concept.',
      icon: <Award size={24} />
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={`text-4xl font-bold mb-4
                        ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
            About AlgoLearn
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-80">
            Your cosmic journey through the universe of data structures and algorithms.
          </p>
        </motion.div>
        
        {/* Mission Statement */}
        <motion.div 
          className="card card-glass mb-16 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className={`text-2xl font-bold mb-4
                        ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}>
            Our Mission
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            AlgoLearn was created to document and enhance my journey of learning Data Structures and Algorithms for college placements. This platform transforms complex DSA concepts into interactive visualizations, making learning more intuitive, engaging, and practical. By bridging theory with real-world problem-solving, I aim to help fellow students master DSA efficiently and confidently navigate technical interviews
          </p>
        </motion.div>
        
        {/* Features */}
        <div className="mb-16">
          <h2 className={`text-2xl font-bold mb-8 text-center
                        ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
            What Makes AlgoLearn Special
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="card card-glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  <div className={`p-3 rounded-full inline-block mb-4
                                ${theme === 'dark' 
                                  ? 'bg-dark-primary/20 text-dark-primary' 
                                  : 'bg-light-primary/20 text-light-primary'}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="opacity-80">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* How to Use */}
        <div className="mb-16">
          <h2 className={`text-2xl font-bold mb-8 text-center
                        ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
            How to Use AlgoLearn
          </h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-1 
                           ${theme === 'dark' ? 'bg-dark-primary/30' : 'bg-light-primary/30'}`} />
            
            {/* Steps */}
            <div className="space-y-12">
              {howToUse.map((step, index) => (
                <motion.div 
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                >
                  <div className={`flex flex-col md:flex-row items-center
                                 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Timeline Dot */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                     ${theme === 'dark' 
                                       ? 'bg-dark-primary text-dark-background' 
                                       : 'bg-light-primary text-white'}`}>
                        {step.step}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className="card card-glass p-6">
                        <div className={`p-3 rounded-full inline-block mb-4
                                      ${theme === 'dark' 
                                        ? 'bg-dark-primary/20 text-dark-primary' 
                                        : 'bg-light-primary/20 text-light-primary'}`}>
                          {step.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                        <p className="opacity-80">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
{/* Mission Statement */}
        <motion.div 
          className="card card-glass mb-16 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className={`text-2xl font-bold mb-4
                        ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}>
            A Word From The Creator
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            Hi, I’m Madiha, the mind behind AlgoLearn. As a final-year BTech student preparing for placements, I built this platform to simplify DSA learning through visualizations. The journey of mastering algorithms can be tough, but with the right tools, it becomes engaging and intuitive.

This project is a work in progress, with constant improvements to make learning even better. I hope it helps you on your coding journey—happy learning!🚀
          </p>
        </motion.div>
        
        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <h2 className={`text-2xl font-bold mb-6
                        ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 opacity-80">
            Begin exploring the universe of data structures and algorithms today. 
            Track your progress, visualize complex concepts, and master the fundamentals of computer science.
          </p>
          <Link 
            to="/data-structures" 
            className="btn btn-primary inline-flex items-center"
          >
            Start Learning <ArrowRight size={16} className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;