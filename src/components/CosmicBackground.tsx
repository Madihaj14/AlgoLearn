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

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
}

interface Bird {
  id: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  wingSpeed: number;
  waveAmplitude: number;
  waveFrequency: number;
}

const CosmicBackground: React.FC = () => {
  const { theme } = useTheme();
  const [stars, setStars] = useState<Star[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [birds, setBirds] = useState<Bird[]>([]);

  useEffect(() => {
    // Generate stars
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = Math.floor(window.innerWidth * window.innerHeight / 5000);
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          size: Math.random() * 3 + 0.5,
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
          y: Math.random() * 40 + 5,
          speed: Math.random() * 50 + 20,
        });
      }
      
      setClouds(newClouds);
    };

    // Generate shooting stars for dark mode
    const generateShootingStars = () => {
      const newShootingStars: ShootingStar[] = [];
      const shootingStarCount = 5;
      
      for (let i = 0; i < shootingStarCount; i++) {
        newShootingStars.push({
          id: i,
          startX: Math.random() * 30,
          startY: Math.random() * 30,
          size: Math.random() * 2 + 1.5,
          duration: Math.random() * 2 + 1.5,
          delay: Math.random() * 8,
        });
      }
      
      setShootingStars(newShootingStars);
    };

    // Generate birds for light mode
    const generateBirds = () => {
      const newBirds: Bird[] = [];
      const birdCount = 8;
      
      for (let i = 0; i < birdCount; i++) {
        newBirds.push({
          id: i,
          startY: Math.random() * 60 + 10,
          size: Math.random() * 0.5 + 0.8,
          duration: Math.random() * 15 + 20,
          delay: Math.random() * 30,
          wingSpeed: Math.random() * 0.5 + 0.8,
          waveAmplitude: Math.random() * 30 + 20,
          waveFrequency: Math.random() * 2 + 1.5,
        });
      }
      
      setBirds(newBirds);
    };

    generateStars();
    generateClouds();
    generateShootingStars();
    generateBirds();

    const handleResize = () => {
      generateStars();
      generateClouds();
      generateShootingStars();
      generateBirds();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);

  // Generate smooth sine wave keyframes for bird movement
  const generateWaveKeyframes = (bird: Bird) => {
    const keyframes: { [key: string]: number } = {};
    const steps = 20; // Number of keyframe steps
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps; // 0 to 1
      const angle = progress * bird.waveFrequency * 2 * Math.PI;
      
      // Create complex wave pattern with multiple sine waves
      const primaryWave = Math.sin(angle) * bird.waveAmplitude;
      const secondaryWave = Math.sin(angle * 2.3 + 1.2) * (bird.waveAmplitude * 0.3);
      const tertiaryWave = Math.sin(angle * 0.7 + 2.1) * (bird.waveAmplitude * 0.15);
      
      // Combine waves for natural movement
      const combinedWave = primaryWave + secondaryWave + tertiaryWave;
      
      // Add slight randomness
      const randomOffset = Math.sin(angle * 5.7) * (bird.waveAmplitude * 0.05);
      
      const percentage = `${(progress * 100).toFixed(1)}%`;
      keyframes[percentage] = combinedWave + randomOffset;
    }
    
    return keyframes;
  };

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

      {/* Shooting Stars (only visible in dark mode) */}
      {theme === 'dark' && shootingStars.map((shootingStar) => (
        <motion.div
          key={shootingStar.id}
          className="absolute pointer-events-none"
          style={{
            left: `${shootingStar.startX}%`,
            top: `${shootingStar.startY}%`,
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
          }}
          animate={{
            x: window.innerWidth * 0.7,
            y: window.innerHeight * 0.7,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: shootingStar.duration,
            delay: shootingStar.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 12 + 8,
            ease: "easeOut",
          }}
        >
          <div 
            className="relative"
            style={{
              transform: 'rotate(45deg)',
              transformOrigin: 'center',
            }}
          >
            <div
              className="absolute"
              style={{
                width: `${shootingStar.size * 25}px`,
                height: `${shootingStar.size}px`,
                background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 30%, rgba(255, 255, 255, 0.8) 100%)',
                right: `${shootingStar.size / 2}px`,
                top: '50%',
                transform: 'translateY(-50%)',
                borderRadius: `0 ${shootingStar.size / 2}px ${shootingStar.size / 2}px 0`,
              }}
            />
            <div
              className="relative bg-white rounded-full z-10"
              style={{
                width: `${shootingStar.size}px`,
                height: `${shootingStar.size}px`,
                boxShadow: `0 0 ${shootingStar.size * 3}px rgba(255, 255, 255, 0.9), 0 0 ${shootingStar.size * 6}px rgba(255, 255, 255, 0.5)`,
              }}
            />
          </div>
        </motion.div>
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

      {/* Flying Birds with Sine Wave Motion (only visible in light mode) */}
      {theme === 'light' && birds.map((bird) => {
        const waveKeyframes = generateWaveKeyframes(bird);
        
        return (
          <div
            key={bird.id}
            className="absolute pointer-events-none"
            style={{
              left: '-50px',
              top: `${bird.startY}%`,
              transform: `scale(${bird.size})`,
            }}
          >
            {/* Horizontal movement container */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: window.innerWidth + 100 }}
              transition={{
                duration: bird.duration,
                delay: bird.delay,
                repeat: Infinity,
                repeatDelay: Math.random() * 10 + 5,
                ease: "linear",
              }}
            >
              {/* Vertical wave movement container */}
              <motion.div
                initial={{ y: 0 }}
                animate={waveKeyframes}
                transition={{
                  duration: bird.duration,
                  delay: bird.delay,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 10 + 5,
                  ease: "easeInOut",
                }}
              >
                {/* Bird SVG with enhanced animated wings */}
                <motion.svg
                  width="24"
                  height="16"
                  viewBox="0 0 24 16"
                  className="text-gray-600/70"
                  animate={{
                    scaleY: [1, 0.7, 1, 0.7, 1],
                    rotate: [0, 2, 0, -2, 0],
                  }}
                  transition={{
                    duration: bird.wingSpeed,
                    repeat: Infinity,
                    ease: "easeInOut",
                    opacity: [1, 0.95, 0.9, 0.95, 1]
                  }}
                >
                  {/* Bird body */}
                  <ellipse cx="12" cy="8" rx="2" ry="1" fill="currentColor" />
                  
                  {/* Left wing with enhanced animation */}
                  <motion.path
                    d="M10 8 Q6 4 2 6 Q6 10 10 8"
                    fill="currentColor"
                    animate={{
                      d: [
                        "M10 8 Q6 4 2 6 Q6 10 10 8",
                        "M10 8 Q6 5 2 7 Q6 9 10 8",
                        "M10 8 Q6 6 2 8 Q6 8 10 8",
                        "M10 8 Q6 5 2 7 Q6 9 10 8",
                        "M10 8 Q6 4 2 6 Q6 10 10 8"
                      ],
                      opacity: [1, 0.9, 0.8, 0.9, 1]
                    }}
                    transition={{
                      duration: bird.wingSpeed,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.6, 1],
                    }}
                  />
                  
                  {/* Right wing with enhanced animation */}
                  <motion.path
                    d="M14 8 Q18 4 22 6 Q18 10 14 8"
                    fill="currentColor"
                    animate={{
                      d: [
                        "M14 8 Q18 4 22 6 Q18 10 14 8",
                        "M14 8 Q18 5 22 7 Q18 9 14 8",
                        "M14 8 Q18 6 22 8 Q18 8 14 8",
                        "M14 8 Q18 5 22 7 Q18 9 14 8",
                        "M14 8 Q18 4 22 6 Q18 10 14 8"
                      ],
                      opacity: [1, 0.9, 0.8, 0.9, 1]
                    }}
                    transition={{
                      duration: bird.wingSpeed,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.6, 1],
                    }}
                  />
                  
                  {/* Bird head with subtle animation */}
                  <motion.circle 
                    cx="14" 
                    cy="8" 
                    r="1.5" 
                    fill="currentColor"
                    animate={{
                      cy: [8, 7.8, 8, 8.2, 8]
                    }}
                    transition={{
                      duration: bird.wingSpeed * 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  {/* Beak */}
                  <path d="M15.5 8 L17 7.5 L17 8.5 Z" fill="currentColor" />
                </motion.svg>
              </motion.div>
            </motion.div>
          </div>
        );
      })}
      
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