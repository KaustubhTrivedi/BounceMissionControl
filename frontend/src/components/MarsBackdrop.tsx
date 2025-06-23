import React, { useEffect, useState, useCallback, useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  brightness: number;
  speed: number;
}

interface DataPoint {
  id: number;
  x: number;
  y: number;
  intensity: number;
  delay: number;
  depth: number;
}

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
  opacity: number;
}

const MarsBackdrop: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Star[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [floatingParticles, setFloatingParticles] = useState<FloatingParticle[]>([]);
  const [showRover, setShowRover] = useState(false);
  const [time, setTime] = useState(0);

  // Generate enhanced stars with different speeds and depths
  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 150; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 0.3,
          brightness: Math.random() * 0.9 + 0.1,
          speed: Math.random() * 0.5 + 0.1, // Different parallax speeds
        });
      }
      setStars(newStars);
    };

    const generateDataPoints = () => {
      const newDataPoints: DataPoint[] = [];
      for (let i = 0; i < 25; i++) {
        newDataPoints.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          intensity: Math.random() * 0.8 + 0.2,
          delay: Math.random() * 5,
          depth: Math.random() * 0.8 + 0.2, // Different depths for layering
        });
      }
      setDataPoints(newDataPoints);
    };

    const generateFloatingParticles = () => {
      const newParticles: FloatingParticle[] = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.3 + 0.1,
          direction: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
      setFloatingParticles(newParticles);
    };

    generateStars();
    generateDataPoints();
    generateFloatingParticles();

    // Rover easter egg timer
    const roverInterval = setInterval(() => {
      setShowRover(true);
      setTimeout(() => setShowRover(false), 4000);
    }, 20000);

    return () => clearInterval(roverInterval);
  }, []);



  // Mouse movement handler for subtle interactive effects
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  // Animation timer for floating particles
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 0.016); // ~60fps
    }, 16);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  // Memoized transform calculations for better performance
  const layerTransforms = useMemo(() => ({
    background: `translateX(${mousePos.x * 2}px)`,
    stars: `translateX(${mousePos.x * 5}px)`,
    arcs: `translateX(${mousePos.x * 8}px)`,
    grid: `translateX(${mousePos.x * 10}px)`,
    particles: `translateX(${mousePos.x * 6}px)`,
  }), [mousePos]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Layer 1: Enhanced Deep Space Gradient Background */}
      <div 
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          background: `
            radial-gradient(ellipse at ${30 + mousePos.x * 5}% ${20 + mousePos.y * 5}%, rgba(102, 252, 241, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse at ${70 - mousePos.x * 5}% ${80 - mousePos.y * 5}%, rgba(195, 7, 63, 0.12) 0%, transparent 60%),
            radial-gradient(circle at ${50 + mousePos.x * 3}% ${50 + mousePos.y * 3}%, rgba(255, 127, 80, 0.05) 0%, transparent 80%),
            linear-gradient(135deg, #4a0e4e 0%, #2a1a3e 20%, #1a1a2e 40%, #0B0C10 100%)
          `,
          transform: layerTransforms.background,
        }}
      />

      {/* Floating Particles Layer */}
      <div 
        className="absolute inset-0 transition-transform duration-200 ease-out"
        style={{ transform: layerTransforms.particles }}
      >
        {floatingParticles.map((particle) => {
          const x = particle.x + Math.sin(time * particle.speed + particle.direction) * 2;
          const y = particle.y + Math.cos(time * particle.speed * 0.7 + particle.direction) * 1.5;
          
          return (
            <div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-transparent"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity * (0.5 + Math.sin(time * 2 + particle.id) * 0.3),
                boxShadow: `0 0 ${particle.size * 3}px rgba(102, 252, 241, ${particle.opacity * 0.5})`,
              }}
            />
          );
        })}
      </div>

      {/* Enhanced Mars-focused Constellations */}
      <div 
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: layerTransforms.stars }}
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute animate-pulse"
            style={{
              left: `${star.x + Math.sin(time * star.speed) * 0.5}%`,
              top: `${star.y + Math.cos(time * star.speed * 0.8) * 0.3}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: '#66FCF1',
              borderRadius: '50%',
              opacity: star.brightness * (0.6 + Math.sin(time * 3 + star.id) * 0.4),
              boxShadow: `0 0 ${star.size * 3}px rgba(102, 252, 241, ${star.brightness * 0.8})`,
              animationDuration: `${2 + Math.random() * 3}s`,
              transform: `translateZ(${star.speed * 100}px)`, // 3D depth
            }}
          />
        ))}
      </div>

      {/* Layer 2: Enhanced HUD-like Arcs and Scanning Lines */}
      <div 
        className="absolute inset-0 transition-transform duration-400 ease-out"
        style={{ transform: layerTransforms.arcs }}
      >
        {/* Dynamic Orbital Arcs */}
        <svg className="absolute inset-0 w-full h-full opacity-40">
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#66FCF1" stopOpacity="0" />
              <stop offset="30%" stopColor="#66FCF1" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#66FCF1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#66FCF1" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Large orbital arc with rotation */}
          <ellipse
            cx="50%"
            cy="50%"
            rx="45%"
            ry="28%"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="1.5"
            filter="url(#glow)"
            style={{
              animation: 'slowRotate 60s linear infinite',
              transformOrigin: 'center',
            }}
          />
          
          {/* Medium orbital arc */}
          <ellipse
            cx="30%"
            cy="70%"
            rx="30%"
            ry="18%"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="1"
            filter="url(#glow)"
            style={{
              animation: 'slowRotate 45s linear infinite reverse',
              transformOrigin: '30% 70%',
            }}
          />
          
          {/* Small orbital arc */}
          <ellipse
            cx="70%"
            cy="30%"
            rx="20%"
            ry="12%"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="0.8"
            filter="url(#glow)"
            style={{
              animation: 'slowRotate 30s linear infinite',
              transformOrigin: '70% 30%',
            }}
          />
        </svg>

        {/* Enhanced Scanning Lines with wave effect */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-50"
              style={{
                top: `${15 + i * 25}%`,
                left: '5%',
                right: '5%',
                animation: `scanning ${4 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
                filter: 'drop-shadow(0 0 3px rgba(102, 252, 241, 0.5))',
              }}
            />
          ))}
        </div>
      </div>

      {/* Layer 3: Enhanced Mars Terrain Grid & Data Points */}
      <div 
        className="absolute inset-0 opacity-25 transition-transform duration-500 ease-out"
        style={{ transform: layerTransforms.grid }}
      >
        {/* Enhanced Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern
              id="marsGrid"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="#1F2833"
                strokeWidth="0.8"
                opacity="0.4"
              />
              <circle cx="0" cy="0" r="1" fill="#66FCF1" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#marsGrid)" />
        </svg>

        {/* Enhanced Glowing Data Points with depth */}
        {dataPoints.map((point) => (
          <div
            key={point.id}
            className="absolute"
            style={{
              left: `${point.x + Math.sin(time * 0.5 + point.id) * point.depth}%`,
              top: `${point.y + Math.cos(time * 0.3 + point.id) * point.depth * 0.5}%`,
              animation: `dataGlow ${2 + point.intensity * 3}s ease-in-out infinite`,
              animationDelay: `${point.delay}s`,
              transform: `scale(${0.8 + point.depth * 0.4})`,
            }}
          >
            <div
              className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-400"
              style={{
                boxShadow: `
                  0 0 15px rgba(195, 7, 63, ${point.intensity * 0.8}),
                  0 0 30px rgba(255, 127, 80, ${point.intensity * 0.4})
                `,
              }}
            />
            <div
              className="absolute inset-0 w-6 h-6 -ml-1.5 -mt-1.5 rounded-full border border-cyan-300 opacity-40"
              style={{
                animation: `marsBackdropPulse ${1.5 + point.intensity}s ease-in-out infinite`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Enhanced Rover Easter Egg */}
      {showRover && (
        <div
          className="absolute transition-all duration-2000 ease-in-out"
          style={{
            left: `${65 + Math.sin(time * 0.1) * 5}%`,
            top: `${55 + Math.cos(time * 0.08) * 3}%`,
            opacity: showRover ? 0.4 : 0,
            transform: `scale(${0.8 + Math.sin(time * 0.2) * 0.1})`,
          }}
        >
          <svg
            width="100"
            height="60"
            viewBox="0 0 100 60"
            className="animate-pulse"
          >
            {/* Enhanced Rover wireframe with glow */}
            <g stroke="#66FCF1" strokeWidth="1.5" fill="none" filter="url(#glow)">
              {/* Main body */}
              <rect x="25" y="25" width="50" height="18" rx="2" />
              {/* Wheels */}
              <circle cx="30" cy="48" r="6" strokeWidth="2" />
              <circle cx="42" cy="48" r="6" strokeWidth="2" />
              <circle cx="58" cy="48" r="6" strokeWidth="2" />
              <circle cx="70" cy="48" r="6" strokeWidth="2" />
              {/* Mast */}
              <line x1="50" y1="25" x2="50" y2="12" strokeWidth="2" />
              <rect x="44" y="8" width="12" height="6" rx="1" />
              {/* Solar panels */}
              <rect x="12" y="18" width="10" height="15" rx="1" />
              <rect x="78" y="18" width="10" height="15" rx="1" />
              {/* Antenna */}
              <line x1="35" y1="25" x2="32" y2="15" strokeWidth="1" />
              <circle cx="32" cy="15" r="2" />
            </g>
          </svg>
        </div>
      )}

      {/* Enhanced Telemetry Data Streams */}
      <div className="absolute top-4 right-4 opacity-30">
        <div className="space-y-2 text-xs font-mono text-cyan-300">
          <div className="animate-pulse bg-black/20 backdrop-blur-sm px-3 py-1 rounded border border-cyan-400/20">
            SOL: {Math.floor(4127 + time * 0.1)}
          </div>
          <div className="animate-pulse bg-black/20 backdrop-blur-sm px-3 py-1 rounded border border-cyan-400/20" style={{ animationDelay: '0.5s' }}>
            TEMP: {Math.floor(-73 + Math.sin(time * 0.1) * 5)}°C
          </div>
          <div className="animate-pulse bg-black/20 backdrop-blur-sm px-3 py-1 rounded border border-cyan-400/20" style={{ animationDelay: '1s' }}>
            WIND: {Math.floor(12 + Math.sin(time * 0.2) * 8)} m/s
          </div>
          <div className="animate-pulse bg-black/20 backdrop-blur-sm px-3 py-1 rounded border border-cyan-400/20" style={{ animationDelay: '1.5s' }}>
            SIGNAL: {Math.floor(94 + Math.sin(time * 0.15) * 6)}%
          </div>
        </div>
      </div>

      {/* Enhanced Custom CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scanning {
            0%, 100% {
              transform: translateX(-120%) skewX(-15deg);
              opacity: 0;
            }
            50% {
              transform: translateX(120%) skewX(-15deg);
              opacity: 1;
            }
          }
          
          @keyframes dataGlow {
            0%, 100% {
              opacity: 0.4;
              transform: scale(1) rotate(0deg);
            }
            50% {
              opacity: 1;
              transform: scale(1.3) rotate(180deg);
            }
          }
          
          @keyframes marsBackdropPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.4;
            }
            50% {
              transform: scale(1.8);
              opacity: 0.1;
            }
          }

          @keyframes slowRotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `
      }} />
    </div>
  );
};

export default MarsBackdrop; 