import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Firework {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  startX: number;
  startY: number;
  color: string;
  trail: { x: number; y: number; alpha: number }[];
}

const COLORS = [
  'hsl(38, 100%, 60%)',   // Gold
  'hsl(25, 100%, 55%)',   // Orange
  'hsl(340, 80%, 60%)',   // Magenta/Pink
  'hsl(10, 85%, 60%)',    // Warm Red
  'hsl(45, 100%, 70%)',   // Light Gold
  'hsl(150, 45%, 50%)',   // Soft Green
];

const FireworkCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const isAnimatingRef = useRef(false);

  const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

  const createFirework = useCallback((targetX: number, targetY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startX = canvas.width / 2;
    const startY = canvas.height;

    fireworksRef.current.push({
      x: startX,
      y: startY,
      targetX,
      targetY,
      progress: 0,
      startX,
      startY,
      color: getRandomColor(),
      trail: [],
    });

    // Start animation loop if not already running
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      animate();
    }
  }, []);

  const createExplosion = useCallback((x: number, y: number, color: string) => {
    const particleCount = 35 + Math.random() * 20;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.2;
      const speed = 1.5 + Math.random() * 3;
      const life = 50 + Math.random() * 30;
      
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        color: Math.random() > 0.3 ? color : getRandomColor(),
        size: 1.5 + Math.random() * 2,
      });
    }

    // Add sparkles
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.5;
      const life = 25 + Math.random() * 20;
      
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        color: 'hsl(45, 100%, 90%)',
        size: 0.8 + Math.random() * 0.8,
      });
    }
  }, []);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const quadraticBezier = (t: number, p0: number, p1: number, p2: number) => {
    const oneMinusT = 1 - t;
    return oneMinusT * oneMinusT * p0 + 2 * oneMinusT * t * p1 + t * t * p2;
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw fireworks
    fireworksRef.current = fireworksRef.current.filter(firework => {
      firework.progress += 0.025;
      
      const easedProgress = easeOutCubic(firework.progress);
      
      // Calculate curved path using quadratic bezier
      const controlX = (firework.startX + firework.targetX) / 2;
      const controlY = Math.min(firework.startY, firework.targetY) - 80;
      
      firework.x = quadraticBezier(easedProgress, firework.startX, controlX, firework.targetX);
      firework.y = quadraticBezier(easedProgress, firework.startY, controlY, firework.targetY);

      // Add to trail
      firework.trail.push({ x: firework.x, y: firework.y, alpha: 1 });
      if (firework.trail.length > 12) firework.trail.shift();

      // Draw trail
      firework.trail.forEach((point, index) => {
        const alpha = (index / firework.trail.length) * 0.5;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = firework.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
        ctx.fill();
      });

      // Draw firework head with glow
      const gradient = ctx.createRadialGradient(firework.x, firework.y, 0, firework.x, firework.y, 6);
      gradient.addColorStop(0, firework.color);
      gradient.addColorStop(0.5, firework.color.replace(')', ', 0.5)').replace('hsl', 'hsla'));
      gradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(firework.x, firework.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core of firework
      ctx.beginPath();
      ctx.arc(firework.x, firework.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(45, 100%, 95%)';
      ctx.fill();

      if (firework.progress >= 1) {
        createExplosion(firework.targetX, firework.targetY, firework.color);
        return false;
      }
      return true;
    });

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.vy += 0.04; // Gentle gravity
      particle.vx *= 0.98; // Air resistance
      particle.vy *= 0.98;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;

      const lifeRatio = particle.life / particle.maxLife;
      const alpha = lifeRatio * 0.85;
      const particleRadius = Math.max(0.1, particle.size * lifeRatio);

      // Draw particle with soft glow
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particleRadius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
      ctx.fill();

      // Subtle glow for larger particles
      if (particle.size > 1.2 && lifeRatio > 0.3) {
        const glowRadius = Math.max(0.1, particle.size * 1.8 * lifeRatio);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowRadius
        );
        glowGradient.addColorStop(0, particle.color.replace(')', `, ${alpha * 0.3})`).replace('hsl', 'hsla'));
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.fill();
      }

      return particle.life > 0;
    });

    // Continue animation only if there are active elements
    if (fireworksRef.current.length > 0 || particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      isAnimatingRef.current = false;
      // Clear canvas completely when done
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [createExplosion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Only trigger on click - no hover effects
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createFirework(x, y);
    };

    // Touch handling with scroll prevention only during active tap
    let touchStartY = 0;
    let isTapping = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      isTapping = true;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTapping) return;
      
      const touch = e.changedTouches[0];
      const deltaY = Math.abs(touch.clientY - touchStartY);
      
      // Only trigger firework if it wasn't a scroll gesture (less than 10px movement)
      if (deltaY < 10) {
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        createFirework(x, y);
      }
      
      isTapping = false;
    };

    const handleTouchMove = () => {
      // If significant movement, cancel the tap
      isTapping = false;
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchmove', handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createFirework]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto z-10"
      style={{ touchAction: 'auto' }}
    />
  );
};

export default FireworkCanvas;