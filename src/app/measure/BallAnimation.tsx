'use client'

import { useEffect, useRef, useState } from 'react';

const SQUASH_POSITIONS = [
  { top: '7%', left: '10%' }, // 1행 1열
  { top: '7%', left: '90%' }, // 1행 2열
  { top: '50%', left: '10%' },   // 2행 1열
  { top: '50%', left: '90%' },   // 2행 2열
  { top: '93%', left: '10%' }, // 3행 1열
  { top: '93%', left: '90%' }, // 3행 2열
];

interface BallAnimationProps {
  running: boolean;
}

export default function BallAnimation({ running }: BallAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const prevIndexRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        let randomIndex: number;
        do {
          randomIndex = Math.floor(Math.random() * SQUASH_POSITIONS.length);
        } while (randomIndex === prevIndexRef.current);

        setCurrentIndex(randomIndex);
        prevIndexRef.current = randomIndex;

        setTimeout(() => setCurrentIndex(null), 600);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentIndex(null);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  if (currentIndex === null) return null;

  const pos = SQUASH_POSITIONS[currentIndex];

  return (
    <img
      src="/images/squash_ball.png"
      alt="squash ball"
      className="absolute w-10 h-10"
      style={{
        width: '60px',
        height: '60px',
        top: pos.top,
        left: pos.left,
        transform: 'translate(-50%, -50%)',
        transition: 'top 0.3s ease, left 0.3s ease',
      }}
    />
  );
}