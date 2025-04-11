'use client'

import { useState, Suspense } from 'react';
import BallAnimation from './BallAnimation';
import SearchParamRenderer from './SearchParamRenderer';
import useMeasureStore from '@/stores/measureStore';

export default function Page() {
  const [running, setRunning] = useState(false);
  const { round, second } = useMeasureStore();

  return (
    <div className="flex justify-center items-center h-dvh bg-zinc-800">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <SearchParamRenderer />
      </Suspense>
      <div className='absolute top-4 left-4 flex flex-col gap-2 text-2xl text-white'>
        <p>ROUND : {round}</p>
        <p>INTERVAL : {second}</p>
      </div>
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
