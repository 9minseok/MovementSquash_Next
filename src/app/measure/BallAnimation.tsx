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
    decreaseSecond,
    resetSecond,
    increaseLevel,
    level,
  } = useMeasureStore();
  

  const getIntervalByLevel = (level: number) => {
    const map: Record<number, number> = {
      1: 6000,
      2: 5540,
      3: 5140,
      4: 4800,
      5: 4500,
      6: 4240,
      7: 4000,
      8: 3790,
      9: 3600,
      10: 3430,
      11: 3270,
      12: 3130,
      13: 3000,
      14: 2880,
      15: 2770,
      16: 2670,
    };
    return map[level] || 1000; // 기본값: 너무 높은 level이면 fallback으로 1초
  };

  const playSound = () => {
    const audio = new Audio('/sounds/beep_only.mp3');
    audio.play().catch((e) => {
      console.warn('Audio play failed:', e);
    });
  };
  
  // 공 애니메이션
  useEffect(() => {
    if (running) {
      const interval = getIntervalByLevel(level);
  
      // 🔥 첫 공 즉시 실행
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * SQUASH_POSITIONS.length);
      } while (randomIndex === prevIndexRef.current);
  
      setCurrentIndex(randomIndex);
      prevIndexRef.current = randomIndex;
      playSound();

      setTimeout(() => setCurrentIndex(null), interval-1000); // 첫 공도 600ms 뒤 사라지게
  
      // 🔁 이후는 interval마다 실행
      intervalRef.current = setInterval(() => {
        let randomIndex: number;
        do {
          randomIndex = Math.floor(Math.random() * SQUASH_POSITIONS.length);
        } while (randomIndex === prevIndexRef.current);
  
        setCurrentIndex(randomIndex);
        prevIndexRef.current = randomIndex;
        playSound();
  
        setTimeout(() => setCurrentIndex(null), interval-1000);
      }, interval);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentIndex(null);
    }
  
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, level]);
  

  // 1초마다 second 증가, 30초마다 round 증가
  useEffect(() => {
    if (running) {
      secondTimerRef.current = setInterval(() => {
        decreaseSecond(); // 감소하도록 변경
      }, 1000);
    } else {
      if (secondTimerRef.current) clearInterval(secondTimerRef.current);
    }

    return () => {
      if (secondTimerRef.current) clearInterval(secondTimerRef.current);
    };
  }, [running]);

  // 0초 되면 라운드 증가 + 타이머 초기화
  useEffect(() => {
    if (second <= 0) {
      increaseLevel();
      resetSecond(); // 다시 60초로 초기화
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
