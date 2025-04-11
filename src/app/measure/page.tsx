'use client'

import { useState, Suspense } from 'react';
import BallAnimation from './BallAnimation';
import SearchParamRenderer from './SearchParamRenderer';

export default function Page() {
  const [running, setRunning] = useState(false); // 예시용

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
        className="relative w-[90%] max-w-[600px] h-[80vh] bg-[url('/images/squash_map.png')] bg-cover bg-center bg-no-repeat"
      >
        <BallAnimation running={running} />
      </div>
    </div>
  );
}
