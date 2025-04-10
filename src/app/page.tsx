"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const scrollToIntro = () => {
    const intro = document.getElementById("intro");
    if (intro) {
      intro.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen">
      <section className="relative w-full h-dvh overflow-hidden">
        <video
          src="/video/background_video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />

        <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-10" />

        <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-5 text-white z-10">
          <div className="text-8xl font-bold drop-shadow-xl">MOVEMENT</div>
          <div className="text-8xl font-bold drop-shadow-xl">SQUASH</div>
          <Button variant="ghost" asChild className="mt-10">
            <Link href="/menu">START</Link>
          </Button>

          <button
            onClick={scrollToIntro}
            className="mt-10 animate-bounce text-white hover:text-gray-300 transition-colors"
            aria-label="Scroll to intro"
          >
            <ChevronDown size={48} />
          </button>
        </div>
      </section>


      <section
        id="intro"
        className="p-10 text-center text-lg text-black bg-zinc-900 min-h-[60vh]"
      >
        <h2 className="text-3xl text-white font-semibold mb-4">사용 목적</h2>
        <div className="border-2 border-white h-150">

        </div>
      </section>

      <section
        id="intro"
        className="p-10 text-center text-lg text-black bg-white min-h-[60vh]"
      >
        <h2 className="text-3xl text-black font-semibold mb-4">코치진 & 시설안내</h2>
        <div className="border-2 border-black h-150">
        </div>
      </section>
    </div>
  );
}
