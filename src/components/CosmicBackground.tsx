import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  size: number;
  x: number;
  y: number;
  opacity: number;
  animationDuration: number;
}

interface Cloud {
  id: number;
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
}

const CosmicBackground: React.FC = () => {
  const { theme } = useTheme();
  const [stars, setStars] = useState<Star[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);

  useEffect(() => {
    // Generate stars
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = Math.floor(window.innerWidth * window.innerHeight / 5000); // Increased star count
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          size: Math.random() * 3 + 0.5, // Slightly larger stars
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: Math.random() * 0.7 + 0.3,
          animationDuration: Math.random() * 4 + 2,
        });
      }
      
      setStars(newStars);
    };

    // Generate clouds for light mode
    const generateClouds = () => {
      const newClouds: Cloud[] = [];
      const cloudCount = 6;
      
      for (let i = 0; i < cloudCount; i++) {
        newClouds.push({
          id: i,
          width: Math.random() * 200 + 100,
          height: Math.random() * 60 + 40,
          x: Math.random() * 100,
          y: Math.random() * 40 + 5, // Keep clouds in upper part of screen
          speed: Math.random() * 50 + 20, // Cloud movement speed
        });
      }
      
      setClouds(newClouds);
    };

    generateStars();
    generateClouds();

    const handleResize = () => {
      generateStars();
      generateClouds();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);

  return (
    <div className={`fixed inset-0 w-full h-full -z-10 overflow-hidden transition-colors duration-1000 ease-in-out
                    ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      
      {/* Stars (only visible in dark mode) */}
      {theme === 'dark' && stars.map((star) => (
        <div
          key={star.id}
          className="star animate-twinkle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            animationDuration: `${star.animationDuration}s`,
          }}
        />
      ))}
      
      {/* Clouds (only visible in light mode) */}
      {theme === 'light' && clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute rounded-full bg-white/80"
          style={{
            width: `${cloud.width}px`,
            height: `${cloud.height}px`,
            left: `${cloud.x}%`,
            top: `${cloud.y}%`,
            filter: 'blur(15px)',
          }}
          animate={{
            x: [0, cloud.speed, 0],
          }}
          transition={{
            duration: 20 + cloud.speed / 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      
      {/* Sun or Moon */}
      <div 
        className={`absolute rounded-full transition-all duration-1000 ease-in-out
                   ${theme === 'dark' 
                     ? 'bg-dark-primary/30 w-32 h-32 -top-10 -right-10 shadow-[0_0_100px_rgba(0,255,255,0.5)]' 
                     : 'bg-yellow-200 w-48 h-48 -top-20 -right-20 shadow-[0_0_150px_rgba(255,255,0,0.7)]'}`}
      />
    </div>
  );
};

export default CosmicBackground;