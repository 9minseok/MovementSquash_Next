'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import BallAnimation from './BallAnimation';
import SearchParamRenderer from './SearchParamRenderer';
import useMeasureStore from '@/stores/measureStore';

export default function Page() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const { name, gender, level, levelTerm, second, ballCount, CustomSet, CustomRep } = useMeasureStore();

  const [finalScore, setFinalScore] = useState<number | null>(null);

  useEffect(() => {
    if (running) {
      const id = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    } else {
      if (intervalId) clearInterval(intervalId);
    }
  
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [running]);

  // 🧠 running이 false로 바뀌는 순간 점수 계산
  useEffect(() => {
  if (!running && elapsedTime > 0) {
    let score = 0;
    if (gender === '남') {
      score = 0.0633 * elapsedTime + 13.694;
    } else if (gender === '여') {
      score = 0.0506 * elapsedTime + 18.802;
    }
    setFinalScore(parseFloat(score.toFixed(1)));
  }
}, [running]);
  

  useEffect(() => {
    setFinalScore(null);
  }, []);

  return (
    <div className="flex justify-center items-center h-dvh bg-zinc-800">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <SearchParamRenderer />
      </Suspense>

      {/* 📊 레벨 & 타이머 표시 */}
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <div className='absolute top-4 left-4 flex flex-col gap-2 text-2xl text-white'>
          {<p>POINT: {ballCount}개</p>}
          {<p>SET: {CustomSet}개</p>}
          {<p>REPS: {CustomRep}개</p>}
          {<p>LEVEL : {level}</p>}
          <p>INTERVAL : {(levelTerm / 1000).toFixed(2)}초</p>
          <p>TIME : {second}</p>
          {<p>NAME : {name}</p>}
          {<p>GENDER : {gender}</p>}
        </div>
      </Suspense>
      {/* 🎯 START / STOP 버튼 */}
      {!isFinished ? (
        <button
          className="absolute top-4 right-4 border-2 rounded-2xl px-4 py-2 text-2xl text-white hover:bg-white hover:text-black cursor-pointer"
          onClick={() => {
            if (running) {
              setRunning(false);
              setIsFinished(true);
            } else {
              setRunning(true);
              setFinalScore(null);
              setElapsedTime(0);
              setIsFinished(false);
            }
          }}
        >
          {running ? 'STOP' : 'START'}
        </button>
      ) : (
        <button
          className="absolute top-4 right-4 border-2 rounded-2xl px-4 py-2 text-2xl text-white hover:bg-white hover:text-black cursor-pointer"
          onClick={() => router.push('/menu')}
        >
          MENU
        </button>
      )}

      

      {/* 🏓 공 애니메이션 */}
      <div className="relative w-[90%] max-w-[600px] h-[80vh] bg-[url('/images/squash_map.png')] bg-cover bg-center bg-no-repeat">
        <BallAnimation running={running} />
      </div>

      {/* 🏁 점수 표시 */}
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        {!running && finalScore !== null && (
          <div className="absolute bottom-8 text-white text-3xl font-bold bg-black/60 px-6 py-4 rounded-xl shadow-lg">
            {name} 님의 VO2MAX 값은 <span className="text-green-400">{finalScore}</span> 입니다!
          </div>
        )}
      </Suspense>
    </div>
  );
}
