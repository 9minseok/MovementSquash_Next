"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
  return (
    <AuroraBackground>
      <div className="flex items-center justify-center flex-col h-dvh text-8xl gap-5 text-white z-99">
        <div>
          MOVEMENT
        </div>
        <div>
          SQUASH
        </div>
        <div>
          <Button variant="ghost" asChild>
            <Link href="/product">START</Link>
          </Button>
        </div>
      </div>
    </AuroraBackground>
  );
}
