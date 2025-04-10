'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// 🔧 SearchParamRenderer 컴포넌트로 분리
function SearchParamRenderer() {
  const searchParams = useSearchParams();
  const item = searchParams.get("item");

  return (
    <div className="flex item-center flex-col absolute top-10 text-white">
      <h1 className="text-3xl font-bold bg-opacity-60 p-2 rounded">
        Measure Page
      </h1>
      <p className="text-xl bg-opacity-50 p-2 rounded">
        선택한 메뉴: {item}
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <div
      className="flex items-center flex-col justify-center h-dvh text-5xl bg-zinc-800"
      style={{
        backgroundImage: 'url("/images/squash_map.png")',
        backgroundSize: '',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <SearchParamRenderer />
      </Suspense>
    </div>
  );
}
