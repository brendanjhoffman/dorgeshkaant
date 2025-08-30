"use client";
import dynamic from "next/dynamic";
import main from "@/lib/main.json";
const Board = dynamic(() => import("@/components/board"), { ssr: false });

export default function MainBoard() {
  return (
    <main className="w-full p-8">
      <Board data={main} boardId="main" />
    </main>
  );
}
