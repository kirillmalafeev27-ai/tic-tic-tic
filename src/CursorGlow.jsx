import { useEffect, useRef } from 'react';

/**
 * Gradient blob that follows the mouse cursor with a smooth trailing effect.
 * Based on: https://codepen.io/Iseyaaaaa/pen/qBMNEGN
 *
 * Props:
 *   colors - gradient colors string, e.g. "#ff00f2, #1100ff"
 *   size - blob size in px (default 600)
 *   blur - blur amount in px (default 200)
 *   opacity - blob opacity (default 0.4)
 */
const CursorGlow = ({ colors = '#ff00f2, #1100ff', size = 600, blur = 200, opacity = 0.4 }) => {
  const blobRef = useRef(null);
  const posRef = useRef({ x: -1000, y: -1000 });
  const targetRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    const handleMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    // Smooth animation loop with lerp
    const animate = () => {
      const lerp = 0.08;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;

      blob.style.transform = `translate3d(${posRef.current.x - size / 2}px, ${posRef.current.y - size / 2}px, 0)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [size]);

  return (
    <div
      ref={blobRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors})`,
        filter: `blur(${blur}px)`,
        opacity,
        pointerEvents: 'none',
        zIndex: 1,
        willChange: 'transform',
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default CursorGlow;
