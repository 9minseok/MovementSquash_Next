'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useMeasureStore from '@/stores/measureStore';

export default function SearchParamRenderer() {
  const { setLevel, setSecond } = useMeasureStore();
  const searchParams = useSearchParams();
  const item = searchParams.get('item');


  useEffect(() => {
    setLevel(1);
    setSecond(60);
  },[item]);
  
  return (
    <div className="flex item-center flex-col absolute top-3 text-white">
      <h1 className="text-3xl font-bold p-2 text-center">{item}</h1>
    </div>
  );
}
