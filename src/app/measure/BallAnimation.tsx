'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useMeasureStore from '@/stores/measureStore';

export const getSquashPositions = (count: number) => {
  const positionsByCount: Record<number, { top: string; left: string }[]> = {
    6: [
      { top: '7%', left: '10%' },
      { top: '7%', left: '90%' },
      { top: '50%', left: '10%' },
      { top: '50%', left: '90%' },
      { top: '93%', left: '10%' },
      { top: '93%', left: '90%' },
    ],
    8: [
      { top: '10%', left: '10%' },
      { top: '10%', left: '90%' },
      { top: '35%', left: '10%' },
      { top: '35%', left: '90%' },
      { top: '65%', left: '10%' },
      { top: '65%', left: '90%' },
      { top: '90%', left: '10%' },
      { top: '90%', left: '90%' },
    ],
    12: [
      { top: '5%', left: '10%' },
      { top: '5%', left: '50%' },
      { top: '5%', left: '90%' },
      { top: '30%', left: '10%' },
      { top: '30%', left: '50%' },
      { top: '30%', left: '90%' },
      { top: '60%', left: '10%' },
      { top: '60%', left: '50%' },
      { top: '60%', left: '90%' },
      { top: '90%', left: '10%' },
      { top: '90%', left: '50%' },
      { top: '90%', left: '90%' },
    ],
  };

  return positionsByCount[count] || positionsByCount[6]; // 기본 6개
};


interface BallAnimationProps {
  running: boolean;
}

export default function BallAnimation({ running }: BallAnimationProps) {
  const debugMode = false; // 공 위치 디버깅용
  const searchParams = useSearchParams();
  const item = searchParams.get('item');

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const prevIndexRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const secondTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    second,
    setLevelTerm,
    decreaseSecond,
    resetSecond,
    increaseLevel,
    level,
    ballCount,
    CustomSet,
    CustomRep
  } = useMeasureStore();
  
  const positions = getSquashPositions(ballCount);
  const totalCustomCount = CustomSet * CustomRep;
  const [animationCount, setAnimationCount] = useState(0);

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
    if (!running) return;
  
    if (item === 'CUSTOM GHOSTING') {
      const interval = 2000; // 커스텀 모드의 고정 속도
      setAnimationCount(0); // 초기화
      console.log('animationCount', animationCount)
  
      let count = 0;
  
      const runCustom = () => {
        if (count >= totalCustomCount) {
          // stopRunning(); // 혹은 running false
          return;
        }
  
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * positions.length);
        } while (randomIndex === prevIndexRef.current);
  
        setCurrentIndex(randomIndex);
        prevIndexRef.current = randomIndex;
        playSound();
  
        setTimeout(() => setCurrentIndex(null), interval - 1000);
  
        count++;
        setAnimationCount(count);
      };
  
      // 첫 실행
      runCustom();
  
      intervalRef.current = setInterval(runCustom, interval);
    } else {
      // 기존 레벨 기반 자동 진행 로직
      const interval = getIntervalByLevel(level);
      setLevelTerm(interval);
  
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * positions.length);
      } while (randomIndex === prevIndexRef.current);
  
      setCurrentIndex(randomIndex);
      prevIndexRef.current = randomIndex;
      playSound();
  
      setTimeout(() => setCurrentIndex(null), interval - 1000);
  
      intervalRef.current = setInterval(() => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * positions.length);
        } while (randomIndex === prevIndexRef.current);
  
        setCurrentIndex(randomIndex);
        prevIndexRef.current = randomIndex;
        playSound();
  
        setTimeout(() => setCurrentIndex(null), interval - 1000);
      }, interval);
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

  const pos = positions[currentIndex];

  if (debugMode) {
    return (
      <>
        {positions.map((pos, i) => (
          <img
            key={i}
            src="/images/squash_ball.png"
            alt={`ball-${i}`}
            className="absolute"
            style={{
              width: '60px',
              height: '60px',
              top: pos.top,
              left: pos.left,
              transform: 'translate(-50%, -50%)',
              opacity: 0.5, // 반투명하게 (선택사항)
            }}
          />
        ))}
      </>
    );
  }

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
