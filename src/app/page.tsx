import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
  return (
    <AuroraBackground>
      <div className="flex items-center justify-center flex-col h-dvh text-8xl gap-5 text-white">
        <div>
          MOVEMENT
        </div>
        <div>
          SQUASH
        </div>
        <div>
          <Button>Click me</Button>
        </div>
      </div>
    </AuroraBackground>
  );
}
