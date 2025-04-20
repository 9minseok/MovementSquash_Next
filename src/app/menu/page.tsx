'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useMeasureStore from '@/stores/measureStore';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Menu = () => {
  const MenuList = ["VO2 MAX TEST", "LEVEL PRACTICE", "CUSTOM GHOSTING"];

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { name, gender, setName, setGender } = useMeasureStore();

  const handleStart = () => {
    if (!name || !gender || !selectedItem) return;
    setName(name);
    setGender(gender);
    router.push(`/measure?item=${encodeURIComponent(selectedItem)}`);
    setOpen(false);
  };

  return (
    <>
      {/* 👇 모달은 가장 위에서 렌더링 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl mb-4">사용자 정보 입력</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">이름</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
  
            <div>
              <Label htmlFor="gender">성별</Label>
              <Input id="gender" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="남 / 여" />
            </div>
          </div>
  
          <DialogFooter>
            <Button onClick={handleStart} className="mt-4">시작하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  
      {/* 🏀 메인 화면 */}
      <div className="flex items-center justify-center h-dvh text-5xl bg-zinc-800">
        <Carousel className="w-[90vw]">
          <CarouselContent className="-ml-1">
            {MenuList.map((list, index) => (
              <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card
                    onClick={() => {
                      setSelectedItem(list);
                      setOpen(true); // 클릭 시 모달 열기
                    }}
                    className="bg-zinc-500 cursor-pointer hover:bg-zinc-200 border-zinc-500"
                  >
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-5xl font-semibold text-white text-center">{list}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
};

export default Menu;
