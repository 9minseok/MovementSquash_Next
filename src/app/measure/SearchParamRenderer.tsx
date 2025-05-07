'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchParamRenderer() {
  const searchParams = useSearchParams();
  const item = searchParams.get('item');
  
  return (
    <div className="flex item-center flex-col absolute top-3 text-white">
      <h1 className="text-3xl font-bold p-2 text-center">{item}</h1>
    </div>
  );
}
