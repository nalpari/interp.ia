"use client";

import { useCountStore } from "@/store/count";
import React from "react";
import { Button } from "../ui/button";

export default function PresentationTestStore() {
  const { count, increment, decrement, paramSetting, resetCount } =
    useCountStore();

  return (
    <div className="flex gap-2 items-center justify-center flex-col">
      <div className="text-2xl">{count}</div>
      <div className="flex gap-2">
        <Button onClick={decrement}>-</Button>
        <Button onClick={increment}>+</Button>
      </div>
      <div className="flex">
        <Button onClick={() => paramSetting({ count: 500 })}>임의 숫자</Button>
      </div>
      <div className="flex">
        <Button onClick={resetCount}>리셋</Button>
      </div>
    </div>
  );
}
