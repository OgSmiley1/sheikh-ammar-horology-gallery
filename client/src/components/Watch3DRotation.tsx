import { useEffect, useRef, useState } from 'react';

interface Watch3DRotationProps {
  imageSrc: string;
  altText: string;
}

export function Watch3DRotation({ imageSrc, altText }: Watch3DRotationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotationX = (mouseY / rect.height) * 15;
      const rotationY = (mouseX / rect.width) * 15;

      setRotation({ x: rotationX, y: rotationY });
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setRotation({ x: 0, y: 0 });
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isHovering]);

  return (
    <div
      ref={containerRef}
      className="watch-3d-rotation"
      style={{
        perspective: '1000px',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: isHovering ? 'none' : 'transform 0.6s ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          ref={imageRef}
          src={imageSrc}
          alt={altText}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'contrast(1.1) brightness(1.05) saturate(0.9) drop-shadow(0 20px 40px rgba(0,0,0,0.8))',
          }}
        />
      </div>

      {/* Light sweep effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(
            ${45 + rotation.y}deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          )`,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          borderRadius: 'inherit',
        }}
      />
    </div>
  );
}
