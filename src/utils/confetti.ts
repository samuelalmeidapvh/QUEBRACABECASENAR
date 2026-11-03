/**
 * Motor de Confetes e Partículas Comemorativas (HTML5 Canvas)
 * Sem dependências externas.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'rect' | 'circle';
}

export function triggerConfetti(durationMs: number = 3000) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.id = 'senar-confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();

  const colors = [
    '#10b981', // Emerald
    '#059669', // Senar Green
    '#f59e0b', // Gold Amber
    '#fbbf24', // Yellow Gold
    '#3b82f6', // Agro Blue
    '#34d399', // Mint
    '#ffffff'  // Pure White
  ];

  const particles: Particle[] = [];
  const count = 120;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 50,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 5 + 4,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      opacity: 1,
      shape: Math.random() > 0.4 ? 'rect' : 'circle'
    });
  }

  const startTime = Date.now();
  let animationId: number;

  const update = () => {
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.vy += 0.08; // gravity

      if (elapsed > durationMs - 1000) {
        p.opacity = Math.max(0, (durationMs - elapsed) / 1000);
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    if (elapsed < durationMs) {
      animationId = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(animationId);
      canvas.remove();
    }
  };

  animationId = requestAnimationFrame(update);
}
