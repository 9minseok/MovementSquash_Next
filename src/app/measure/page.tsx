'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const SQUASH_POSITIONS = [
  { top: '7%', left: '10%' }, // 1행 1열
  { top: '7%', left: '90%' }, // 1행 2열
  { top: '50%', left: '10%' },   // 2행 1열
  { top: '50%', left: '90%' },   // 2행 2열
  { top: '93%', left: '10%' }, // 3행 1열
  { top: '93%', left: '90%' }, // 3행 2열
];

function SearchParamRenderer() {
  const searchParams = useSearchParams();
  const item = searchParams.get('item');

  return (
    <div className="flex item-center flex-col absolute top-3 text-white">
      <h1 className="text-3xl font-bold p-2 text-center">{item}</h1>
    </div>
  );
}

function BallAnimation({ running }: { running: boolean }) {
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
    }

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
      }}
    />
  );
}



export default function Page() {
  const [running, setRunning] = useState(false);

  return (
    <div className="flex justify-center items-center h-dvh bg-zinc-800">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <SearchParamRenderer />
      </Suspense>
      <button
        className="absolute top-4 right-4 border-2 rounded-2xl px-4 py-2 text-2xl text-white hover:bg-white hover:text-black cursor-pointer"
        onClick={() => setRunning(prev => !prev)}
      >
        {running ? 'STOP' : 'START'}
      </button>
      <div
        className="relative"
        style={{
          width: '600px',
          height: '900px',
          backgroundImage: 'url("/images/squash_map.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <BallAnimation running={running} />
      </div>
    </div>
  );
}
