'use client'

import React, { useState, useEffect } from "react";
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

const getIntervalByLevel = (level: number) => {
  const map: Record<number, number> = {
    1: 6000,
    2: 5540,
    3: 5140,
    4: 4800,
    5: 4500,
    6: 4240,
    7: 4000,
    8: 3790,
    9: 3600,
    10: 3430,
    11: 3270,
    12: 3130,
    13: 3000,
    14: 2880,
    15: 2770,
    16: 2670,
  };
  return map[level] || 1000; // 기본값: 너무 높은 level이면 fallback으로 1초
};

const Menu = () => {
  const MenuList = ["VO2 MAX TEST", "LEVEL PRACTICE", "CUSTOM GHOSTING"];

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [customLevel, setCustomLevel] = useState(1);

  const router = useRouter();
  const { name, setName, 
          gender, setGender, 
          ballCount, setballCount, 
          CustomSet, setCustomSet,
          CustomRep, setCustomRep,
          setLevel, 
          setLevelTerm, 
          setSecond } = useMeasureStore();

  const handleStart = () => {
    if (selectedItem === "VO2 MAX TEST") {
      if (!name || !gender) return;
      setLevel(1);
      setSecond(60);
      setLevelTerm(6000);
      setballCount(6);
    }

    if (selectedItem === "LEVEL PRACTICE") {
      if (customLevel > 16) {
        alert('최대 레벨은 16입니다.');
        return;
      }
      setSecond(60);
      setLevel(customLevel);
      setLevelTerm(getIntervalByLevel(customLevel));
      setballCount(6);
    }

    if (selectedItem === "CUSTOM GHOSTING") {
      setSecond(60);
      setLevelTerm(getIntervalByLevel(customLevel));
      setballCount(ballCount);
    }

    router.push(`/measure?item=${encodeURIComponent(selectedItem!)}`);
    setOpen(false);
  };

  useEffect(() => {
    setName('');
    setGender('');
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl mb-4">{
              selectedItem === "VO2 MAX TEST" ? "사용자 정보 입력" : selectedItem === "LEVEL PRACTICE" ? "레벨 설정" : "커스텀 훈련"
            }</DialogTitle>
          </DialogHeader>

          {selectedItem === "VO2 MAX TEST" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">이름</Label>
                <Input id="name" className="mt-2" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label>성별</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 text-base">
                    <input
                      type="radio"
                      name="gender"
                      value="남"
                      checked={gender === "남"}
                      onChange={() => setGender("남")}
                    />
                    남
                  </label>
                  <label className="flex items-center gap-2 text-base">
                    <input
                      type="radio"
                      name="gender"
                      value="여"
                      checked={gender === "여"}
                      onChange={() => setGender("여")}
                    />
                    여
                  </label>
                </div>
              </div>
            </div>
          )}

          {selectedItem === "LEVEL PRACTICE" && (
            <div className="space-y-4">
              <Label htmlFor="level">시작 레벨</Label>
              <Input
                id="level"
                type="number"
                min={1}
                max={16}
                value={customLevel}
                onChange={(e) => setCustomLevel(Number(e.target.value))}
              />
            </div>
          )}

          {selectedItem === "CUSTOM GHOSTING" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="level">공 개수</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 text-base">
                    <input
                      type="radio"
                      name="ballCount"
                      value="6"
                      checked={ballCount === 6}
                      onChange={() => setballCount(6)}
                    />
                    6
                  </label>
                  <label className="flex items-center gap-2 text-base">
                    <input
                      type="radio"
                      name="ballCount"
                      value="8"
                      checked={ballCount === 8}
                      onChange={() => setballCount(8)}
                    />
                    8
                  </label>
                  <label className="flex items-center gap-2 text-base">
                    <input
                      type="radio"
                      name="ballCount"
                      value="8"
                      checked={ballCount === 12}
                      onChange={() => setballCount(12)}
                    />
                    12
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="level">팝업 간격</Label>
                <Input id="name" className="mt-2" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="level">세트 수</Label>
                <Input
                  id="set"
                  type="number"
                  min={1}
                  max={20}
                  value={CustomSet}
                  onChange={(e) => setCustomSet(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="level">REPS</Label>
                <Input
                  id="rep"
                  type="number"
                  min={6}
                  max={40}
                  value={CustomRep}
                  onChange={(e) => setCustomRep(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleStart} className="mt-4">시작하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-center h-dvh text-5xl bg-zinc-800">
        <Carousel className="w-[90vw]">
          <CarouselContent className="-ml-1">
            {MenuList.map((list, index) => (
              <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card
                    onClick={() => {
                      setSelectedItem(list);
                      setOpen(true);
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
