'use client';

import { useEffect, useRef, useState } from 'react';
import useMeasureStore from '@/stores/measureStore';

export const getSquashPositions = (count: number) => {
  const positionsByCount: Record<number, { top: string; left: string }[]> = {
    4: [
      { top: '7%', left: '10%' },
      { top: '7%', left: '90%' },
      { top: '93%', left: '10%' },
      { top: '93%', left: '90%' },
    ],
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
      { top: '10%', left: '10%' },
      { top: '10%', left: '90%' },
      { top: '25%', left: '10%' },
      { top: '25%', left: '90%' },
      { top: '40%', left: '10%' },
      { top: '40%', left: '90%' },
      { top: '60%', left: '10%' },
      { top: '60%', left: '90%' },
      { top: '75%', left: '10%' },
      { top: '75%', left: '90%' },
      { top: '90%', left: '10%' },
      { top: '90%', left: '90%' },
    ],
  };

  return positionsByCount[count] || positionsByCount[6]; // 기본 6개
};

interface BallAnimationProps {
  running: boolean;
  setRunning: React.Dispatch<React.SetStateAction<boolean>>;
  isResting: boolean;
  setIsResting: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BallAnimation({ running, setRunning, isResting, setIsResting }: BallAnimationProps) {
  const debugMode = false; // 공 위치 디버깅용

  const {
    pageInfo,
    second,
    setLevelTerm,
    decreaseSecond,
    resetSecond,
    increaseLevel,
    level,
    ballCount,
    CustomLevelTerm,
    CustomSet,
    CustomRep,
  } = useMeasureStore();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const prevIndexRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const secondTimerRef = useRef<NodeJS.Timeout | null>(null);
  const restTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const positions = getSquashPositions(ballCount);

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
    if (!running || isResting) return;
    console.log('====================================')
    console.log('공 애니메이션 useEffect 실행됨')
    console.log('====================================')
  
    if (pageInfo === 'CUSTOM GHOSTING') {
      console.log('커스텀 모드 볼 애니메이션');
  
      let rep = 0;
      let setNum = 0;

      const runCustom = () => {
        console.log('runCustom 실행됨');

        if (rep >= CustomRep) {
          rep = 0;
          setNum += 1;

          console.log('rep', rep);
          console.log('setNum', setNum);

          if (setNum >= CustomSet) {
            setRunning(false);
            return;
          }

          setIsResting(true);

          restTimeoutRef.current = setTimeout(() => {
            setIsResting(false);
            runCustom(); // 휴식 후 다음 세트 시작
          }, 2000); // 2초 휴식

          return;
        }

        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * positions.length);
        } while (randomIndex === prevIndexRef.current);

        setCurrentIndex(randomIndex);
        prevIndexRef.current = randomIndex;
        playSound();

        setTimeout(() => setCurrentIndex(null), CustomLevelTerm - 1000);

        rep++;

        // 다음 공 예약
        intervalRef.current = setTimeout(runCustom, CustomLevelTerm);
      };

      runCustom(); // 첫 실행

    } else {
      // LEVEL PRACTICE / VO2 MAX TEST
      console.log('VO2, LEVEL 모드 볼 애니메이션');
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
    if (pageInfo !== 'CUSTOM GHOSTING') {
      if (running) {
        secondTimerRef.current = setInterval(() => {
          if (second > 0) {
            decreaseSecond();
          }
        }, 1000);

      } else {
        if (secondTimerRef.current) clearInterval(secondTimerRef.current);
      }

      return () => {
        if (secondTimerRef.current) clearInterval(secondTimerRef.current);
      };
    }
  }, [running]);

  // 0초 되면 라운드 증가 + 타이머 초기화
  // 라운드 종료 후 휴식 타이머
  useEffect(() => {
    if (pageInfo !== 'CUSTOM GHOSTING') {
      if (second <= 0 && running && !isResting) {
        if (pageInfo === 'LEVEL PRACTICE') {
          setRunning(false);
          return;
        }

        if (level >= 16) {
          setRunning(false);
          return;
        }

        setIsResting(true);
        console.log('휴식 시작');

        restTimeoutRef.current = setTimeout(() => {
          increaseLevel();
          resetSecond(); // 다시 60초로 초기화
          setIsResting(false);
          console.log('휴식 종료 및 다음 라운드 시작');
        }, 10000); // 10초
      }
    }
  }, [second]); // 🔑 의존성을 second 하나만 넣기

  useEffect(() => {
    return () => {
      if (restTimeoutRef.current) {
        clearTimeout(restTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isResting && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setCurrentIndex(null); // 현재 공 제거
    }
  }, [isResting]);

  
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

  console.log('running ',running)
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
