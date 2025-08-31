"use client";
import dynamic from "next/dynamic";
import main from "@/lib/main.json";
const Board = dynamic(() => import("@/components/board"), { ssr: false });

export default function MainBoard() {
  return (
    <main className="w-full p-8">
      <h1 className="text-2xl font-bold text-yellow-300 mb-4">Main Board</h1>
      <Board data={main} boardId="main" />
    </main>
  );
}
