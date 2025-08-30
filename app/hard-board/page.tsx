"use client";
import dynamic from "next/dynamic";
import hard from "@/lib/hard.json";
const Board = dynamic(() => import("@/components/board"), { ssr: false });

export default function HardBoard() {
  return (
    <main className="w-full p-8">
      <Board data={hard} boardId="hard" />
    </main>
  );
}
