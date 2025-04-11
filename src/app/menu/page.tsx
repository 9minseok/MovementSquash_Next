import React from "react";
import Link from "next/link";
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

const Menu = () => {
  const MenuList = ["VO2 MAX TEST", "LEVEL PRACTICE", "CUSTOM GHOSTING"];

  return (
    <div className="flex items-center justify-center h-dvh text-5xl bg-zinc-800">
      <Carousel className="w-[90vw]">
        <CarouselContent className="-ml-1">
          {MenuList.map((list, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3 ">
              <div className="p-1">
                <Link  href={{
                  pathname: "/measure",
                  query: { item: list }
                }} className="block">
                  <Card className="bg-zinc-500 cursor-pointer hover:bg-zinc-200 border-zinc-500">
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-5xl font-semibold text-white text-center">{list}</span>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Menu;
