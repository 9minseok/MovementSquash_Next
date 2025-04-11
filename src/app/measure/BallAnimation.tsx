'use client';

import { useEffect, useRef, useState } from 'react';
import useMeasureStore from '@/stores/measureStore';

const SQUASH_POSITIONS = [
  { top: '7%', left: '10%' },
  { top: '7%', left: '90%' },
  { top: '50%', left: '10%' },
  { top: '50%', left: '90%' },
  { top: '93%', left: '10%' },
  { top: '93%', left: '90%' },
];

interface BallAnimationProps {
  running: boolean;
}

export default function BallAnimation({ running }: BallAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const prevIndexRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const secondTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    second,
    increaseSecond,
    resetSecond,
    increaseRound,
  } = useMeasureStore();

  // 공 애니메이션
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

  // 1초마다 second 증가, 30초마다 round 증가
  useEffect(() => {
    if (running) {
      secondTimerRef.current = setInterval(() => {
        increaseSecond();
      }, 1000);
    } else {
      if (secondTimerRef.current) clearInterval(secondTimerRef.current);
    }

    return () => {
      if (secondTimerRef.current) clearInterval(secondTimerRef.current);
    };
  }, [running]);

  // 30초 되면 라운드 증가
  useEffect(() => {
    if (second >= 30) {
      increaseRound();
      resetSecond();
    }
  }, [second]);

  if (currentIndex === null) return null;

  const pos = SQUASH_POSITIONS[currentIndex];

  return (
    <img
      src="/images/squash_ball.png"
      alt="squash ball"
      className="absolute"
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
