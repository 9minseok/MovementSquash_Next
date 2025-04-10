'use client';

import { useSearchParams } from "next/navigation";
import React from "react";

const Measure = () => {
  const searchParams = useSearchParams();
  const item = searchParams.get("item");

  return (
    <div
      className="flex items-center flex-col justify-center h-dvh text-5xl"
      style={{
        backgroundImage: 'url("/images/squash_map.png")',
        backgroundSize: '',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex item-center flex-col absolute top-10 text-black">
        <h1 className="text-3xl font-bold bg-opacity-60 p-2 rounded">
          Measure Page
        </h1>
        <p className="text-xl bg-opacity-50 p-2 rounded">
          선택한 메뉴: {item}
        </p>
      </div>
    </div>
  );
};

export default Measure;
