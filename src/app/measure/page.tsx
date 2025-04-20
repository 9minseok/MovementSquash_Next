'use client'

import { useState, useEffect, Suspense } from 'react';
import BallAnimation from './BallAnimation';
import SearchParamRenderer from './SearchParamRenderer';
import useMeasureStore from '@/stores/measureStore';

export default function Page() {
  const [running, setRunning] = useState(false);
  const { name, gender, level, second } = useMeasureStore();

  const [finalScore, setFinalScore] = useState<number | null>(null);

  // 🧠 running이 false로 바뀌는 순간 점수 계산
  useEffect(() => {
    if (!running) {
      const score = (level - 1) * 60 + (60 - second);
      if (score > 0) setFinalScore(score); // 훈련 시작 전 STOP 누르면 0점 방지
    }
  }, [running]);

  return (
    <div className="flex justify-center items-center h-dvh bg-zinc-800">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <SearchParamRenderer />
      </Suspense>

      {/* 📊 레벨 & 타이머 표시 */}
      <div className='absolute top-4 left-4 flex flex-col gap-2 text-2xl text-white'>
        <p>LEVEL : {level}</p>
        <p>TIME LEFT : {second}</p>
        <p>NAME : {name}</p>
        <p>GENDER : {gender}</p>
      </div>

      {/* 🎯 START / STOP 버튼 */}
      <button
        className="absolute top-4 right-4 border-2 rounded-2xl px-4 py-2 text-2xl text-white hover:bg-white hover:text-black cursor-pointer"
        onClick={() => {
          if (running) {
            // stop 시점에 점수 계산됨
            setRunning(false);
          } else {
            setFinalScore(null); // 새 훈련 시작 시 점수 초기화
            setRunning(true);
          }
        }}
      >
        {running ? 'STOP' : 'START'}
      </button>

      {/* 🏓 공 애니메이션 */}
      <div className="relative w-[90%] max-w-[600px] h-[80vh] bg-[url('/images/squash_map.png')] bg-cover bg-center bg-no-repeat">
        <BallAnimation running={running} />
      </div>

      {/* 🏁 점수 표시 */}
      {!running && finalScore !== null && (
        <div className="absolute bottom-8 text-white text-3xl font-bold bg-black/60 px-6 py-4 rounded-xl shadow-lg">
          {name} 님의 점수는 <span className="text-green-400">{finalScore}초</span> 입니다!
        </div>
      )}
    </div>
  );
}
